"use client";

interface Props {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}

export function Toggle({ checked, onChange, label }: Props) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 py-2 text-sm">
      <span>{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 flex-none rounded-full transition-colors ${checked ? "bg-admin-text" : "bg-ink-300"}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`}
        />
      </button>
    </label>
  );
}
