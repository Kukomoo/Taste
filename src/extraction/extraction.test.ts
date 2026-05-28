import { describe, expect, it } from "vitest";
import { extractTextFromKeyframes } from "./ocr";
import { generateStylePrompt } from "./promptGenerator";
import { transcribeRecording } from "./transcription";

describe("extraction pipeline stubs", () => {
  it("creates transcript placeholder from recording metadata", async () => {
    const result = await transcribeRecording({
      artifactId: "artifact_123",
      durationMs: 4500,
      source: "YouTube video"
    });
    expect(result.status).toBe("placeholder");
    expect(result.text).toContain("artifact_123");
  });

  it("creates OCR placeholder for sampled frames", async () => {
    const result = await extractTextFromKeyframes(["frame-a", "frame-b"]);
    expect(result.frameCount).toBe(2);
    expect(result.text).toContain("2 sampled frames");
  });

  it("generates a style prompt from transcript and OCR context", () => {
    const prompt = generateStylePrompt({
      source: "YouTube video",
      keyframeCount: 3,
      transcriptText: "The interface should feel calm.",
      ocrText: "Dashboard Revenue Retention"
    });
    expect(prompt).toContain("3 sampled keyframes");
    expect(prompt).toContain("Dashboard Revenue Retention");
  });
});
