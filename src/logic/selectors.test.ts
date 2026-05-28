import { describe, expect, it } from "vitest";
import { seedState } from "../data/seed";
import { addCapture } from "./actions";
import { digestItems, projectCaptures, recallMemory, userUnderstandingProfile } from "./selectors";

describe("project selectors", () => {
  it("returns active project captures only", () => {
    const captures = projectCaptures(seedState, "p1");
    expect(captures.every((capture) => capture.projectId === "p1")).toBe(true);
    expect(captures.every((capture) => !capture.archived)).toBe(true);
  });

  it("attaches saved capture to active project", () => {
    const next = addCapture(seedState, { title: "Test save", type: "link", modeHints: ["project"] });
    expect(next.captures[0].projectId).toBe(seedState.activeProjectId);
  });

  it("ranks digest items by pinned and revisit count", () => {
    const digest = digestItems(projectCaptures(seedState, "p1"));
    expect(digest[0].pinned).toBe(true);
    expect(digest).toHaveLength(3);
  });

  it("recalls backend clusters from natural language", () => {
    const results = recallMemory(seedState, "remember that backend video about auth middleware and storage");
    expect(results[0].title).toContain("Backend build video");
  });

  it("summarizes what Kukomo has learned about the user", () => {
    const profile = userUnderstandingProfile(seedState);
    expect(profile.clusterCount).toBeGreaterThan(0);
    expect(profile.topInterests).toContain("backend");
  });
});
