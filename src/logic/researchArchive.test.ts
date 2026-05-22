import { describe, expect, it } from "vitest";
import { seedState } from "../data/seed";
import { addCapture, endSession, startSession } from "./actions";
import { exportArchive } from "./export";
import { archiveCleanupCandidates, archivedCaptures, researchSessions } from "./selectors";

describe("research and archive", () => {
  it("starts and ends a research session", () => {
    const started = startSession(seedState, "research");
    const withCapture = addCapture(started, { title: "Session page", type: "link", modeHints: ["research"] });
    const ended = endSession(withCapture);
    expect(ended.currentSessionId).toBeUndefined();
    expect(ended.sessions[0].endedAt).toBeTruthy();
    expect(ended.sessions[0].summary).toContain("Captured 1 useful reference");
  });

  it("lists research sessions newest first", () => {
    expect(researchSessions(seedState)[0].id).toBe("s1");
  });

  it("finds archived cleanup candidates", () => {
    expect(archiveCleanupCandidates(seedState).map((capture) => capture.id)).toContain("c6");
  });

  it("exports only archived captures", () => {
    const exported = JSON.parse(exportArchive(seedState));
    expect(exported.captures).toHaveLength(archivedCaptures(seedState).length);
    expect(exported.captures.every((capture: { archived: boolean }) => capture.archived)).toBe(true);
  });
});
