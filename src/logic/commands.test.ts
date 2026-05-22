import { describe, expect, it } from "vitest";
import { seedState } from "../data/seed";
import { parseCommand, runCommand } from "./commands";

describe("voice command model", () => {
  it("parses mode switching", () => {
    expect(parseCommand("Hey TASTE, switch to Create")).toEqual({ intent: "switch_mode", mode: "inspiration" });
  });

  it("routes save command through active mode", () => {
    const output = runCommand(seedState, "Hey TASTE, save this");
    expect(output.state.captures[0].title).toContain("Voice-saved");
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
});
