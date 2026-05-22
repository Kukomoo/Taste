import type { AppState, Capture, GrowthStatus, MemoryCluster, MemoryNode, Mode, Project, RecordingArtifact, Session } from "../types";

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

export function createMoodboard(state: AppState, captureIds: string[], name = "New moodboard"): AppState {
  if (captureIds.length === 0) return state;
  return {
    ...state,
    moodboards: [
      {
        id: makeId("m"),
        name,
        projectId: state.activeProjectId,
        captureIds,
        createdAt: now()
      },
      ...state.moodboards
    ]
  };
}

export function startRecordingCluster(state: AppState, source = "Current tab", command = "Hey Kukomo, record now"): AppState {
  if (state.activeClusterId) return state;
  const cluster: MemoryCluster = {
    id: makeId("cluster"),
    title: source.toLowerCase().includes("youtube") ? "YouTube recording in progress" : "Live recording in progress",
    source,
    projectId: state.activeProjectId,
    status: "recording",
    startedAt: now(),
    nodeIds: [],
    commandTrail: [command]
  };
  return {
    ...state,
    activeClusterId: cluster.id,
    clusters: [cluster, ...state.clusters]
  };
}

export function stopRecordingCluster(state: AppState, command = "Kukomo, stop recording", artifact?: RecordingArtifact): AppState {
  if (!state.activeClusterId) return state;
  const cluster = state.clusters.find((item) => item.id === state.activeClusterId);
  if (!cluster) return { ...state, activeClusterId: undefined };
  const createdAt = now();
  const nodes = buildRecordingNodes(cluster, createdAt, artifact);
  return {
    ...state,
    activeClusterId: undefined,
    nodes: [...nodes, ...state.nodes],
    clusters: state.clusters.map((item) =>
      item.id === cluster.id
        ? {
            ...item,
            title: cluster.source.toLowerCase().includes("youtube") ? "YouTube video breakdown" : "Recording breakdown",
            status: "ready",
            endedAt: createdAt,
            nodeIds: nodes.map((node) => node.id),
            commandTrail: [...item.commandTrail, command]
          }
        : item
    )
  };
}

export function buildRecordingNodes(cluster: MemoryCluster, createdAt: string, artifact?: RecordingArtifact): MemoryNode[] {
  const keyframeCount = artifact?.keyframes.length ?? 0;
  return [
    {
      id: makeId("node"),
      clusterId: cluster.id,
      type: "source",
      title: "Source context",
      content: artifact?.videoUrl
        ? `Recorded ${cluster.source} as a local WebM artifact (${formatBytes(artifact.videoSizeBytes ?? 0)}, ${formatDuration(artifact.durationMs ?? 0)}).`
        : `Recorded ${cluster.source} and attached it to the active project.`,
      tags: ["source"],
      createdAt
    },
    ...(artifact?.videoUrl
      ? [
          {
            id: makeId("node"),
            clusterId: cluster.id,
            type: "source" as const,
            title: artifact.artifactId ? "Persistent video artifact" : "Local video artifact",
            content: artifact.artifactId ? `artifact://${artifact.artifactId}` : artifact.videoUrl,
            tags: artifact.artifactId ? ["video", "webm", "indexeddb"] : ["video", "webm"],
            createdAt
          }
        ]
      : []),
    {
      id: makeId("node"),
      clusterId: cluster.id,
      type: "keyframe",
      title: artifact?.keyframes.length ? `${keyframeCount} sampled keyframes` : "Keyframe set",
      content: artifact?.keyframes.length
        ? "Sampled frames from the recorded video for visual reverse engineering."
        : "Extracted visual beats for layout, typography, motion, color, and composition.",
      timestampLabel: "00:05, 00:17, 00:31",
      thumbnail: artifact?.keyframes[0] ?? "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
      tags: ["keyframe", "visual-scan"],
      createdAt
    },
    {
      id: makeId("node"),
      clusterId: cluster.id,
      type: "audio",
      title: "Audio layer",
      content:
        artifact?.audioStatus === "placeholder"
          ? "Audio track captured inside the WebM artifact. Transcription service hookup is next."
          : "Extracted audio track and detected speaker cadence, pacing, emphasis, and background sound bed.",
      tags: ["audio", "cadence"],
      createdAt
    },
    {
      id: makeId("node"),
      clusterId: cluster.id,
      type: "transcript",
      title: "Transcript",
      content:
        artifact?.transcriptStatus === "placeholder"
          ? "Transcript placeholder created. The recorded audio is ready for a speech-to-text pipeline."
          : "Generated a searchable transcript with timestamped concepts and quotable explanation moments.",
      timestampLabel: "full track",
      tags: ["transcript"],
      createdAt
    },
    {
      id: makeId("node"),
      clusterId: cluster.id,
      type: "prompt",
      title: "Reverse-engineered style prompt",
      content: artifact?.keyframes.length
        ? "Use the sampled keyframes to reverse engineer visual style: composition, spacing, typography, color accents, motion rhythm, interaction tone, and reusable component rules."
        : "Create a high-fidelity interface in the captured style: identify composition, spacing, typography, interaction tone, color accents, media rhythm, and reusable component rules before generating.",
      tags: ["prompt", "reverse-engineer"],
      createdAt
    },
    {
      id: makeId("node"),
      clusterId: cluster.id,
      type: "summary",
      title: "Cluster summary",
      content: artifact?.videoUrl
        ? `One browser recording became a reusable cluster with video, ${keyframeCount} keyframe${keyframeCount === 1 ? "" : "s"}, audio placeholder, transcript placeholder, and generation prompt.`
        : "One recording became a reusable memory cluster with source, frames, audio, transcript, and generation prompts.",
      tags: ["summary"],
      createdAt
    }
  ];
}

function formatBytes(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDuration(durationMs: number) {
  const seconds = Math.max(0, Math.round(durationMs / 1000));
  return `${seconds}s`;
}
