import { api } from "@/lib/api";
import { Results } from "@/components/results/Results";

export default async function ResultsPage({ params }: PageProps<"/forms/[id]/results">) {
  const id = Number((await params).id);
  const [form, stats, responses] = await Promise.all([api.getForm(id), api.getStats(id), api.listResponses(id)]);
  return <Results form={form} stats={stats} responses={responses} />;
}
