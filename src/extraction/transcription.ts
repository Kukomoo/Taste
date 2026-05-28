import type { RecordingArtifact } from "../types";

export interface TranscriptionInput {
  artifactId?: string;
  durationMs?: number;
  source: string;
}

export interface TranscriptionResult {
  status: RecordingArtifact["transcriptStatus"];
  text: string;
}

export async function transcribeRecording(input: TranscriptionInput): Promise<TranscriptionResult> {
  return {
    status: "placeholder",
    text: [
      `Transcript queued for ${input.source}.`,
      input.artifactId ? `Artifact ${input.artifactId} is ready for a speech-to-text worker.` : "No persistent artifact id was available.",
      `Approximate duration: ${Math.round((input.durationMs ?? 0) / 1000)} seconds.`
    ].join(" ")
  };
}
