import { RATING_MAX } from "./questions";
import type { AnswerValue, PublicQuestion } from "./types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateAnswer(question: PublicQuestion, value: AnswerValue): string | null {
  const empty = value === null || value === "" || (typeof value === "string" && !value.trim());
  if (empty) return question.required ? "Please fill this in" : null;
  switch (question.type) {
    case "email":
      return EMAIL_RE.test(String(value).trim()) ? null : "Hmm... that email doesn't look right";
    case "number":
      return Number.isFinite(Number(value)) ? null : "Please enter a valid number";
    case "rating": {
      const rating = Number(value);
      return Number.isInteger(rating) && rating >= 1 && rating <= RATING_MAX ? null : "Please pick a rating";
    }
    case "multiple_choice":
    case "dropdown":
      return question.options.some((option) => option.label === value) ? null : "Please select one of the options";
    default:
      return null;
  }
}
