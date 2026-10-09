"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { pluralize, timeAgo } from "@/lib/format";
import type { FormSummary } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { CopyIcon, FormIcon, MoreIcon, TrashIcon } from "@/components/ui/Icons";
import { Menu } from "@/components/ui/Menu";
import { Modal } from "@/components/ui/Modal";

function RenameModal({ form, onClose }: { form: FormSummary | null; onClose: () => void }) {
  const router = useRouter();
  const [title, setTitle] = useState(form?.title ?? "");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form || !title.trim()) return;
    await api.updateForm(form.id, { title: title.trim() });
    toast.success("Form renamed");
    onClose();
    router.refresh();
  };

  return (
    <Modal open={form !== null} onClose={onClose} title="Rename form">
      <form onSubmit={submit} className="flex flex-col gap-4">
        <input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} className="form-input" />
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!title.trim()}>
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function DeleteModal({ form, onClose }: { form: FormSummary | null; onClose: () => void }) {
  const router = useRouter();

  const confirm = async () => {
    if (!form) return;
    await api.deleteForm(form.id);
    toast.success("Form deleted");
    onClose();
    router.refresh();
  };

  return (
    <Modal open={form !== null} onClose={onClose} title="Delete this form?">
      <p className="text-sm text-admin-muted">
        “{form?.title}” and its {pluralize(form?.response_count ?? 0, "response")} will be permanently deleted.
      </p>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button className="bg-danger hover:bg-danger" onClick={confirm}>
          Delete
        </Button>
      </div>
    </Modal>
  );
}

export function FormList({ forms }: { forms: FormSummary[] }) {
  const router = useRouter();
  const [renaming, setRenaming] = useState<FormSummary | null>(null);
  const [deleting, setDeleting] = useState<FormSummary | null>(null);

  const duplicate = async (form: FormSummary) => {
    await api.duplicateForm(form.id);
    toast.success("Form duplicated");
    router.refresh();
  };

  return (
    <>
      <div className="grid grid-cols-[1fr_8rem_8rem_8rem_3rem] items-center px-4 pb-2 text-xs font-medium uppercase tracking-wide text-admin-muted">
        <span>Name</span>
        <span>Responses</span>
        <span>Updated</span>
        <span>Status</span>
      </div>
      <ul className="divide-y divide-admin-border rounded-xl border border-admin-border">
        {forms.map((form) => (
          <li
            key={form.id}
            onClick={() => router.push(`/forms/${form.id}/create`)}
            className="grid cursor-pointer grid-cols-[1fr_8rem_8rem_8rem_3rem] items-center px-4 py-3 text-sm transition-colors hover:bg-admin-hover"
          >
            <span className="flex min-w-0 items-center gap-3">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-admin-bg text-admin-muted">
                <FormIcon width={18} height={18} />
              </span>
              <span className="truncate font-medium">{form.title}</span>
            </span>
            <span>{form.response_count}</span>
            <span className="text-admin-muted">{timeAgo(form.updated_at)}</span>
            <span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${form.status === "published" ? "bg-[#e4f3ea] text-[#1f6b4d]" : "bg-admin-bg text-admin-muted"}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${form.status === "published" ? "bg-[#1f6b4d]" : "bg-admin-muted"}`} />
                {form.status === "published" ? "Published" : "Draft"}
              </span>
            </span>
            <Menu
              trigger={
                <button type="button" aria-label="More" className="rounded-md p-1.5 text-admin-muted hover:bg-admin-border">
                  <MoreIcon />
                </button>
              }
              items={[
                { label: "Open", onSelect: () => router.push(`/forms/${form.id}/create`), icon: <FormIcon /> },
                { label: "Rename", onSelect: () => setRenaming(form) },
                { label: "Duplicate", onSelect: () => duplicate(form), icon: <CopyIcon /> },
                { label: "Delete", onSelect: () => setDeleting(form), danger: true, icon: <TrashIcon /> },
              ]}
            />
          </li>
        ))}
        {forms.length === 0 && (
          <li className="px-4 py-12 text-center text-sm text-admin-muted">No forms yet. Create your first form to get started.</li>
        )}
      </ul>
      {renaming && <RenameModal key={renaming.id} form={renaming} onClose={() => setRenaming(null)} />}
      <DeleteModal form={deleting} onClose={() => setDeleting(null)} />
    </>
  );
}
