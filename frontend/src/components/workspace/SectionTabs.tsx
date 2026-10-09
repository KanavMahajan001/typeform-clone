"use client";

import type { ReactNode } from "react";
import { toast } from "sonner";
import { BoltIcon, ChartIcon, FlaskIcon, FormIcon, GemIcon, PagesIcon, UsersIcon } from "@/components/ui/Icons";

const TABS: { label: string; icon: ReactNode; badge?: ReactNode; divider?: boolean }[] = [
  { label: "Forms", icon: <FormIcon width={18} height={18} /> },
  { label: "Contacts", icon: <UsersIcon width={18} height={18} /> },
  { label: "Automations", icon: <BoltIcon width={18} height={18} /> },
  {
    label: "Insights",
    icon: <ChartIcon width={18} height={18} />,
    badge: (
      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#1f7a5a] text-[#1f7a5a]">
        <GemIcon width={12} height={12} />
      </span>
    ),
  },
  {
    label: "Pages",
    icon: <PagesIcon width={18} height={18} />,
    badge: <span className="rounded-md border border-[#9fc4ef] bg-[#eaf3fd] px-2 py-0.5 text-xs text-[#1f4e8c]">Beta</span>,
  },
  { label: "Research Flow", icon: <FlaskIcon width={18} height={18} />, divider: true },
];

export function SectionTabs() {
  return (
    <nav className="mx-4 mt-6 flex items-center overflow-x-auto border-b border-admin-border lg:mx-6">
      {TABS.map(({ label, icon, badge, divider }) => {
        const active = label === "Forms";
        return (
          <div key={label} className="flex items-center">
            {divider && <span className="mx-3 h-6 w-px bg-admin-border" />}
            <button
              type="button"
              onClick={() => !active && toast(`${label} is coming soon`)}
              className={`relative flex h-12 items-center gap-2 whitespace-nowrap rounded-t-lg px-4 text-base ${active ? "bg-admin-bg font-medium" : "hover:bg-admin-hover"}`}
            >
              {icon}
              {label}
              {badge}
              {active && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-admin-text" />}
            </button>
          </div>
        );
      })}
    </nav>
  );
}
