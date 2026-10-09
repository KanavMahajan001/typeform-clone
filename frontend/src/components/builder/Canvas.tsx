"use client";

import { useState } from "react";
import { questionMeta } from "@/lib/questions";
import type { AnswerValue } from "@/lib/types";
import { FormFooter } from "@/components/form/FormFooter";
import { OkButton } from "@/components/form/OkButton";
import { QuestionNumber } from "@/components/form/QuestionHeader";
import { QuestionField } from "@/components/form/QuestionField";
import { OPTION_KEYS, THEME } from "@/components/form/theme";
import { ThankYou } from "@/components/form/ThankYou";
import { CloseIcon, PlusIcon } from "@/components/ui/Icons";
import type { SaveStatus } from "./Builder";
import type { Draft } from "./draft";

const STATUS_TEXT: Record<SaveStatus, string> = {
  saved: "All changes saved",
  saving: "Saving…",
  error: "Changes not saved",
};

function AutoTextarea({
  value,
  onChange,
  placeholder,
  className,
  style,
  autoFocus,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className: string;
  style?: React.CSSProperties;
  autoFocus?: boolean;
}) {
  return (
    <textarea
      rows={1}
      autoFocus={autoFocus}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      ref={(element) => {
        if (!element) return;
        element.style.height = "auto";
        element.style.height = `${element.scrollHeight}px`;
      }}
      className={`w-full resize-none bg-transparent outline-none placeholder:opacity-40 ${className}`}
      style={style}
    />
  );
}

function OptionEditor({ options, onChange }: { options: string[]; onChange: (options: string[]) => void }) {
  const set = (index: number, label: string) => onChange(options.map((option, i) => (i === index ? label : option)));
  return (
    <div className="flex flex-col items-start gap-2">
      {options.map((option, index) => (
        <div
          key={index}
          className="group flex min-h-10 min-w-[12.5rem] items-center gap-3 rounded border px-2 py-1 text-xl"
          style={{ color: THEME.answer, borderColor: THEME.answerBorder, background: THEME.answerSoft }}
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-sm border bg-white text-xs font-bold" style={{ borderColor: THEME.answerBorder }}>
            {OPTION_KEYS[index]}
          </span>
          <input
            value={option}
            placeholder={`Choice ${index + 1}`}
            onChange={(event) => set(index, event.target.value)}
            className="w-44 bg-transparent outline-none placeholder:opacity-40"
          />
          <button
            type="button"
            aria-label="Remove choice"
            onClick={() => onChange(options.filter((_, i) => i !== index))}
            className="opacity-0 transition-opacity group-hover:opacity-100"
          >
            <CloseIcon width={14} height={14} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...options, `Choice ${options.length + 1}`])}
        className="flex items-center gap-1 text-sm underline underline-offset-2"
        style={{ color: THEME.answer }}
      >
        <PlusIcon width={14} height={14} />
        Add choice
      </button>
    </div>
  );
}

interface Props {
  question: Draft | null;
  index: number;
  total: number;
  status: SaveStatus;
  onChange: (changes: Partial<Draft>) => void;
}

function AnswerPreview({ question }: { question: Draft }) {
  const [value, setValue] = useState<AnswerValue>(null);
  return <QuestionField key={question.key} type={question.type} options={[]} value={value} onChange={setValue} />;
}

export function Canvas({ question, index, total, status, onChange }: Props) {
  return (
    <section className="hidden min-w-0 flex-1 flex-col bg-admin-bg lg:flex">
      <div className="flex h-10 items-center justify-end px-4 text-xs text-admin-muted">{STATUS_TEXT[status]}</div>
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto px-8 pb-8">
        <div className="relative aspect-[16/10] w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
          {question ? (
            <div className="flex h-full items-center px-16">
              <div className="flex w-full max-w-2xl gap-3">
                <QuestionNumber number={index + 1} />
                <div className="flex min-w-0 flex-1 flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <AutoTextarea
                      key={question.key}
                      autoFocus={!question.title}
                      value={question.title}
                      onChange={(title) => onChange({ title })}
                      placeholder="Your question here."
                      className="text-2xl leading-8"
                      style={{ color: THEME.question }}
                    />
                    {question.description !== null && (
                      <AutoTextarea
                        value={question.description}
                        onChange={(description) => onChange({ description })}
                        placeholder="Description (optional)"
                        className="text-xl leading-7 opacity-70"
                        style={{ color: THEME.question }}
                      />
                    )}
                  </div>
                  {questionMeta(question.type).hasOptions ? (
                    <OptionEditor options={question.options} onChange={(options) => onChange({ options })} />
                  ) : (
                    <AnswerPreview question={question} />
                  )}
                  <OkButton label={index === total - 1 ? "Submit" : "OK"} />
                </div>
              </div>
            </div>
          ) : (
            <ThankYou preview />
          )}
          <FormFooter canPrev={index > 0} canNext={question !== null && index < total - 1} />
        </div>
      </div>
    </section>
  );
}
