import { setMode } from "./logic/actions";
import { modeMeta } from "./logic/selectors";
import type { Mode } from "./types";
import { useTasteState } from "./hooks/useTasteState";
import { ProjectMode } from "./components/ProjectMode";
import { GrowthMode } from "./components/GrowthMode";
import { InspirationMode } from "./components/InspirationMode";
import { ResearchMode } from "./components/ResearchMode";
import { ArchiveMode } from "./components/ArchiveMode";
import { Button } from "./components/ui";
import { CommandCenter } from "./components/CommandCenter";

const modeOrder: Mode[] = ["project", "growth", "research", "inspiration", "archive"];

export function App() {
  const { state, setState, reset } = useTasteState();
  const meta = modeMeta[state.activeMode];

  return (
    <div className={`app-shell accent-${meta.accent}`}>
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">T</div>
          <div>
            <strong>TASTE</strong>
            <span>intent-aware memory</span>
          </div>
        </div>
        <nav className="mode-nav" aria-label="Modes">
          {modeOrder.map((mode) => (
            <button
              key={mode}
              className={state.activeMode === mode ? "active" : ""}
              onClick={() => setState(setMode(state, mode))}
            >
              <span>{modeMeta[mode].label}</span>
              <small>{modeMeta[mode].verb}</small>
            </button>
          ))}
        </nav>
        <CommandCenter state={state} setState={setState} />
        <Button variant="ghost" onClick={reset}>Reset demo data</Button>
      </aside>

      <div className="content">
        <section className="onboarding-strip">
          <strong>Prototype status</strong>
          <span>Create a project, save your first capture, switch modes, then use the command simulator to test voice-style flows.</span>
        </section>
        {state.activeMode === "project" ? (
          <ProjectMode state={state} setState={setState} />
        ) : state.activeMode === "growth" ? (
          <GrowthMode state={state} setState={setState} />
        ) : state.activeMode === "inspiration" ? (
          <InspirationMode state={state} setState={setState} />
        ) : state.activeMode === "research" ? (
          <ResearchMode state={state} setState={setState} />
        ) : state.activeMode === "archive" ? (
          <ArchiveMode state={state} setState={setState} />
        ) : (
          <main className="mode-page placeholder-mode">
            <section className="hero-panel">
              <div>
                <h1>{meta.label}</h1>
                <p>{meta.verb}. This mode lands in a later sprint, with its own layout, curation, and actions.</p>
              </div>
            </section>
          </main>
        )}
      </div>
    </div>
  );
}
