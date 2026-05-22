export interface BrowserRecording {
  stop: () => Promise<RecordedVideo>;
  stream: MediaStream;
}

export interface RecordedVideo {
  blob: Blob;
  url: string;
  durationMs: number;
}

export async function startBrowserRecording(): Promise<BrowserRecording> {
  if (!navigator.mediaDevices?.getDisplayMedia) {
    throw new Error("Screen capture is not available in this browser.");
  }

  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: {
      displaySurface: "browser"
    },
    audio: true
  });

  const chunks: BlobPart[] = [];
  const recorder = new MediaRecorder(stream, {
    mimeType: pickMimeType()
  });
  const startedAt = performance.now();

  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) chunks.push(event.data);
  };

  recorder.start(250);

  return {
    stream,
    stop: () =>
      new Promise((resolve) => {
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: recorder.mimeType || "video/webm" });
          resolve({
            blob,
            url: URL.createObjectURL(blob),
            durationMs: Math.max(0, Math.round(performance.now() - startedAt))
          });
        };
        if (recorder.state !== "inactive") recorder.stop();
        stream.getTracks().forEach((track) => track.stop());
      })
  };
}

export async function sampleVideoKeyframes(videoUrl: string, count = 3): Promise<string[]> {
  const video = document.createElement("video");
  video.src = videoUrl;
  video.muted = true;
  video.playsInline = true;
  video.crossOrigin = "anonymous";

  await waitForLoadedMetadata(video);
  const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : count;
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth || 960;
  canvas.height = video.videoHeight || 540;
  const ctx = canvas.getContext("2d");
  if (!ctx) return [];

  const frames: string[] = [];
  for (let index = 0; index < count; index += 1) {
    const time = Math.min(duration - 0.1, (duration / (count + 1)) * (index + 1));
    await seekVideo(video, Math.max(0, time));
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    frames.push(canvas.toDataURL("image/jpeg", 0.72));
  }
  return frames;
}

function pickMimeType() {
  const candidates = ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) ?? "";
}

function waitForLoadedMetadata(video: HTMLVideoElement) {
  return new Promise<void>((resolve, reject) => {
    video.onloadedmetadata = () => resolve();
    video.onerror = () => reject(new Error("Could not load recorded video metadata."));
  });
}

function seekVideo(video: HTMLVideoElement, time: number) {
  return new Promise<void>((resolve, reject) => {
    video.onseeked = () => resolve();
    video.onerror = () => reject(new Error("Could not sample recorded video frame."));
    video.currentTime = time;
  });
}
