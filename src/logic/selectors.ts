import type { AppState, Capture, Mode } from "../types";

export const modeMeta: Record<Mode, { label: string; verb: string; accent: string }> = {
  project: { label: "Build", verb: "Ship projects faster", accent: "blue" },
  growth: { label: "Improve", verb: "Act on saved growth ideas", accent: "green" },
  research: { label: "Understand", verb: "Review learning trails", accent: "violet" },
  inspiration: { label: "Create", verb: "Rediscover visual sparks", accent: "magenta" },
  archive: { label: "Keep", verb: "Store without clutter", accent: "slate" }
};

export function activeProject(state: AppState) {
  return state.projects.find((project) => project.id === state.activeProjectId) ?? state.projects[0];
}

export function projectCaptures(state: AppState, projectId = state.activeProjectId) {
  return state.captures.filter((capture) => capture.projectId === projectId && !capture.archived);
}

export function projectSessions(state: AppState, projectId = state.activeProjectId) {
  return state.sessions.filter((session) => session.projectId === projectId);
}

export function capturesByType(captures: Capture[]) {
  return {
    highlights: captures.filter((capture) => capture.pinned),
    visuals: captures.filter((capture) => capture.type === "screenshot" || capture.modeHints.includes("inspiration")),
    documents: captures.filter((capture) => capture.type !== "screenshot" && !capture.modeHints.includes("inspiration"))
  };
}

export function digestItems(captures: Capture[]) {
  return [...captures]
    .sort((a, b) => {
      const pinScore = Number(b.pinned) - Number(a.pinned);
      if (pinScore !== 0) return pinScore;
      const revisitScore = b.revisitCount - a.revisitCount;
      if (revisitScore !== 0) return revisitScore;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, 3);
}

export function randomProjectMemory(state: AppState) {
  const candidates = projectCaptures(state).filter((capture) => capture.revisitCount <= 1);
  return candidates[0] ?? projectCaptures(state)[0];
}

export function growthCaptures(state: AppState) {
  return state.captures.filter(
    (capture) =>
      !capture.archived &&
      (capture.modeHints.includes("growth") ||
        capture.tags.some((tag) => ["fitness", "routine", "health", "money", "focus", "journal"].includes(tag)))
  );
}

export function growthFocus(state: AppState) {
  return [...growthCaptures(state)]
    .filter((capture) => capture.growthStatus !== "not_relevant" && capture.growthStatus !== "tried")
    .sort((a, b) => {
      const statusScore = Number(a.growthStatus === "untried") - Number(b.growthStatus === "untried");
      if (statusScore !== 0) return statusScore;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    })[0];
}

export function neverTriedGrowth(state: AppState) {
  return growthCaptures(state).filter((capture) => !capture.growthStatus || capture.growthStatus === "untried");
}

export function inspirationCaptures(state: AppState, filter = "all") {
  return state.captures.filter((capture) => {
    if (capture.archived) return false;
    const isVisual = capture.type === "screenshot" || capture.modeHints.includes("inspiration");
    if (!isVisual) return false;
    if (filter === "all") return true;
    if (filter === "project") return capture.projectId === state.activeProjectId;
    return capture.tags.includes(filter);
  });
}

export function randomInspiration(state: AppState) {
  return [...inspirationCaptures(state)]
    .sort((a, b) => {
      const revisitScore = a.revisitCount - b.revisitCount;
      if (revisitScore !== 0) return revisitScore;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    })[0];
}

export function researchSessions(state: AppState) {
  return [...state.sessions].sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
}

export function archivedCaptures(state: AppState) {
  return state.captures.filter((capture) => capture.archived);
}

export function archiveCleanupCandidates(state: AppState) {
  return archivedCaptures(state).filter((capture) => capture.revisitCount === 0);
}

export function activeCluster(state: AppState) {
  return state.clusters.find((cluster) => cluster.id === state.activeClusterId);
}

export function clusterNodes(state: AppState, clusterId: string) {
  return state.nodes.filter((node) => node.clusterId === clusterId);
}

export function latestCluster(state: AppState) {
  return state.clusters[0];
}
