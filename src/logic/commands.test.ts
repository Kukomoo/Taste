import { describe, expect, it } from "vitest";
import { seedState } from "../data/seed";
import { parseCommand, runCommand } from "./commands";

describe("voice command model", () => {
  it("parses mode switching", () => {
    expect(parseCommand("Hey TASTE, switch to Create")).toEqual({ intent: "switch_mode", mode: "inspiration" });
  });

  it("parses recording commands", () => {
    expect(parseCommand("Hey Kukomo, start recording this YouTube video now").intent).toBe("start_recording");
    expect(parseCommand("Stop and break it down").intent).toBe("stop_recording");
  });

  it("parses compact keyboard aliases", () => {
    expect(parseCommand("record youtube").intent).toBe("start_recording");
    expect(parseCommand("switch create")).toEqual({ intent: "switch_mode", mode: "inspiration" });
    expect(parseCommand("random").intent).toBe("random_memory");
    expect(parseCommand("save").intent).toBe("save");
    expect(parseCommand("remember that backend video").intent).toBe("recall_memory");
    expect(parseCommand("Hey Kukomo, remember backend video").intent).toBe("recall_memory");
  });

  it("routes save command through active mode", () => {
    const output = runCommand(seedState, "Hey TASTE, save this");
    expect(output.state.captures[0].title).toContain("Voice-saved");
  });

  it("records command history after running a command", () => {
    const output = runCommand(seedState, "record youtube");
    expect(output.state.commandHistory[0]).toMatchObject({
      input: "record youtube",
      intent: "start_recording"
    });
  });

  it("starts and ends sessions", () => {
    const started = runCommand(seedState, "Hey TASTE, start session").state;
    const ended = runCommand(started, "Hey TASTE, end session").state;
    expect(started.currentSessionId).toBeTruthy();
    expect(ended.currentSessionId).toBeUndefined();
  });

  it("prepares full export", () => {
    const output = runCommand(seedState, "Hey TASTE, export all");
    expect(output.exportText).toContain("activeMode");
  });

  it("routes recording into a processed memory cluster", () => {
    const recording = runCommand(seedState, "Hey Kukomo, start recording this YouTube video now").state;
    expect(recording.activeClusterId).toBeTruthy();
    expect(recording.clusters[0].status).toBe("recording");

    const processed = runCommand(recording, "Stop and break it down").state;
    const cluster = processed.clusters[0];
    expect(processed.activeClusterId).toBeUndefined();
    expect(cluster.status).toBe("ready");
    expect(cluster.nodeIds).toHaveLength(7);
    expect(processed.nodes.filter((node) => node.clusterId === cluster.id).map((node) => node.type)).toEqual([
      "source",
      "keyframe",
      "audio",
      "transcript",
      "ocr",
      "prompt",
      "summary"
    ]);
  });

  it("caps command history to recent entries", () => {
    let state = seedState;
    for (let index = 0; index < 25; index += 1) {
      state = runCommand(state, "random").state;
    }
    expect(state.commandHistory).toHaveLength(20);
  });

  it("recalls a matching memory cluster from natural language", () => {
    const output = runCommand(seedState, "remember that video i watched the other day about how to build the backend");
    expect(output.message).toContain("Backend build video");
    expect(output.state.focusedClusterId).toBe("cluster_2");
  });
});
