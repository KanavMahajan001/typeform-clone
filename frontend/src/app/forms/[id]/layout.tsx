import { notFound } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { FormShell } from "@/components/builder/FormShell";

export const dynamic = "force-dynamic";

export default async function FormLayout({ children, params }: LayoutProps<"/forms/[id]">) {
  const { id } = await params;
  const form = await api.getForm(Number(id)).catch((error: ApiError) => {
    if (error.status === 404) notFound();
    throw error;
  });

  return <FormShell form={form}>{children}</FormShell>;
}
