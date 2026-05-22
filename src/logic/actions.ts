import type { AppState, Capture, GrowthStatus, Mode, Project, Session } from "../types";

const makeId = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
const now = () => new Date().toISOString();

export function setMode(state: AppState, mode: Mode): AppState {
  return { ...state, activeMode: mode };
}

export function setActiveProject(state: AppState, projectId: string): AppState {
  return { ...state, activeProjectId: projectId };
}

export function createProject(state: AppState, name: string, goal: string): AppState {
  const project: Project = {
    id: makeId("p"),
    name: name.trim() || "Untitled Project",
    emoji: "▣",
    goal: goal.trim() || "Collect references and turn them into progress.",
    status: "active",
    createdAt: now(),
    lastActiveAt: now()
  };
  return { ...state, projects: [project, ...state.projects], activeProjectId: project.id };
}

export function addCapture(
  state: AppState,
  input: Pick<Capture, "title" | "type"> & Partial<Capture>
): AppState {
  const capture: Capture = {
    id: makeId("c"),
    title: input.title.trim() || "Untitled save",
    type: input.type,
    sourceUrl: input.sourceUrl,
    thumbnail: input.thumbnail,
    projectId: input.projectId ?? (state.activeMode === "project" ? state.activeProjectId : undefined),
    modeHints: input.modeHints ?? [state.activeMode],
    tags: input.tags ?? [],
    note: input.note,
    createdAt: now(),
    revisitCount: 0,
    pinned: Boolean(input.pinned),
    archived: Boolean(input.archived),
    growthStatus: input.growthStatus
  };
  const sessions = state.currentSessionId
    ? state.sessions.map((session) =>
        session.id === state.currentSessionId ? { ...session, captureIds: [...session.captureIds, capture.id] } : session
      )
    : state.sessions;
  return { ...state, captures: [capture, ...state.captures], sessions };
}

export function togglePin(state: AppState, captureId: string): AppState {
  return {
    ...state,
    captures: state.captures.map((capture) =>
      capture.id === captureId ? { ...capture, pinned: !capture.pinned } : capture
    )
  };
}

export function markGrowthStatus(state: AppState, captureId: string, growthStatus: GrowthStatus): AppState {
  return {
    ...state,
    captures: state.captures.map((capture) =>
      capture.id === captureId ? { ...capture, growthStatus, modeHints: [...new Set([...capture.modeHints, "growth" as const])] } : capture
    )
  };
}

export function toggleArchive(state: AppState, captureId: string): AppState {
  return {
    ...state,
    captures: state.captures.map((capture) =>
      capture.id === captureId ? { ...capture, archived: !capture.archived } : capture
    )
  };
}

export function startSession(state: AppState, mode: "project" | "research" = "research"): AppState {
  if (state.currentSessionId) return state;
  const session: Session = {
    id: makeId("s"),
    projectId: state.activeProjectId,
    mode,
    title: mode === "project" ? "Project build session" : "Research session",
    startedAt: now(),
    captureIds: [],
    summary: "Session in progress.",
    keyPages: []
  };
  return { ...state, currentSessionId: session.id, sessions: [session, ...state.sessions] };
}

export function endSession(state: AppState): AppState {
  if (!state.currentSessionId) return state;
  const session = state.sessions.find((item) => item.id === state.currentSessionId);
  const captureTitles = state.captures
    .filter((capture) => session?.captureIds.includes(capture.id))
    .map((capture) => capture.title);
  return {
    ...state,
    currentSessionId: undefined,
    sessions: state.sessions.map((item) =>
      item.id === state.currentSessionId
        ? {
            ...item,
            endedAt: now(),
            summary:
              captureTitles.length > 0
                ? `Captured ${captureTitles.length} useful reference${captureTitles.length > 1 ? "s" : ""}: ${captureTitles.join(", ")}.`
                : "Session ended with no manual captures yet.",
            keyPages: captureTitles
          }
        : item
    )
  };
}
