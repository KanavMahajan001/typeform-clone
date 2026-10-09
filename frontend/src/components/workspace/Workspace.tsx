"use client";

import { useState } from "react";
import type { FormSummary } from "@/lib/types";
import { FormList } from "./FormList";
import { WorkspaceHeader, type SortKey, type View } from "./WorkspaceHeader";

const compare = (sort: SortKey) => (a: FormSummary, b: FormSummary) =>
  sort === "title" ? a.title.localeCompare(b.title) : b[sort].localeCompare(a[sort]);

export function Workspace({ forms }: { forms: FormSummary[] }) {
  const [sort, setSort] = useState<SortKey>("created_at");
  const [view, setView] = useState<View>("list");

  return (
    <section className="flex-1 px-12 py-10">
      <WorkspaceHeader sort={sort} view={view} onSort={setSort} onView={setView} />
      <FormList forms={[...forms].sort(compare(sort))} view={view} />
    </section>
  );
}
