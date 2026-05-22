import { setMode } from "./logic/actions";
import { modeMeta } from "./logic/selectors";
import type { Mode } from "./types";
import { useTasteState } from "./hooks/useTasteState";
import { ProjectMode } from "./components/ProjectMode";
import { Button } from "./components/ui";

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
        <Button variant="ghost" onClick={reset}>Reset demo data</Button>
      </aside>

      <div className="content">
        {state.activeMode === "project" ? (
          <ProjectMode state={state} setState={setState} />
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
