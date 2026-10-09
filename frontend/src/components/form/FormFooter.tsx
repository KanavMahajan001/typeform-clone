import Link from "next/link";
import { ArrowDownIcon, ArrowUpIcon } from "@/components/ui/Icons";
import { THEME } from "./theme";

interface Props {
  onPrev?: () => void;
  onNext?: () => void;
  canPrev: boolean;
  canNext: boolean;
}

export function FormFooter({ onPrev, onNext, canPrev, canNext }: Props) {
  return (
    <div className="absolute bottom-4 right-4 flex items-center gap-2">
      <div className="flex overflow-hidden rounded" style={{ background: THEME.answer }}>
        <button
          type="button"
          aria-label="Previous question"
          disabled={!canPrev}
          onClick={onPrev}
          className="flex h-8 w-8 items-center justify-center text-white transition-opacity hover:bg-black/10 disabled:opacity-40"
        >
          <ArrowUpIcon />
        </button>
        <span className="my-1.5 w-px bg-white/30" />
        <button
          type="button"
          aria-label="Next question"
          disabled={!canNext}
          onClick={onNext}
          className="flex h-8 w-8 items-center justify-center text-white transition-opacity hover:bg-black/10 disabled:opacity-40"
        >
          <ArrowDownIcon />
        </button>
      </div>
      <Link
        href="/"
        className="flex h-8 items-center rounded border border-black/10 bg-white px-2.5 text-sm font-bold text-black shadow-sm"
      >
        Powered by Typeform
      </Link>
    </div>
  );
}
