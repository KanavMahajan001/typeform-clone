import { describe, expect, it } from "vitest";
import type { PublicQuestion } from "./types";
import { validateAnswer } from "./validate";

const question = (overrides: Partial<PublicQuestion>): PublicQuestion => ({
  id: 1,
  type: "short_text",
  title: "Q",
  description: null,
  required: true,
  options: [],
  ...overrides,
});

describe("validateAnswer", () => {
  it("requires a value only when the question is required", () => {
    expect(validateAnswer(question({ required: true }), "")).toBe("Please fill this in");
    expect(validateAnswer(question({ required: true }), "   ")).toBe("Please fill this in");
    expect(validateAnswer(question({ required: false }), null)).toBeNull();
  });

  it("checks email format", () => {
    expect(validateAnswer(question({ type: "email" }), "nope")).toBe("Hmm... that email doesn't look right");
    expect(validateAnswer(question({ type: "email" }), "a@b.co")).toBeNull();
  });

  it("checks numbers and ratings", () => {
    expect(validateAnswer(question({ type: "number" }), "abc")).toBe("Please enter a valid number");
    expect(validateAnswer(question({ type: "number" }), "12.5")).toBeNull();
    expect(validateAnswer(question({ type: "rating" }), 6)).toBe("Please pick a rating");
    expect(validateAnswer(question({ type: "rating" }), 3)).toBeNull();
  });

  it("only accepts configured choices", () => {
    const options = [{ id: 1, label: "A" }, { id: 2, label: "B" }];
    expect(validateAnswer(question({ type: "multiple_choice", options }), "C")).toBe("Please select one of the options");
    expect(validateAnswer(question({ type: "dropdown", options }), "B")).toBeNull();
  });
});
