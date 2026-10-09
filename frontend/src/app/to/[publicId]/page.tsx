import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { Respondent } from "@/components/respondent/Respondent";

export const dynamic = "force-dynamic";

const loadForm = (publicId: string) =>
  api.getPublicForm(publicId).catch((error: ApiError) => {
    if (error.status === 404) notFound();
    throw error;
  });

export async function generateMetadata({ params }: PageProps<"/to/[publicId]">): Promise<Metadata> {
  const { publicId } = await params;
  const form = await loadForm(publicId);
  return { title: form.title };
}

export default async function RespondPage({ params }: PageProps<"/to/[publicId]">) {
  const { publicId } = await params;
  const form = await loadForm(publicId);
  return <Respondent form={form} />;
}
