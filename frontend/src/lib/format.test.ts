import { describe, expect, it } from "vitest";
import { pluralize, timeAgo } from "./format";

describe("format helpers", () => {
  it("pluralizes nouns", () => {
    expect(pluralize(1, "response")).toBe("1 response");
    expect(pluralize(3, "response")).toBe("3 responses");
  });

  it("formats relative time", () => {
    const minutes = new Date(Date.now() - 5 * 60_000).toISOString();
    const days = new Date(Date.now() - 2 * 86_400_000).toISOString();
    expect(timeAgo(minutes)).toBe("5 minutes ago");
    expect(timeAgo(days)).toBe("2 days ago");
    expect(timeAgo(new Date().toISOString())).toBe("just now");
  });
});
