import { addCapture, endSession, setMode, startSession } from "./actions";
import { exportAllData } from "./export";
import { randomInspiration, randomProjectMemory } from "./selectors";
import type { AppState, Mode } from "../types";

export type CommandIntent =
  | "save"
  | "start_session"
  | "end_session"
  | "random_memory"
  | "switch_mode"
  | "export_all"
  | "unknown";

export interface ParsedCommand {
  intent: CommandIntent;
  mode?: Mode;
}

const modeWords: Record<string, Mode> = {
  build: "project",
  project: "project",
  improve: "growth",
  growth: "growth",
  understand: "research",
  research: "research",
  create: "inspiration",
  inspiration: "inspiration",
  keep: "archive",
  archive: "archive"
};

export function parseCommand(input: string): ParsedCommand {
  const normalized = input.toLowerCase().replace(/[^\w\s]/g, "").trim();
  if (normalized.includes("save this")) return { intent: "save" };
  if (normalized.includes("start session")) return { intent: "start_session" };
  if (normalized.includes("end session")) return { intent: "end_session" };
  if (normalized.includes("random memory") || normalized.includes("random inspiration")) return { intent: "random_memory" };
  if (normalized.includes("export")) return { intent: "export_all" };
  if (normalized.includes("switch")) {
    const mode = Object.entries(modeWords).find(([word]) => normalized.includes(word))?.[1];
    return mode ? { intent: "switch_mode", mode } : { intent: "unknown" };
  }
  return { intent: "unknown" };
}

export function runCommand(state: AppState, input: string): { state: AppState; message: string; exportText?: string } {
  const parsed = parseCommand(input);
  switch (parsed.intent) {
    case "save":
      return {
        state: addCapture(state, {
          title: state.activeMode === "inspiration" ? "Voice-saved visual inspiration" : "Voice-saved reference",
          type: state.activeMode === "inspiration" ? "screenshot" : "link",
          thumbnail:
            state.activeMode === "inspiration"
              ? "https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&w=900&q=80"
              : undefined,
          tags: [state.activeMode],
          modeHints: [state.activeMode]
        }),
        message: `Saved to ${state.activeMode === "project" ? "active project" : state.activeMode}.`
      };
    case "start_session":
      return { state: startSession(state, state.activeMode === "project" ? "project" : "research"), message: "Session started." };
    case "end_session":
      return { state: endSession(state), message: "Session ended." };
    case "random_memory": {
      const memory = state.activeMode === "inspiration" ? randomInspiration(state) : randomProjectMemory(state);
      return { state, message: memory ? `Random memory: ${memory.title}` : "No memory available yet." };
    }
    case "switch_mode":
      return { state: setMode(state, parsed.mode!), message: `Switched to ${parsed.mode}.` };
    case "export_all":
      return { state, message: "Export prepared.", exportText: exportAllData(state) };
    default:
      return { state, message: "Command not recognized yet." };
  }
}
