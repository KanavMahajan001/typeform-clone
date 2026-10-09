import { describe, expect, it } from "vitest";
import { newDraft, toDraft, toInput } from "./draft";

describe("builder drafts", () => {
  it("round-trips a question through draft and input", () => {
    const draft = toDraft({
      id: 7,
      type: "dropdown",
      title: "Size",
      description: null,
      required: true,
      position: 2,
      options: [
        { id: 1, label: "S" },
        { id: 2, label: "M" },
      ],
    });
    expect(draft.key).toBe("7");
    expect(toInput(draft)).toEqual({
      id: 7,
      type: "dropdown",
      title: "Size",
      description: null,
      required: true,
      options: [{ label: "S" }, { label: "M" }],
    });
  });

  it("drops blank options and trims labels when saving", () => {
    const draft = { ...newDraft("multiple_choice"), options: ["  Yes ", "", "   "] };
    expect(toInput(draft).options).toEqual([{ label: "Yes" }]);
  });

  it("gives choice questions default options and others none", () => {
    expect(newDraft("multiple_choice").options).toEqual(["Choice 1", "Choice 2"]);
    expect(newDraft("short_text").options).toEqual([]);
    expect(newDraft("rating").id).toBeUndefined();
  });
});
