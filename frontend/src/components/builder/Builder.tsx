"use client";

import { arrayMove } from "@dnd-kit/sortable";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { FormDetail, QuestionType } from "@/lib/types";
import { Canvas } from "./Canvas";
import { defaultOptions, ENDING_KEY, newDraft, toDraft, toInput, type Draft } from "./draft";
import { QuestionList } from "./QuestionList";
import { Settings } from "./Settings";

export type SaveStatus = "saved" | "saving" | "error";

export function Builder({ form }: { form: FormDetail }) {
  const [questions, setQuestions] = useState<Draft[]>(() => form.questions.map(toDraft));
  const [selectedKey, setSelectedKey] = useState<string>(questions[0]?.key ?? ENDING_KEY);
  const [version, setVersion] = useState(0);
  const [status, setStatus] = useState<SaveStatus>("saved");
  const latest = useRef(questions);
  latest.current = questions;

  useEffect(() => {
    if (version === 0) return;
    setStatus("saving");
    const timer = setTimeout(async () => {
      const snapshot = latest.current;
      try {
        const saved = await api.saveQuestions(form.id, snapshot.map(toInput));
        setQuestions((current) =>
          current.map((question) => {
            const index = snapshot.findIndex((item) => item.key === question.key);
            return index >= 0 && question.id === undefined ? { ...question, id: saved[index].id } : question;
          }),
        );
        setStatus("saved");
      } catch {
        setStatus("error");
        toast.error("Couldn't save your changes");
      }
    }, 700);
    return () => clearTimeout(timer);
  }, [version, form.id]);

  const update = (mutate: (current: Draft[]) => Draft[]) => {
    setQuestions(mutate);
    setVersion((value) => value + 1);
  };

  const add = (type: QuestionType) => {
    const draft = newDraft(type);
    update((current) => [...current, draft]);
    setSelectedKey(draft.key);
  };

  const patch = (key: string, changes: Partial<Draft>) =>
    update((current) => current.map((question) => (question.key === key ? { ...question, ...changes } : question)));

  const changeType = (key: string, type: QuestionType) =>
    update((current) =>
      current.map((question) =>
        question.key === key
          ? { ...question, type, options: question.options.length ? question.options : defaultOptions(type) }
          : question,
      ),
    );

  const remove = (key: string) => {
    const index = questions.findIndex((question) => question.key === key);
    const remaining = questions.filter((question) => question.key !== key);
    update(() => remaining);
    if (selectedKey === key) setSelectedKey(remaining[Math.min(index, remaining.length - 1)]?.key ?? ENDING_KEY);
  };

  const duplicate = (key: string) => {
    const index = questions.findIndex((question) => question.key === key);
    const copy: Draft = { ...questions[index], key: crypto.randomUUID(), id: undefined };
    update((current) => [...current.slice(0, index + 1), copy, ...current.slice(index + 1)]);
    setSelectedKey(copy.key);
  };

  const move = (from: number, to: number) => update((current) => arrayMove(current, from, to));

  const selected = questions.find((question) => question.key === selectedKey) ?? null;
  const selectedIndex = selected ? questions.indexOf(selected) : -1;

  return (
    <div className="flex h-full">
      <QuestionList
        questions={questions}
        selectedKey={selectedKey}
        onSelect={setSelectedKey}
        onAdd={add}
        onMove={move}
        onDuplicate={duplicate}
        onRemove={remove}
      />
      <Canvas
        question={selected}
        index={selectedIndex}
        total={questions.length}
        status={status}
        onChange={(changes) => selected && patch(selected.key, changes)}
      />
      <Settings
        question={selected}
        onChange={(changes) => selected && patch(selected.key, changes)}
        onChangeType={(type) => selected && changeType(selected.key, type)}
      />
    </div>
  );
}
