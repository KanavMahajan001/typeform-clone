export type QuestionType =
  | "short_text"
  | "long_text"
  | "multiple_choice"
  | "dropdown"
  | "email"
  | "number"
  | "yes_no"
  | "rating";

export type FormStatus = "draft" | "published";

export interface Option {
  id: number;
  label: string;
}

export interface Question {
  id: number;
  type: QuestionType;
  title: string;
  description: string | null;
  required: boolean;
  position: number;
  options: Option[];
}

export interface FormSummary {
  id: number;
  public_id: string;
  title: string;
  status: FormStatus;
  response_count: number;
  created_at: string;
  updated_at: string;
}

export interface FormDetail extends FormSummary {
  questions: Question[];
}

export interface PublicQuestion extends Omit<Question, "position"> {}

export interface PublicForm {
  public_id: string;
  title: string;
  questions: PublicQuestion[];
}

export interface QuestionInput {
  id?: number;
  type: QuestionType;
  title: string;
  description: string | null;
  required: boolean;
  options: { label: string }[];
}

export type AnswerValue = string | number | boolean | null;

export interface AnswerInput {
  question_id: number;
  value: AnswerValue;
}

export interface Answer {
  question_id: number;
  value: string;
}

export interface FormResponse {
  id: number;
  submitted_at: string;
  answers: Answer[];
}

export interface ValidationIssue {
  question_id: number;
  message: string;
}

export interface QuestionStats {
  question_id: number;
  type: QuestionType;
  title: string;
  answered: number;
  counts: Record<string, number> | null;
  average: number | null;
  samples: string[] | null;
}

export interface FormStats {
  responses: number;
  questions: QuestionStats[];
}
