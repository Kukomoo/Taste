import { describe, expect, it } from "vitest";
import { seedState } from "../data/seed";
import { createMoodboard } from "./actions";
import { inspirationCaptures, randomInspiration } from "./selectors";

describe("inspiration mode", () => {
  it("returns visual inspiration captures", () => {
    const captures = inspirationCaptures(seedState);
    expect(captures.every((capture) => capture.type === "screenshot" || capture.modeHints.includes("inspiration"))).toBe(true);
  });

  it("filters by tag", () => {
    const captures = inspirationCaptures(seedState, "branding");
    expect(captures.every((capture) => capture.tags.includes("branding"))).toBe(true);
  });

  it("creates moodboard from selected captures", () => {
    const next = createMoodboard(seedState, ["c1", "c3"], "UI board");
    expect(next.moodboards[0].captureIds).toEqual(["c1", "c3"]);
  });

  it("selects a random inspiration candidate", () => {
    expect(randomInspiration(seedState)?.modeHints).toContain("inspiration");
  });
});
