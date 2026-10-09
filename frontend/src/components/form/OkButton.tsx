import { CheckIcon } from "@/components/ui/Icons";
import { THEME } from "./theme";

interface Props {
  label?: string;
  hint?: string;
  onClick?: () => void;
}

export function OkButton({ label = "OK", hint = "press Enter ↵", onClick }: Props) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onClick}
        className="flex h-10 items-center gap-2 rounded px-3.5 text-xl font-bold text-white transition-opacity hover:opacity-90"
        style={{ background: THEME.answer }}
      >
        {label}
        <CheckIcon width={18} height={18} />
      </button>
      <span className="text-xs" style={{ color: THEME.question }}>
        {hint}
      </span>
    </div>
  );
}
