export type Mode = "project" | "growth" | "research" | "inspiration" | "archive";

export type CaptureType = "link" | "screenshot" | "clip" | "note" | "voice" | "file";

export type ProjectStatus = "active" | "paused" | "archived";

export type GrowthStatus = "untried" | "tried" | "skipped" | "not_relevant";

export interface Project {
  id: string;
  name: string;
  emoji: string;
  goal: string;
  status: ProjectStatus;
  createdAt: string;
  lastActiveAt: string;
}

export interface Capture {
  id: string;
  title: string;
  type: CaptureType;
  sourceUrl?: string;
  thumbnail?: string;
  projectId?: string;
  modeHints: Mode[];
  tags: string[];
  note?: string;
  createdAt: string;
  lastOpenedAt?: string;
  revisitCount: number;
  pinned: boolean;
  archived: boolean;
  growthStatus?: GrowthStatus;
}

export interface Session {
  id: string;
  projectId?: string;
  mode: "project" | "research";
  title: string;
  startedAt: string;
  endedAt?: string;
  captureIds: string[];
  summary: string;
  keyPages: string[];
}

export interface Moodboard {
  id: string;
  name: string;
  projectId?: string;
  captureIds: string[];
  createdAt: string;
}

export interface VoiceCommands {
  wakePhrase: string;
  saveThis: string;
  startSession: string;
  endSession: string;
  randomMemory: string;
}

export interface AppState {
  activeMode: Mode;
  activeProjectId: string;
  projects: Project[];
  captures: Capture[];
  sessions: Session[];
  moodboards: Moodboard[];
  currentSessionId?: string;
  voiceCommands: VoiceCommands;
}
