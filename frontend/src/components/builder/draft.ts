import { questionMeta } from "@/lib/questions";
import type { Question, QuestionInput, QuestionType } from "@/lib/types";

export interface Draft {
  key: string;
  id?: number;
  type: QuestionType;
  title: string;
  description: string | null;
  required: boolean;
  options: string[];
}

export const ENDING_KEY = "ending";

export const toDraft = (question: Question): Draft => ({
  key: String(question.id),
  id: question.id,
  type: question.type,
  title: question.title,
  description: question.description,
  required: question.required,
  options: question.options.map((option) => option.label),
});

export const toInput = (draft: Draft): QuestionInput => ({
  id: draft.id,
  type: draft.type,
  title: draft.title,
  description: draft.description,
  required: draft.required,
  options: draft.options.filter((label) => label.trim()).map((label) => ({ label: label.trim() })),
});

export const defaultOptions = (type: QuestionType) => (questionMeta(type).hasOptions ? ["Choice 1", "Choice 2"] : []);

export const newDraft = (type: QuestionType): Draft => ({
  key: crypto.randomUUID(),
  type,
  title: "",
  description: null,
  required: false,
  options: defaultOptions(type),
});
