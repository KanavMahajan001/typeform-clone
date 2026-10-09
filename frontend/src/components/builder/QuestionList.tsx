"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import type { QuestionType } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { CopyIcon, GripIcon, MoreIcon, PlusIcon, TrashIcon } from "@/components/ui/Icons";
import { Menu } from "@/components/ui/Menu";
import { AddContent } from "./AddContent";
import { ENDING_KEY, type Draft } from "./draft";
import { TypeBadge } from "./TypeBadge";

interface Props {
  questions: Draft[];
  selectedKey: string;
  onSelect: (key: string) => void;
  onAdd: (type: QuestionType) => void;
  onMove: (from: number, to: number) => void;
  onDuplicate: (key: string) => void;
  onRemove: (key: string) => void;
}

function Item({
  question,
  index,
  selected,
  onSelect,
  onDuplicate,
  onRemove,
}: {
  question: Draft;
  index: number;
  selected: boolean;
  onSelect: () => void;
  onDuplicate: () => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: question.key });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      onClick={onSelect}
      className={`group flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm ${selected ? "bg-admin-hover" : "hover:bg-admin-hover/60"} ${isDragging ? "z-10 opacity-80 shadow-lg" : ""}`}
    >
      <button
        type="button"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
        className="cursor-grab text-admin-muted opacity-0 group-hover:opacity-100 active:cursor-grabbing"
      >
        <GripIcon />
      </button>
      <TypeBadge type={question.type} number={index + 1} size="sm" />
      <span className={`min-w-0 flex-1 truncate ${question.title ? "" : "text-admin-muted"}`}>{question.title || "..."}</span>
      <div className="opacity-0 group-hover:opacity-100">
        <Menu
          trigger={
            <button type="button" aria-label="Question actions" className="rounded p-1 text-admin-muted hover:bg-admin-border">
              <MoreIcon />
            </button>
          }
          items={[
            { label: "Duplicate", onSelect: onDuplicate, icon: <CopyIcon /> },
            { label: "Delete", onSelect: onRemove, danger: true, icon: <TrashIcon /> },
          ]}
        />
      </div>
    </li>
  );
}

export function QuestionList({ questions, selectedKey, onSelect, onAdd, onMove, onDuplicate, onRemove }: Props) {
  const [adding, setAdding] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const keys = questions.map((question) => question.key);
    onMove(keys.indexOf(String(active.id)), keys.indexOf(String(over.id)));
  };

  return (
    <aside className="hidden w-80 flex-none flex-col border-r border-admin-border lg:flex">
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-sm font-medium">Content</h2>
        <Button size="sm" onClick={() => setAdding(true)}>
          <PlusIcon />
          Add content
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-2">
        <DndContext id="questions" sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={questions.map((question) => question.key)} strategy={verticalListSortingStrategy}>
            <ul className="flex flex-col gap-0.5">
              {questions.map((question, index) => (
                <Item
                  key={question.key}
                  question={question}
                  index={index}
                  selected={question.key === selectedKey}
                  onSelect={() => onSelect(question.key)}
                  onDuplicate={() => onDuplicate(question.key)}
                  onRemove={() => onRemove(question.key)}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
        {questions.length === 0 && (
          <p className="px-2 py-6 text-center text-sm text-admin-muted">Add your first question to get started.</p>
        )}
        <h2 className="px-2 pb-2 pt-6 text-sm font-medium">Endings</h2>
        <button
          type="button"
          onClick={() => onSelect(ENDING_KEY)}
          className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm ${selectedKey === ENDING_KEY ? "bg-admin-hover" : "hover:bg-admin-hover/60"}`}
        >
          <span className="inline-flex h-6 items-center rounded-md bg-admin-bg px-1.5 text-xs font-medium text-admin-muted">A</span>
          Thank you screen
        </button>
      </div>
      <AddContent open={adding} onClose={() => setAdding(false)} onPick={onAdd} />
    </aside>
  );
}
