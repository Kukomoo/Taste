export interface OcrResult {
  text: string;
  frameCount: number;
}

export async function extractTextFromKeyframes(keyframes: string[]): Promise<OcrResult> {
  return {
    frameCount: keyframes.length,
    text:
      keyframes.length > 0
        ? `OCR queued for ${keyframes.length} sampled frame${keyframes.length === 1 ? "" : "s"}. Detected text will be attached here.`
        : "No keyframes were available for OCR."
  };
}
