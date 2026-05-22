import { describe, expect, it } from "vitest";
import { seedState } from "../data/seed";
import { addCapture, createProject, startRecordingCluster, stopRecordingCluster } from "./actions";

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

  it("turns a recording into one cluster with individual extracted nodes", () => {
    const recording = startRecordingCluster(seedState, "YouTube video", "Hey Kukomo, start recording this YouTube video now");
    const processed = stopRecordingCluster(recording, "Stop and break it down");
    expect(processed.clusters[0].status).toBe("ready");
    expect(processed.clusters[0].nodeIds).toHaveLength(6);
    expect(new Set(processed.nodes.slice(0, 6).map((node) => node.clusterId))).toEqual(new Set([processed.clusters[0].id]));
  });
});
