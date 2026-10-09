"use client";

import { useState } from "react";
import { LogoIcon } from "@/components/landing/Logo";
import { Button } from "@/components/ui/Button";
import { ChevronDownIcon, FolderIcon, PlusIcon, SearchIcon } from "@/components/ui/Icons";
import { CreateFormModal } from "./CreateFormModal";

export function Sidebar() {
  const [creating, setCreating] = useState(false);

  return (
    <aside className="flex w-64 flex-none flex-col border-r border-admin-border bg-admin-bg px-4 py-5">
      <div className="mb-6 flex items-center gap-2 px-2">
        <LogoIcon className="h-4 w-7" />
        <button type="button" className="flex items-center gap-1 text-sm font-medium">
          Kanav Mahajan
          <ChevronDownIcon />
        </button>
      </div>
      <Button className="w-full" onClick={() => setCreating(true)}>
        <PlusIcon />
        Create a new form
      </Button>
      <label className="mt-4 flex h-9 items-center gap-2 rounded-lg border border-admin-border bg-white px-3 text-sm text-admin-muted">
        <SearchIcon />
        <input placeholder="Search" className="w-full bg-transparent outline-none placeholder:text-admin-muted" />
      </label>
      <nav className="mt-6 flex flex-col gap-1 text-sm">
        <p className="px-2 pb-1 text-xs font-medium uppercase tracking-wide text-admin-muted">Private</p>
        <span className="flex items-center gap-2 rounded-lg bg-white px-2 py-2 font-medium shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
          <FolderIcon />
          My workspace
        </span>
      </nav>
      <div className="mt-auto rounded-lg border border-admin-border bg-white p-3 text-xs">
        <p className="font-medium">Free plan</p>
        <p className="mt-1 text-admin-muted">Responses collected this month</p>
        <div className="mt-2 h-1.5 rounded-full bg-admin-border">
          <div className="h-full w-1/3 rounded-full bg-admin-text" />
        </div>
      </div>
      <CreateFormModal open={creating} onClose={() => setCreating(false)} />
    </aside>
  );
}
