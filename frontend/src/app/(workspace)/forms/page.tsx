import { api } from "@/lib/api";
import { FormList } from "@/components/workspace/FormList";
import { WorkspaceHeader } from "@/components/workspace/WorkspaceHeader";

export const dynamic = "force-dynamic";

export default async function WorkspacePage() {
  const forms = await api.listForms();

  return (
    <div className="mx-auto max-w-5xl px-10 py-10">
      <WorkspaceHeader count={forms.length} />
      <FormList forms={forms} />
    </div>
  );
}
