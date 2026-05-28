import type { AppState, Capture, Mode, RecallResult } from "../types";

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

export function recallMemory(state: AppState, query: string): RecallResult[] {
  const terms = normalizeTerms(query);
  if (terms.length === 0) return [];

  const clusterResults = state.clusters.map((cluster) => {
    const nodes = clusterNodes(state, cluster.id);
    const haystack = [
      cluster.title,
      cluster.source,
      cluster.commandTrail.join(" "),
      ...nodes.flatMap((node) => [node.title, node.content, node.tags.join(" ")])
    ].join(" ");
    const score = scoreText(haystack, terms) + recencyBoost(cluster.startedAt);
    return {
      id: cluster.id,
      kind: "cluster" as const,
      title: cluster.title,
      reason: `Matched cluster from ${friendlyDate(cluster.startedAt)} with ${nodes.length} extracted nodes.`,
      score,
      highlights: nodes.slice(0, 3).map((node) => `${node.type}: ${node.title}`)
    };
  });

  const captureResults = state.captures.map((capture) => {
    const haystack = [capture.title, capture.note, capture.sourceUrl, capture.tags.join(" ")].join(" ");
    const score = scoreText(haystack, terms) + recencyBoost(capture.createdAt);
    return {
      id: capture.id,
      kind: "capture" as const,
      title: capture.title,
      reason: `Matched saved ${capture.type} from ${friendlyDate(capture.createdAt)}.`,
      score,
      highlights: [capture.note ?? capture.tags.join(", ")].filter(Boolean)
    };
  });

  const sessionResults = state.sessions.map((session) => {
    const haystack = [session.title, session.summary, session.keyPages.join(" ")].join(" ");
    const score = scoreText(haystack, terms) + recencyBoost(session.startedAt);
    return {
      id: session.id,
      kind: "session" as const,
      title: session.title,
      reason: `Matched research session from ${friendlyDate(session.startedAt)}.`,
      score,
      highlights: [session.summary, ...session.keyPages].filter(Boolean).slice(0, 3)
    };
  });

  return [...clusterResults, ...captureResults, ...sessionResults]
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

export function userUnderstandingProfile(state: AppState) {
  const tagCounts = new Map<string, number>();
  for (const capture of state.captures) {
    for (const tag of capture.tags) tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
  }
  for (const node of state.nodes) {
    for (const tag of node.tags) tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
  }
  const topInterests = [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([tag]) => tag);

  return {
    topInterests,
    clusterCount: state.clusters.length,
    captureCount: state.captures.length,
    promptCount: state.nodes.filter((node) => node.type === "prompt").length
  };
}

function normalizeTerms(query: string) {
  const stop = new Set(["the", "that", "this", "about", "what", "did", "how", "to", "a", "an", "i", "watched", "remember"]);
  return query
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((term) => term.length > 1 && !stop.has(term));
}

function scoreText(text: string, terms: string[]) {
  const haystack = text.toLowerCase();
  return terms.reduce((score, term) => score + (haystack.includes(term) ? 3 : 0), 0);
}

function recencyBoost(isoDate: string) {
  const ageMs = Date.now() - new Date(isoDate).getTime();
  const ageDays = ageMs / (1000 * 60 * 60 * 24);
  if (ageDays < 7) return 2;
  if (ageDays < 30) return 1;
  return 0;
}

function friendlyDate(isoDate: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(isoDate));
}
