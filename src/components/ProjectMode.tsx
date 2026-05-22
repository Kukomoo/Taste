import { addCapture, createProject, setActiveProject, toggleArchive, togglePin } from "../logic/actions";
import { activeProject, capturesByType, digestItems, projectCaptures, projectSessions, randomProjectMemory } from "../logic/selectors";
import type { AppState } from "../types";
import { Button, CaptureCard } from "./ui";

export function ProjectMode({ state, setState }: { state: AppState; setState: (state: AppState) => void }) {
  const project = activeProject(state);
  const captures = projectCaptures(state, project.id);
  const grouped = capturesByType(captures);
  const sessions = projectSessions(state, project.id);
  const digest = digestItems(captures);
  const randomMemory = randomProjectMemory(state);

  return (
    <main className="mode-page project-page">
      <section className="hero-panel">
        <div>
          <h1>{project.emoji} {project.name}</h1>
          <p>{project.goal}</p>
          <div className="stats-strip">
            <span>{captures.length} captures</span>
            <span>{sessions.length} sessions</span>
            <span>{grouped.highlights.length} highlights</span>
          </div>
        </div>
        <div className="control-stack">
          <select value={project.id} onChange={(event) => setState(setActiveProject(state, event.target.value))}>
            {state.projects.map((item) => (
              <option value={item.id} key={item.id}>{item.name}</option>
            ))}
          </select>
          <Button onClick={() => setState(addCapture(state, {
            title: "New project reference",
            type: "link",
            sourceUrl: "https://example.com",
            tags: ["reference"],
            modeHints: ["project"]
          }))}>Save link</Button>
          <Button variant="secondary" onClick={() => setState(addCapture(state, {
            title: "Fresh UI screenshot",
            type: "screenshot",
            thumbnail: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80",
            tags: ["ui", "visual"],
            modeHints: ["project", "inspiration"]
          }))}>Save screenshot</Button>
        </div>
      </section>

      <section className="quick-create">
        <Button variant="secondary" onClick={() => setState(createProject(state, "New Builder Project", "Gather references for the next product slice."))}>
          New project
        </Button>
        <div className="memory-callout">
          <strong>Random project memory:</strong> {randomMemory?.title ?? "Add more captures to rediscover later."}
        </div>
      </section>

      <section className="digest-panel">
        <h2>This week in {project.name}</h2>
        <div className="digest-grid">
          {digest.map((item) => (
            <div key={item.id} className="digest-item">
              <span>{item.pinned ? "Most important" : item.revisitCount > 1 ? "Most revisited" : "Worth another look"}</span>
              <strong>{item.title}</strong>
            </div>
          ))}
        </div>
      </section>

      <BoardSection title="Highlights" captures={grouped.highlights} state={state} setState={setState} />
      <BoardSection title="Visuals" captures={grouped.visuals} state={state} setState={setState} />
      <BoardSection title="Documents and Links" captures={grouped.documents} state={state} setState={setState} />

      <section className="board-section">
        <h2>Sessions</h2>
        <div className="session-list">
          {sessions.map((session) => (
            <article key={session.id} className="session-card">
              <h3>{session.title}</h3>
              <p>{session.summary}</p>
              <span>{session.captureIds.length} captures</span>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function BoardSection({
  title,
  captures,
  state,
  setState
}: {
  title: string;
  captures: ReturnType<typeof projectCaptures>;
  state: AppState;
  setState: (state: AppState) => void;
}) {
  return (
    <section className="board-section">
      <h2>{title}</h2>
      <div className="card-grid">
        {captures.length === 0 ? <p className="empty">Nothing here yet.</p> : captures.map((capture) => (
          <CaptureCard
            key={capture.id}
            capture={capture}
            onPin={() => setState(togglePin(state, capture.id))}
            onArchive={() => setState(toggleArchive(state, capture.id))}
          />
        ))}
      </div>
    </section>
  );
}
