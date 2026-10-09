"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CloseIcon, GemIcon } from "@/components/ui/Icons";

export function PlanBanner() {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  return (
    <div className="relative mx-4 flex min-h-16 flex-wrap items-center justify-center gap-4 rounded-lg border border-[#c9dfd4] bg-[#f4faf7] px-12 py-3 text-sm lg:mx-6 lg:text-base">
      <GemIcon width={22} height={22} className="text-admin-muted" />
      <p>
        You can collect <strong className="font-medium">10 form responses</strong> this month for free.
      </p>
      <button
        type="button"
        onClick={() => toast("Plans and billing are coming soon")}
        className="h-9 rounded-md bg-[#1f7a5a] px-4 text-sm font-medium text-white hover:bg-[#166548]"
      >
        Get more responses
      </button>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => setOpen(false)}
        className="absolute top-1/2 right-4 -translate-y-1/2 rounded-md p-1 text-admin-muted hover:bg-admin-hover"
      >
        <CloseIcon width={18} height={18} />
      </button>
    </div>
  );
}
