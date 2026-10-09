import type {
  AnswerInput,
  FormDetail,
  FormResponse,
  FormStats,
  FormStatus,
  FormSummary,
  PublicForm,
  Question,
  QuestionInput,
  ValidationIssue,
} from "./types";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  constructor(
    public status: number,
    public detail: unknown,
  ) {
    super(typeof detail === "string" ? detail : "Request failed");
  }

  get issues(): ValidationIssue[] {
    return Array.isArray(this.detail) ? (this.detail as ValidationIssue[]) : [];
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init.headers },
    cache: "no-store",
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({ detail: response.statusText }));
    throw new ApiError(response.status, body.detail);
  }
  return response.status === 204 ? (undefined as T) : response.json();
}

const json = (method: string, body?: unknown): RequestInit => ({
  method,
  body: body === undefined ? undefined : JSON.stringify(body),
});

export const api = {
  listForms: () => request<FormSummary[]>("/api/forms"),
  createForm: (title: string) => request<FormDetail>("/api/forms", json("POST", { title })),
  getForm: (id: number) => request<FormDetail>(`/api/forms/${id}`),
  updateForm: (id: number, data: { title?: string; status?: FormStatus }) =>
    request<FormSummary>(`/api/forms/${id}`, json("PATCH", data)),
  deleteForm: (id: number) => request<void>(`/api/forms/${id}`, json("DELETE")),
  duplicateForm: (id: number) => request<FormSummary>(`/api/forms/${id}/duplicate`, json("POST")),
  saveQuestions: (id: number, questions: QuestionInput[]) =>
    request<Question[]>(`/api/forms/${id}/questions`, json("PUT", questions)),
  listResponses: (id: number) => request<FormResponse[]>(`/api/forms/${id}/responses`),
  getStats: (id: number) => request<FormStats>(`/api/forms/${id}/stats`),
  getPublicForm: (publicId: string) => request<PublicForm>(`/api/public/forms/${publicId}`),
  submitResponse: (publicId: string, answers: AnswerInput[]) =>
    request<FormResponse>(`/api/public/forms/${publicId}/responses`, json("POST", { answers })),
};
