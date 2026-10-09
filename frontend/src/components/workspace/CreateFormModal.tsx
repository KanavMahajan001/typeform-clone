"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

interface Props {
  open: boolean;
  initialTitle?: string;
  onClose: () => void;
}

export function CreateFormModal({ open, initialTitle = "", onClose }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    setBusy(true);
    try {
      const form = await api.createForm(title.trim());
      router.push(`/forms/${form.id}/create`);
    } catch {
      toast.error("Couldn't create the form");
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Create a new form">
      <form onSubmit={submit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-2 text-sm">
          Give your form a name
          <input
            autoFocus
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Untitled form"
            className="form-input"
          />
        </label>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={busy || !title.trim()}>
            Continue
          </Button>
        </div>
      </form>
    </Modal>
  );
}
