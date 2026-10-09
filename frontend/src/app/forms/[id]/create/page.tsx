import { api } from "@/lib/api";
import { Builder } from "@/components/builder/Builder";

export default async function CreatePage({ params }: PageProps<"/forms/[id]/create">) {
  const { id } = await params;
  const form = await api.getForm(Number(id));
  return <Builder key={form.id} form={form} />;
}
