import { api } from "@/lib/api";
import { Sidebar } from "@/components/workspace/Sidebar";
import { Workspace } from "@/components/workspace/Workspace";

export const dynamic = "force-dynamic";

export default async function WorkspacePage() {
  const forms = await api.listForms();
  const responses = forms.reduce((total, form) => total + form.response_count, 0);

  return (
    <div className="mx-6 flex flex-1">
      <Sidebar formCount={forms.length} responseCount={responses} />
      <Workspace forms={forms} />
    </div>
  );
}
