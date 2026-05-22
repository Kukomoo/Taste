import { addCapture, endSession, startSession } from "../logic/actions";
import { activeProject, researchSessions } from "../logic/selectors";
import type { AppState } from "../types";
import { Button } from "./ui";

export function ResearchMode({ state, setState }: { state: AppState; setState: (state: AppState) => void }) {
  const project = activeProject(state);
  const sessions = researchSessions(state);
  const current = state.sessions.find((session) => session.id === state.currentSessionId);

  return (
    <main className="mode-page research-page">
      <section className="hero-panel">
        <div>
          <h1>Understand</h1>
          <p>Research sessions become reusable learning trails, attached to projects when they help you ship.</p>
          <div className="stats-strip">
            <span>{sessions.length} sessions</span>
            <span>{project.name}</span>
            <span>{current ? "session active" : "ready"}</span>
          </div>
        </div>
        <div className="control-stack">
          <Button onClick={() => setState(startSession(state, "research"))} disabled={Boolean(state.currentSessionId)}>
            Start session
          </Button>
          <Button variant="secondary" onClick={() => setState(addCapture(state, {
            title: "Research page capture",
            type: "link",
            sourceUrl: "https://example.com/research",
            tags: ["research"],
            modeHints: ["research", "project"]
          }))}>
            Save research page
          </Button>
          <Button variant="ghost" onClick={() => setState(endSession(state))} disabled={!state.currentSessionId}>
            End session
          </Button>
        </div>
      </section>

      <section className="board-section timeline-section">
        <h2>Research timeline</h2>
        <div className="timeline">
          {sessions.map((session) => (
            <article key={session.id} className={`timeline-card ${session.id === state.currentSessionId ? "active" : ""}`}>
              <span>{session.endedAt ? "Complete" : "In progress"}</span>
              <h3>{session.title}</h3>
              <p>{session.summary}</p>
              <div className="tag-row">
                <span>{session.captureIds.length} captures</span>
                <span>{state.projects.find((item) => item.id === session.projectId)?.name ?? "No project"}</span>
              </div>
              {session.keyPages.length > 0 ? <small>Key pages: {session.keyPages.join(", ")}</small> : null}
            </article>
          ))}
        </div>
      </section>

      <section className="digest-panel">
        <h2>Suggested next deep dive</h2>
        <p>You have repeated activity around pricing, dashboards, and UI systems. A useful next session would compare mobile dashboard layouts for the active project.</p>
      </section>
    </main>
  );
}
