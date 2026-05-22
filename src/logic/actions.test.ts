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

  it("attaches browser recording artifact details to processed nodes", () => {
    const recording = startRecordingCluster(seedState, "Current screen", "Record now");
    const processed = stopRecordingCluster(recording, "Stop and break it down", {
      videoUrl: "blob:local-recording",
      videoSizeBytes: 2048,
      durationMs: 4200,
      keyframes: ["data:image/jpeg;base64,frame1", "data:image/jpeg;base64,frame2"],
      audioStatus: "placeholder",
      transcriptStatus: "placeholder"
    });
    const nodes = processed.nodes.filter((node) => node.clusterId === processed.clusters[0].id);
    expect(nodes.some((node) => node.title === "Local video artifact" && node.content === "blob:local-recording")).toBe(true);
    expect(nodes.find((node) => node.type === "keyframe")?.thumbnail).toBe("data:image/jpeg;base64,frame1");
    expect(nodes.find((node) => node.type === "summary")?.content).toContain("2 keyframes");
  });

  it("uses persistent artifact uri when artifact id is available", () => {
    const recording = startRecordingCluster(seedState, "Current screen", "Record now");
    const processed = stopRecordingCluster(recording, "Stop and break it down", {
      artifactId: "artifact_test",
      videoUrl: "blob:local-recording",
      videoSizeBytes: 2048,
      durationMs: 4200,
      keyframes: ["data:image/jpeg;base64,frame1"],
      audioStatus: "placeholder",
      transcriptStatus: "placeholder"
    });
    const artifactNode = processed.nodes.find((node) => node.title === "Persistent video artifact");
    expect(artifactNode?.content).toBe("artifact://artifact_test");
    expect(artifactNode?.tags).toContain("indexeddb");
  });
});
