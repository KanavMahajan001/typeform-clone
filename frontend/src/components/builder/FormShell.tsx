"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { FormSummary } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { CheckIcon, ChevronLeftIcon, EyeIcon } from "@/components/ui/Icons";

const TABS = ["create", "connect", "share", "results"] as const;

export function FormShell({ form, children }: { form: FormSummary; children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [title, setTitle] = useState(form.title);
  const [publishing, setPublishing] = useState(false);
  const base = `/forms/${form.id}`;

  const rename = async () => {
    const next = title.trim();
    if (!next || next === form.title) return setTitle(form.title);
    await api.updateForm(form.id, { title: next });
    router.refresh();
  };

  const publish = async () => {
    setPublishing(true);
    try {
      await api.updateForm(form.id, { status: "published" });
      toast.success("Your form is published and ready to share");
      router.refresh();
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-white text-admin-text">
      <header className="grid h-14 flex-none grid-cols-[1fr_auto_1fr] items-center border-b border-admin-border px-4">
        <div className="flex min-w-0 items-center gap-1 text-sm">
          <Link href="/forms" aria-label="Back to workspace" className="rounded-md p-1 hover:bg-admin-hover">
            <ChevronLeftIcon width={18} height={18} />
          </Link>
          <Link href="/forms" className="text-admin-muted hover:text-admin-text">
            My workspace
          </Link>
          <span className="text-admin-muted">/</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onBlur={rename}
            onKeyDown={(event) => event.key === "Enter" && event.currentTarget.blur()}
            aria-label="Form title"
            className="min-w-0 flex-1 rounded-md px-2 py-1 font-medium outline-none hover:bg-admin-hover focus:bg-admin-hover"
          />
        </div>
        <nav className="flex h-14 items-center gap-2">
          {TABS.map((tab) => {
            const active = pathname.startsWith(`${base}/${tab}`);
            return (
              <Link
                key={tab}
                href={`${base}/${tab}`}
                className={`relative flex h-14 items-center px-3 text-sm capitalize ${active ? "font-medium" : "text-admin-muted hover:text-admin-text"}`}
              >
                {tab}
                {active && <span className="absolute inset-x-3 bottom-0 h-0.5 bg-admin-text" />}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center justify-end gap-2">
          <Link href={`${base}/preview`} target="_blank" aria-label="Preview" className="rounded-md p-2 hover:bg-admin-hover">
            <EyeIcon width={18} height={18} />
          </Link>
          {form.status === "published" ? (
            <Button variant="secondary" onClick={() => router.push(`${base}/share`)}>
              <CheckIcon width={14} height={14} />
              Published
            </Button>
          ) : (
            <Button onClick={publish} disabled={publishing}>
              Publish
            </Button>
          )}
        </div>
      </header>
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}
