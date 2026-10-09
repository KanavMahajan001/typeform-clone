"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { ChevronUpIcon, LayersIcon, PlusIcon, SearchIcon } from "@/components/ui/Icons";
import { CreateFormModal } from "./CreateFormModal";

const RESPONSE_LIMIT = 10;

export function Sidebar({ formCount, responseCount }: { formCount: number; responseCount: number }) {
  const [creating, setCreating] = useState(false);
  const [expanded, setExpanded] = useState(true);

  return (
    <aside className="flex w-80 flex-none flex-col bg-admin-bg">
      <div className="p-5">
        <Button className="h-11 w-full text-base" onClick={() => setCreating(true)}>
          <PlusIcon width={18} height={18} />
          Create form
        </Button>
      </div>
      <label className="flex h-14 items-center gap-3 border-y border-admin-border px-7 text-base text-admin-muted">
        <SearchIcon width={18} height={18} />
        <input placeholder="Search" className="w-full bg-transparent outline-none placeholder:text-admin-muted" />
      </label>
      <nav className="flex flex-col gap-1 p-5 text-base">
        <div className="flex items-center justify-between px-2 py-1">
          <span className="flex items-center gap-2 font-medium">
            <LayersIcon width={18} height={18} />
            Workspaces
          </span>
          <Button
            variant="secondary"
            size="sm"
            aria-label="Add workspace"
            className="px-2"
            onClick={() => toast("Multiple workspaces are coming soon")}
          >
            <PlusIcon />
          </Button>
        </div>
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="flex items-center justify-between px-4 py-3 font-medium"
        >
          Private
          <ChevronUpIcon className={`text-admin-muted transition-transform ${expanded ? "" : "rotate-180"}`} />
        </button>
        {expanded && (
          <span className="flex items-center justify-between rounded-lg bg-admin-hover px-4 py-3 font-medium">
            My workspace
            <span className="text-sm text-purple-700">{formCount}</span>
          </span>
        )}
      </nav>
      <div className="mt-auto border-t border-admin-border p-5 text-base">
        <p>Responses collected</p>
        <div className="mt-3 h-1 rounded-full bg-admin-border">
          <div
            className="h-full rounded-full bg-admin-text"
            style={{ width: `${Math.min(100, (responseCount / RESPONSE_LIMIT) * 100)}%` }}
          />
        </div>
        <p className="mt-3">
          <strong className="font-medium">{responseCount}</strong>
          <span className="text-sm text-admin-muted"> / {RESPONSE_LIMIT}</span>
        </p>
        <Button variant="secondary" className="mt-4" onClick={() => toast("Plans and billing are coming soon")}>
          Increase response limit
        </Button>
      </div>
      <CreateFormModal open={creating} onClose={() => setCreating(false)} />
    </aside>
  );
}
