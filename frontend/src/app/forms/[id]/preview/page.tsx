import { api } from "@/lib/api";
import { Respondent } from "@/components/respondent/Respondent";

export default async function PreviewPage({ params }: PageProps<"/forms/[id]/preview">) {
  const { id } = await params;
  const form = await api.getForm(Number(id));
  return <Respondent preview form={{ public_id: form.public_id, title: form.title, questions: form.questions }} />;
}
