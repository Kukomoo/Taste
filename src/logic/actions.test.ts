import { describe, expect, it } from "vitest";
import { seedState } from "../data/seed";
import { addCapture, createProject } from "./actions";

describe("state actions", () => {
  it("creates a user-named project and makes it active", () => {
    const next = createProject(seedState, "Portfolio Refresh", "Collect visual references for the launch.");
    expect(next.projects[0].name).toBe("Portfolio Refresh");
    expect(next.projects[0].goal).toBe("Collect visual references for the launch.");
    expect(next.activeProjectId).toBe(next.projects[0].id);
  });

  it("uses conservative fallbacks for empty project fields", () => {
    const next = createProject(seedState, " ", " ");
    expect(next.projects[0].name).toBe("Untitled Project");
    expect(next.projects[0].goal).toContain("Collect references");
  });

  it("stores user capture metadata", () => {
    const next = addCapture(seedState, {
      title: "Competitor dashboard",
      type: "link",
      sourceUrl: "https://example.com/dashboard",
      tags: ["competitor", "dashboard"],
      note: "Useful density model.",
      modeHints: ["project"]
    });
    expect(next.captures[0]).toMatchObject({
      title: "Competitor dashboard",
      sourceUrl: "https://example.com/dashboard",
      tags: ["competitor", "dashboard"],
      note: "Useful density model.",
      projectId: seedState.activeProjectId
    });
  });

  it("uses fallback capture title when user input is empty", () => {
    const next = addCapture(seedState, { title: " ", type: "link", modeHints: ["project"] });
    expect(next.captures[0].title).toBe("Untitled save");
  });
});
