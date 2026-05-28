import { FormEvent, useMemo, useRef, useState } from "react";
import { startRecordingCluster, stopRecordingCluster } from "../logic/actions";
import { runCommand } from "../logic/commands";
import { activeCluster, clusterNodes, latestCluster, recallMemory, userUnderstandingProfile } from "../logic/selectors";
import { sampleVideoKeyframes, startBrowserRecording, type BrowserRecording } from "../capture/browserRecorder";
import { saveRecordingArtifact } from "../capture/artifactStore";
import { extractTextFromKeyframes } from "../extraction/ocr";
import { generateStylePrompt } from "../extraction/promptGenerator";
import { transcribeRecording } from "../extraction/transcription";
import type { AppState, MemoryCluster } from "../types";
import { Button } from "./ui";

interface ChatLine {
  id: string;
  role: "user" | "kukomo";
  text: string;
}

const starters = [
  "Kukomo, watch this with me",
  "Save my thoughts: I like the spacing and calm pacing",
  "Remember this style",
  "What did I watch about backend auth?"
];

export function KukomoDashboard({
  state,
  setState,
  reset
}: {
  state: AppState;
  setState: (state: AppState) => void;
  reset: () => void;
}) {
  const recorderRef = useRef<BrowserRecording | null>(null);
  const [input, setInput] = useState("Kukomo, watch this with me");
  const [isProcessing, setIsProcessing] = useState(false);
  const [captureStatus, setCaptureStatus] = useState("Idle. Nothing is being captured.");
  const [chat, setChat] = useState<ChatLine[]>([
    {
      id: "hello",
      role: "kukomo",
      text: "I can watch with you, save your thoughts, break recordings into memory clusters, and help you find them later."
    }
  ]);

  const recording = activeCluster(state);
  const latest = latestCluster(state);
  const visibleCluster = recording ?? (state.focusedClusterId ? state.clusters.find((cluster) => cluster.id === state.focusedClusterId) : latest);
  const profile = userUnderstandingProfile(state);
  const recentClusters = state.clusters.slice(0, 4);
  const recallResults = useMemo(() => recallMemory(state, input), [input, state]);

  const submit = async (event?: FormEvent) => {
    event?.preventDefault();
    const command = input.trim();
    if (!command) return;

    append("user", command);

    if (isWatchCommand(command)) {
      await startWatching(command);
      setInput("");
      return;
    }

    if (isStopCommand(command)) {
      await stopWatching(command);
      setInput("");
      return;
    }

    const output = runCommand(state, command);
    setState(output.state);
    append("kukomo", naturalizeResponse(output.message));
    setInput("");
  };

  const startWatching = async (command = "Kukomo, watch this with me") => {
    try {
      setCaptureStatus("Requesting screen capture permission...");
      recorderRef.current = await startBrowserRecording();
      setState(startRecordingCluster(state, command.toLowerCase().includes("youtube") ? "YouTube video" : "Current screen", command));
      setCaptureStatus("Watching with you. I am capturing video/audio locally until you say stop.");
      append("kukomo", "I’m watching now. Tell me what you notice as you go, and say stop when you want me to break it into a memory cluster.");
    } catch (error) {
      recorderRef.current = null;
      setState(startRecordingCluster(state, command.toLowerCase().includes("youtube") ? "YouTube video" : "Current screen", command));
      setCaptureStatus(error instanceof Error ? `${error.message} I started a simulated watch session instead.` : "I started a simulated watch session instead.");
      append("kukomo", "I could not get browser recording permission here, so I started a simulated watch session. You can still say stop to generate a cluster.");
    }
  };

  const stopWatching = async (command = "Kukomo, stop") => {
    setIsProcessing(true);
    const recorder = recorderRef.current;

    try {
      if (!recorder) {
        setState(stopRecordingCluster(state, command));
        setCaptureStatus("Saved a simulated memory cluster.");
        append("kukomo", "Done. I made a memory cluster with source, keyframe, audio, transcript, OCR, prompt, and summary nodes.");
        return;
      }

      setCaptureStatus("Stopping and extracting frames, transcript, OCR, and prompt...");
      const recorded = await recorder.stop();
      const keyframes = await sampleVideoKeyframes(recorded.url, 3);
      const stored = await saveRecordingArtifact(recorded.blob);
      const transcript = await transcribeRecording({
        artifactId: stored.id,
        durationMs: recorded.durationMs,
        source: recording?.source ?? "Current recording"
      });
      const ocr = await extractTextFromKeyframes(keyframes);
      const promptText = generateStylePrompt({
        source: recording?.source ?? "Current recording",
        transcriptText: transcript.text,
        ocrText: ocr.text,
        keyframeCount: keyframes.length
      });

      setState(
        stopRecordingCluster(state, command, {
          artifactId: stored.id,
          videoUrl: recorded.url,
          videoSizeBytes: recorded.blob.size,
          durationMs: recorded.durationMs,
          keyframes,
          transcriptText: transcript.text,
          ocrText: ocr.text,
          promptText,
          audioStatus: "placeholder",
          transcriptStatus: transcript.status
        })
      );
      setCaptureStatus(`Saved the recording and extracted ${keyframes.length} keyframes into a cluster.`);
      append("kukomo", `Done. I saved the recording, sampled ${keyframes.length} keyframes, and created transcript, OCR, prompt, and summary nodes.`);
    } catch (error) {
      setState(stopRecordingCluster(state, command));
      setCaptureStatus(error instanceof Error ? `${error.message} I saved fallback cluster nodes instead.` : "I saved fallback cluster nodes instead.");
      append("kukomo", "I hit a capture-processing issue, but I still saved fallback cluster nodes so the memory is not lost.");
    } finally {
      recorderRef.current = null;
      setIsProcessing(false);
    }
  };

  const append = (role: ChatLine["role"], text: string) => {
    setChat((items) => [...items, { id: `${role}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, role, text }].slice(-8));
  };

  return (
    <main className="kukomo-home">
      <header className="kukomo-topbar">
        <div className="brand compact-brand">
          <div className="brand-mark">K</div>
          <div>
            <strong>Kukomo</strong>
            <span>taste-aware memory assistant</span>
          </div>
        </div>
        <div className="topbar-actions">
          <Button variant="ghost" onClick={reset}>Reset demo</Button>
        </div>
      </header>

      <section className="conversation-hero">
        <div className="conversation-main">
          <span className="section-label">Talk naturally</span>
          <h1>What are we noticing today?</h1>
          <p>
            Ask Kukomo to watch, remember, or find something. It captures only when you trigger it, then turns what it sees and hears into reusable memory clusters.
          </p>

          <form className="chat-command" onSubmit={submit}>
            <input
              aria-label="Talk to Kukomo"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Kukomo, watch this with me..."
            />
            <Button type="submit" disabled={isProcessing}>{isProcessing ? "Thinking" : "Send"}</Button>
          </form>

          <div className="starter-row" aria-label="Example commands">
            {starters.map((starter) => (
              <button key={starter} onClick={() => setInput(starter)}>{starter}</button>
            ))}
          </div>

          <div className="chat-thread" aria-live="polite">
            {chat.map((line) => (
              <article key={line.id} className={`chat-bubble ${line.role}`}>
                <span>{line.role === "kukomo" ? "Kukomo" : "You"}</span>
                <p>{line.text}</p>
              </article>
            ))}
          </div>
        </div>

        <aside className={`watch-card ${recording ? "is-recording" : ""}`}>
          <span>{recording ? "Watching now" : "Ready when you are"}</span>
          <strong>{recording?.title ?? "Nothing is being captured"}</strong>
          <p>{captureStatus}</p>
          <div className="watch-actions">
            <Button onClick={() => startWatching("Kukomo, watch this with me")} disabled={Boolean(recording) || isProcessing}>Watch with me</Button>
            <Button variant="secondary" onClick={() => startWatching("Kukomo, record this YouTube video")} disabled={Boolean(recording) || isProcessing}>Record YouTube</Button>
            <Button variant="ghost" onClick={() => stopWatching("Kukomo, stop")} disabled={!recording || isProcessing}>{isProcessing ? "Processing" : "Stop"}</Button>
          </div>
        </aside>
      </section>

      <section className="memory-overview">
        <div className="memory-section">
          <div className="section-heading">
            <span className="section-label">Recent memories</span>
            <h2>Things Kukomo has already understood</h2>
          </div>
          <div className="memory-card-grid">
            {recentClusters.map((cluster) => (
              <MemoryCard key={cluster.id} cluster={cluster} state={state} setState={setState} />
            ))}
          </div>
        </div>

        <aside className="taste-panel">
          <span className="section-label">Taste map</span>
          <h2>What Kukomo is learning</h2>
          <div className="taste-tags">
            {profile.topInterests.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
          <p>{profile.clusterCount} clusters, {profile.captureCount} saves, and {profile.promptCount} reusable prompts are shaping your memory.</p>
          {recallResults[0] ? (
            <div className="live-recall">
              <span>Closest match</span>
              <strong>{recallResults[0].title}</strong>
              <p>{recallResults[0].reason}</p>
            </div>
          ) : null}
        </aside>
      </section>

      {visibleCluster ? (
        <section className="quiet-details" aria-label="Selected memory details">
          <ClusterPreview cluster={visibleCluster} state={state} />
        </section>
      ) : null}
    </main>
  );
}

function MemoryCard({ cluster, state, setState }: { cluster: MemoryCluster; state: AppState; setState: (state: AppState) => void }) {
  const nodes = clusterNodes(state, cluster.id);
  const tags = [...new Set(nodes.flatMap((node) => node.tags))].slice(0, 4);
  const summary = nodes.find((node) => node.type === "summary")?.content ?? nodes.find((node) => node.type === "transcript")?.content ?? cluster.source;

  return (
    <button className="memory-card" onClick={() => setState({ ...state, focusedClusterId: cluster.id })}>
      <span>{cluster.status === "recording" ? "Live cluster" : "Memory cluster"}</span>
      <strong>{cluster.title}</strong>
      <p>{summary}</p>
      <small>{nodes.length} nodes · {tags.join(" / ")}</small>
    </button>
  );
}

function ClusterPreview({ cluster, state }: { cluster: MemoryCluster; state: AppState }) {
  const nodes = clusterNodes(state, cluster.id);
  return (
    <>
      <div className="section-heading">
        <span className="section-label">Opened memory</span>
        <h2>{cluster.title}</h2>
      </div>
      <div className="node-summary-grid">
        {nodes.slice(0, 6).map((node) => (
          <article key={node.id} className="node-summary">
            <span>{node.type}</span>
            <strong>{node.title}</strong>
            <p>{node.content}</p>
          </article>
        ))}
      </div>
    </>
  );
}

function isWatchCommand(command: string) {
  const normalized = command.toLowerCase();
  return normalized.includes("watch this") || normalized.includes("watch with me") || normalized.includes("start watching");
}

function isStopCommand(command: string) {
  const normalized = command.toLowerCase();
  return normalized === "stop" || normalized.includes("stop recording") || normalized.includes("stop watching") || normalized.includes("stop and");
}

function naturalizeResponse(message: string) {
  if (message.startsWith("I found")) return message;
  if (message.includes("Saved to")) return "Saved. I’ll keep it connected to what you are doing now.";
  if (message.includes("Random memory")) return message.replace("Random memory:", "Here’s one memory worth revisiting:");
  if (message.includes("not recognized")) return "I do not know that exact command yet, but you can ask me to watch, stop, remember, save, or find something.";
  return message;
}
