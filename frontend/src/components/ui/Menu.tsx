"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export interface MenuItem {
  label: string;
  onSelect: () => void;
  danger?: boolean;
  icon?: ReactNode;
}

interface Props {
  trigger: ReactNode;
  items: MenuItem[];
  align?: "left" | "right";
}

export function Menu({ trigger, items, align = "right" }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <div
        onClick={(event) => {
          event.stopPropagation();
          setOpen((value) => !value);
        }}
      >
        {trigger}
      </div>
      {open && (
        <div
          className={`absolute top-full z-30 mt-1 min-w-44 rounded-lg border border-admin-border bg-white py-1 text-sm shadow-[0_4px_16px_rgba(0,0,0,0.12)] ${align === "right" ? "right-0" : "left-0"}`}
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setOpen(false);
                item.onSelect();
              }}
              className={`flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-admin-hover ${item.danger ? "text-danger" : ""}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
