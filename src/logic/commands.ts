import { addCapture, endSession, setMode, startRecordingCluster, startSession, stopRecordingCluster } from "./actions";
import { exportAllData } from "./export";
import { randomInspiration, randomProjectMemory, recallMemory } from "./selectors";
import type { AppState, Mode } from "../types";

export type CommandIntent =
  | "save"
  | "start_session"
  | "end_session"
  | "start_recording"
  | "stop_recording"
  | "random_memory"
  | "recall_memory"
  | "switch_mode"
  | "export_all"
  | "unknown";

export interface ParsedCommand {
  intent: CommandIntent;
  mode?: Mode;
  query?: string;
}

export interface CommandResult {
  state: AppState;
  message: string;
  exportText?: string;
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
  const commandText = normalized.replace(/^(hey|ok|okay)\s+(taste|kukomo)\s*/, "").trim();
  if (["save", "save this", "capture"].includes(commandText) || commandText.includes("save this")) return { intent: "save" };
  if (
    commandText === "record" ||
    commandText === "record youtube" ||
    commandText === "record screen" ||
    commandText.includes("start recording") ||
    commandText.includes("record now")
  ) {
    return { intent: "start_recording" };
  }
  if (commandText === "stop" || commandText === "stop recording" || commandText.includes("stop recording") || commandText.includes("stop and break")) return { intent: "stop_recording" };
  if (commandText.includes("start session")) return { intent: "start_session" };
  if (commandText.includes("end session")) return { intent: "end_session" };
  if (commandText === "random" || commandText.includes("random memory") || commandText.includes("random inspiration")) return { intent: "random_memory" };
  if (
    commandText.startsWith("remember") ||
    commandText.startsWith("what did i save") ||
    commandText.startsWith("what did i watch") ||
    commandText.startsWith("what was that") ||
    commandText.startsWith("pull up") ||
    commandText.startsWith("show me what") ||
    commandText.includes("the other day")
  ) {
    return { intent: "recall_memory", query: input };
  }
  if (commandText.includes("export")) return { intent: "export_all" };
  if (commandText.includes("switch") || commandText.startsWith("go ") || commandText.startsWith("open ")) {
    const mode = Object.entries(modeWords).find(([word]) => commandText.includes(word))?.[1];
    return mode ? { intent: "switch_mode", mode } : { intent: "unknown" };
  }
  return { intent: "unknown" };
}

export function runCommand(state: AppState, input: string): CommandResult {
  const parsed = parseCommand(input);
  const result = runParsedCommand(state, input, parsed);
  return {
    ...result,
    state: appendCommandHistory(result.state, input, parsed.intent, result.message)
  };
}

function runParsedCommand(state: AppState, input: string, parsed: ParsedCommand): CommandResult {
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
    case "start_recording": {
      const source = input.toLowerCase().includes("youtube") ? "YouTube video" : "Current screen";
      return { state: startRecordingCluster(state, source, input), message: `Recording ${source}. Tracking frames, audio, transcript, and prompts.` };
    }
    case "stop_recording":
      return { state: stopRecordingCluster(state, input), message: "Recording stopped. Cluster generated with source, keyframes, audio, transcript, OCR, prompt, and summary nodes." };
    case "random_memory": {
      const memory = state.activeMode === "inspiration" ? randomInspiration(state) : randomProjectMemory(state);
      return { state, message: memory ? `Random memory: ${memory.title}` : "No memory available yet." };
    }
    case "recall_memory": {
      const results = recallMemory(state, parsed.query ?? input);
      const top = results[0];
      return {
        state: top?.kind === "cluster" ? { ...state, focusedClusterId: top.id } : state,
        message: top
          ? `I found ${top.kind}: ${top.title}. ${top.reason}`
          : "I could not find that yet. Record or save more context and ask again."
      };
    }
    case "switch_mode":
      return { state: setMode(state, parsed.mode!), message: `Switched to ${parsed.mode}.` };
    case "export_all":
      return { state, message: "Export prepared.", exportText: exportAllData(state) };
    default:
      return { state, message: "Command not recognized yet." };
  }
}

function appendCommandHistory(state: AppState, input: string, intent: CommandIntent, message: string): AppState {
  return {
    ...state,
    commandHistory: [
      {
        id: `cmd_${Math.random().toString(36).slice(2, 9)}`,
        input,
        intent,
        message,
        createdAt: new Date().toISOString()
      },
      ...(state.commandHistory ?? [])
    ].slice(0, 20)
  };
}
