import { api } from "@/lib/api";
import { SharePanel } from "@/components/builder/SharePanel";

export default async function SharePage({ params }: PageProps<"/forms/[id]/share">) {
  const { id } = await params;
  const form = await api.getForm(Number(id));
  return <SharePanel form={form} />;
}
