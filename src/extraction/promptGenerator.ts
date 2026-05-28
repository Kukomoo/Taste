export interface PromptGenerationInput {
  source: string;
  transcriptText: string;
  ocrText: string;
  keyframeCount: number;
}

export function generateStylePrompt(input: PromptGenerationInput) {
  return [
    `Reverse engineer the style of ${input.source}.`,
    `Use ${input.keyframeCount} sampled keyframe${input.keyframeCount === 1 ? "" : "s"} to infer composition, spacing, hierarchy, color, typography, motion rhythm, and component density.`,
    `Use transcript cues for intent and tone: ${input.transcriptText}`,
    `Use detected on-screen text as product/context clues: ${input.ocrText}`,
    "Generate a practical design prompt that can recreate the interface style without copying brand-specific assets."
  ].join(" ");
}
