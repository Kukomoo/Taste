import { startRecordingCluster, stopRecordingCluster } from "../logic/actions";
import { activeCluster, clusterNodes, latestCluster } from "../logic/selectors";
import type { AppState, MemoryNodeType } from "../types";
import { Button } from "./ui";

const nodeLabels: Record<MemoryNodeType, string> = {
  source: "Source",
  keyframe: "Keyframes",
  audio: "Audio",
  transcript: "Transcript",
  prompt: "Prompt",
  summary: "Summary"
};

export function AssistantCockpit({ state, setState }: { state: AppState; setState: (state: AppState) => void }) {
  const recording = activeCluster(state);
  const cluster = recording ?? latestCluster(state);
  const nodes = cluster ? clusterNodes(state, cluster.id) : [];

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
          <Button onClick={() => setState(startRecordingCluster(state, "YouTube video", "Hey Kukomo, start recording this YouTube video now"))} disabled={Boolean(recording)}>
            Record YouTube
          </Button>
          <Button variant="secondary" onClick={() => setState(startRecordingCluster(state, "Current screen", "Record now"))} disabled={Boolean(recording)}>
            Record now
          </Button>
          <Button variant="ghost" onClick={() => setState(stopRecordingCluster(state, "Stop and break it down"))} disabled={!recording}>
            Stop and process
          </Button>
        </div>
      </div>

      <div className="cluster-panel">
        <div className="cluster-header">
          <span>{recording ? "Live recording" : "Latest cluster"}</span>
          <strong>{cluster?.title ?? "No cluster yet"}</strong>
          <small>{cluster?.source ?? "Trigger recording to create the first cluster."}</small>
        </div>
        <div className="node-rail">
          {(nodes.length > 0 ? nodes : placeholderNodes).map((node) => (
            <article className={`node-chip node-${node.type}`} key={node.id}>
              <span>{nodeLabels[node.type]}</span>
              <strong>{node.title}</strong>
              <small>{node.content}</small>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const placeholderNodes = [
  { id: "p1", type: "source" as const, title: "Source", content: "URL and capture context" },
  { id: "p2", type: "keyframe" as const, title: "Keyframes", content: "Visual style scans" },
  { id: "p3", type: "audio" as const, title: "Audio", content: "Audio and pacing" },
  { id: "p4", type: "transcript" as const, title: "Transcript", content: "Timestamped text" },
  { id: "p5", type: "prompt" as const, title: "Prompt", content: "Reverse-engineered style" },
  { id: "p6", type: "summary" as const, title: "Summary", content: "Reusable cluster brief" }
];
