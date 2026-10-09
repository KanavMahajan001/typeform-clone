import { ArrowRightIcon } from "@/components/ui/Icons";
import { THEME } from "./theme";

export function QuestionNumber({ number }: { number: number }) {
  return (
    <span className="flex h-8 flex-none items-center gap-1 text-base" style={{ color: THEME.answer }}>
      {number}
      <ArrowRightIcon width={14} height={14} />
    </span>
  );
}

export function QuestionTitle({ title, required }: { title: string; required: boolean }) {
  return (
    <h1 className="text-2xl leading-8" style={{ color: THEME.question }}>
      {title || "..."}
      {required && <span style={{ color: THEME.error }}>*</span>}
    </h1>
  );
}

export function QuestionDescription({ text }: { text: string | null }) {
  if (!text) return null;
  return (
    <p className="text-xl leading-7 opacity-70" style={{ color: THEME.question }}>
      {text}
    </p>
  );
}
