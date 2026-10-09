"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/Button";

export function WorkspaceHeader({ count }: { count: number }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-medium">My workspace</h1>
        <p className="mt-1 text-sm text-admin-muted">
          {count} {count === 1 ? "form" : "forms"}
        </p>
      </div>
      <Button variant="secondary" onClick={() => toast("Team collaboration is coming soon")}>
        Invite
      </Button>
    </div>
  );
}
