import { startRecordingCluster, stopRecordingCluster } from "../logic/actions";
import { sampleVideoKeyframes, startBrowserRecording, type BrowserRecording } from "../capture/browserRecorder";
import { artifactUri, loadRecordingArtifact, parseArtifactUri, saveRecordingArtifact } from "../capture/artifactStore";
import { activeCluster, clusterNodes, latestCluster } from "../logic/selectors";
import type { AppState, MemoryNodeType } from "../types";
import { Button } from "./ui";
import { useEffect, useRef, useState } from "react";

const nodeLabels: Record<MemoryNodeType, string> = {
  source: "Source",
  keyframe: "Keyframes",
  audio: "Audio",
  transcript: "Transcript",
  prompt: "Prompt",
  summary: "Summary"
};

interface RenderNode {
  id: string;
  type: MemoryNodeType;
  title: string;
  content: string;
  thumbnail?: string;
}

export function AssistantCockpit({ state, setState }: { state: AppState; setState: (state: AppState) => void }) {
  const recorderRef = useRef<BrowserRecording | null>(null);
  const [captureStatus, setCaptureStatus] = useState("Browser capture ready. Permission appears only when you record.");
  const [isProcessing, setIsProcessing] = useState(false);
  const recording = activeCluster(state);
  const cluster = recording ?? latestCluster(state);
  const nodes = cluster ? clusterNodes(state, cluster.id) : [];

  const startRealRecording = async (source: string, command: string) => {
    try {
      setCaptureStatus("Requesting screen capture permission...");
      recorderRef.current = await startBrowserRecording();
      setState(startRecordingCluster(state, source, command));
      setCaptureStatus("Recording live. Kukomo is buffering video and audio locally.");
    } catch (error) {
      recorderRef.current = null;
      setState(startRecordingCluster(state, source, command));
      setCaptureStatus(error instanceof Error ? `${error.message} Using simulated recording fallback.` : "Using simulated recording fallback.");
    }
  };

  const stopAndProcess = async () => {
    const recorder = recorderRef.current;
    setIsProcessing(true);
    try {
      if (!recorder) {
        setState(stopRecordingCluster(state, "Stop and break it down"));
        setCaptureStatus("Processed simulated recording into cluster nodes.");
        return;
      }
      setCaptureStatus("Stopping recorder and sampling keyframes...");
      const recorded = await recorder.stop();
      const keyframes = await sampleVideoKeyframes(recorded.url, 3);
      const stored = await saveRecordingArtifact(recorded.blob);
      setState(
        stopRecordingCluster(state, "Stop and break it down", {
          artifactId: stored.id,
          videoUrl: recorded.url,
          videoSizeBytes: recorded.blob.size,
          durationMs: recorded.durationMs,
          keyframes,
          audioStatus: "placeholder",
          transcriptStatus: "placeholder"
        })
      );
      setCaptureStatus(`Saved WebM to IndexedDB and processed ${keyframes.length} keyframes into clustered nodes.`);
    } catch (error) {
      setState(stopRecordingCluster(state, "Stop and break it down"));
      setCaptureStatus(error instanceof Error ? `${error.message} Processed fallback nodes instead.` : "Processed fallback nodes instead.");
    } finally {
      recorderRef.current = null;
      setIsProcessing(false);
    }
  };

  return (
    <section className={`assistant-cockpit ${recording ? "is-recording" : ""}`}>
      <div className="assistant-orb" aria-hidden="true">
        <span />
      </div>
      <div className="assistant-copy">
        <span className="section-label">Kukomo command layer</span>
        <h1>Say it or type it. Kukomo tracks the trail.</h1>
        <p>
          Record a YouTube video, screen flow, or research moment. When you stop, Kukomo breaks it into a cluster:
          frames, audio, transcript, prompt, source, and summary nodes.
        </p>
        <div className="command-pills" aria-label="Example commands">
          <code>Hey Kukomo, start recording this YouTube video now</code>
          <code>Record now</code>
          <code>Stop and break it down</code>
          <code>⌘K record youtube</code>
        </div>
        <div className="action-row">
          <Button onClick={() => startRealRecording("YouTube video", "Hey Kukomo, start recording this YouTube video now")} disabled={Boolean(recording) || isProcessing}>
            Record YouTube
          </Button>
          <Button variant="secondary" onClick={() => startRealRecording("Current screen", "Record now")} disabled={Boolean(recording) || isProcessing}>
            Record now
          </Button>
          <Button variant="ghost" onClick={stopAndProcess} disabled={!recording || isProcessing}>
            {isProcessing ? "Processing..." : "Stop and process"}
          </Button>
        </div>
        <div className="capture-status">
          <span>{recording ? "Active capture" : "Capture idle"}</span>
          <strong>{captureStatus}</strong>
        </div>
      </div>

      <div className="cluster-panel">
        <div className="cluster-header">
          <span>{recording ? "Live recording" : "Latest cluster"}</span>
          <strong>{cluster?.title ?? "No cluster yet"}</strong>
          <small>{cluster?.source ?? "Trigger recording to create the first cluster."}</small>
        </div>
        <div className="node-rail">
          {(nodes.length > 0 ? nodes : placeholderNodes).map((node: RenderNode) => (
            <article className={`node-chip node-${node.type}`} key={node.id}>
              <span>{nodeLabels[node.type]}</span>
              <strong>{node.title}</strong>
              {node.type === "source" && (node.content.startsWith("blob:") || node.content.startsWith("artifact://")) ? (
                <ArtifactVideo uri={node.content} />
              ) : node.thumbnail ? (
                <img className="node-thumb" src={node.thumbnail} alt="" />
              ) : null}
              <small>
                {node.content.startsWith("blob:")
                  ? "Local WebM artifact stored for this browser session."
                  : node.content.startsWith("artifact://")
                    ? "Persistent WebM artifact stored in this browser."
                    : node.content}
              </small>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const placeholderNodes: RenderNode[] = [
  { id: "p1", type: "source" as const, title: "Source", content: "URL and capture context" },
  { id: "p2", type: "keyframe" as const, title: "Keyframes", content: "Visual style scans" },
  { id: "p3", type: "audio" as const, title: "Audio", content: "Audio and pacing" },
  { id: "p4", type: "transcript" as const, title: "Transcript", content: "Timestamped text" },
  { id: "p5", type: "prompt" as const, title: "Prompt", content: "Reverse-engineered style" },
  { id: "p6", type: "summary" as const, title: "Summary", content: "Reusable cluster brief" }
];

function ArtifactVideo({ uri }: { uri: string }) {
  const [src, setSrc] = useState(uri.startsWith("blob:") ? uri : "");
  const [status, setStatus] = useState(uri.startsWith("blob:") ? "Local session video artifact." : "Loading persistent artifact...");

  useEffect(() => {
    let objectUrl = "";
    const artifactId = parseArtifactUri(uri);
    if (!artifactId) return;

    loadRecordingArtifact(artifactId)
      .then((record) => {
        if (!record) {
          setStatus("Artifact metadata exists, but the local IndexedDB blob was not found.");
          return;
        }
        objectUrl = URL.createObjectURL(record.blob);
        setSrc(objectUrl);
        setStatus(`Restored ${Math.max(1, Math.round(record.size / 1024))} KB WebM from IndexedDB.`);
      })
      .catch(() => setStatus("Could not restore the local recording artifact."));

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [uri]);

  return (
    <>
      {src ? <video className="node-video" src={src} controls muted /> : <div className="node-video video-placeholder" />}
      <small>{uri.startsWith("artifact://") ? `${status} (${artifactUri(parseArtifactUri(uri) ?? "")})` : status}</small>
    </>
  );
}
