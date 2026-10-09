"use client";

import { useState } from "react";
import { QUESTION_TYPES, questionMeta } from "@/lib/questions";
import type { QuestionType } from "@/lib/types";
import { ChevronDownIcon } from "@/components/ui/Icons";
import { Menu } from "@/components/ui/Menu";
import { Toggle } from "@/components/ui/Toggle";
import type { Draft } from "./draft";
import { TypeBadge } from "./TypeBadge";

const TABS = ["Question", "Design", "Logic"] as const;

const PLACEHOLDERS: Record<string, string> = {
  Design: "Themes, fonts, colors and backgrounds are coming soon.",
  Logic: "Logic jumps and conditional branching are coming soon.",
};

interface Props {
  question: Draft | null;
  onChange: (changes: Partial<Draft>) => void;
  onChangeType: (type: QuestionType) => void;
}

function ComingSoon({ text }: { text: string }) {
  return (
    <div className="m-4 rounded-lg border border-dashed border-admin-border p-4 text-sm text-admin-muted">
      <p className="mb-1 font-medium text-admin-text">Coming soon</p>
      {text}
    </div>
  );
}

export function Settings({ question, onChange, onChangeType }: Props) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Question");

  return (
    <aside className="flex w-80 flex-none flex-col border-l border-admin-border">
      <div className="flex border-b border-admin-border">
        {TABS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={`relative flex-1 py-3 text-sm ${tab === item ? "font-medium" : "text-admin-muted hover:text-admin-text"}`}
          >
            {item}
            {tab === item && <span className="absolute inset-x-4 bottom-0 h-0.5 bg-admin-text" />}
          </button>
        ))}
      </div>
      {tab !== "Question" ? (
        <ComingSoon text={PLACEHOLDERS[tab]} />
      ) : question === null ? (
        <ComingSoon text="Customizing the thank you screen is coming soon." />
      ) : (
        <div className="flex flex-col gap-6 p-4">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-admin-muted">Type</p>
            <Menu
              align="left"
              trigger={
                <button
                  type="button"
                  className="flex h-10 w-full items-center gap-2 rounded-lg border border-admin-border px-2 text-sm hover:bg-admin-hover"
                >
                  <TypeBadge type={question.type} size="sm" />
                  {questionMeta(question.type).label}
                  <ChevronDownIcon className="ml-auto" />
                </button>
              }
              items={QUESTION_TYPES.map((meta) => ({
                label: meta.label,
                icon: <TypeBadge type={meta.type} size="sm" />,
                onSelect: () => onChangeType(meta.type),
              }))}
            />
          </div>
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-admin-muted">Settings</p>
            <Toggle label="Required" checked={question.required} onChange={(required) => onChange({ required })} />
            <Toggle
              label="Description"
              checked={question.description !== null}
              onChange={(enabled) => onChange({ description: enabled ? "" : null })}
            />
          </div>
        </div>
      )}
    </aside>
  );
}
