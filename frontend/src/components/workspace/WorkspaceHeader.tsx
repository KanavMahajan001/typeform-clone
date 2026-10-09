"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { CalendarIcon, ChevronDownIcon, GemIcon, GridIcon, ListIcon, MoreIcon, UserAddIcon } from "@/components/ui/Icons";
import { Menu } from "@/components/ui/Menu";

export type SortKey = "created_at" | "updated_at" | "title";
export type View = "list" | "grid";

export const SORTS: Record<SortKey, string> = {
  created_at: "Date created",
  updated_at: "Date updated",
  title: "Alphabetical",
};

interface Props {
  sort: SortKey;
  view: View;
  onSort: (sort: SortKey) => void;
  onView: (view: View) => void;
}

export function WorkspaceHeader({ sort, view, onSort, onView }: Props) {
  return (
    <div className="mb-8 flex items-center justify-between border-b border-admin-border pb-6">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-light">My workspace</h1>
        <Button variant="ghost" aria-label="Workspace options" className="px-2" onClick={() => toast("Workspace settings are coming soon")}>
          <MoreIcon />
        </Button>
        <Button variant="ghost" onClick={() => toast("Team collaboration is coming soon")}>
          <UserAddIcon width={18} height={18} />
          Invite
        </Button>
        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#1f7a5a] text-[#1f7a5a]">
          <GemIcon width={12} height={12} />
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Menu
          trigger={
            <Button variant="secondary">
              <CalendarIcon width={18} height={18} />
              {SORTS[sort]}
              <ChevronDownIcon />
            </Button>
          }
          items={(Object.keys(SORTS) as SortKey[]).map((key) => ({ label: SORTS[key], onSelect: () => onSort(key) }))}
        />
        <div className="flex rounded-lg border border-admin-border p-0.5">
          {(["list", "grid"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => onView(key)}
              className={`flex h-9 items-center gap-2 rounded-md px-3 text-sm capitalize ${view === key ? "bg-admin-hover font-medium" : "text-admin-muted hover:text-admin-text"}`}
            >
              {key === "list" ? <ListIcon width={18} height={18} /> : <GridIcon width={18} height={18} />}
              {key}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
