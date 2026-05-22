import { toggleArchive } from "../logic/actions";
import { exportArchive } from "../logic/export";
import { archiveCleanupCandidates, archivedCaptures } from "../logic/selectors";
import type { AppState } from "../types";
import { Button } from "./ui";

export function ArchiveMode({ state, setState }: { state: AppState; setState: (state: AppState) => void }) {
  const archived = archivedCaptures(state);
  const cleanup = archiveCleanupCandidates(state);
  const exportText = exportArchive(state);

  return (
    <main className="mode-page archive-page">
      <section className="hero-panel">
        <div>
          <h1>Keep</h1>
          <p>A quiet place for saves you may need someday, without letting them crowd active work.</p>
          <div className="stats-strip">
            <span>{archived.length} archived</span>
            <span>{cleanup.length} unused</span>
            <span>{Math.max(1, Math.round(exportText.length / 1024))} KB export</span>
          </div>
        </div>
        <Button onClick={() => navigator.clipboard?.writeText(exportText)}>Copy archive JSON</Button>
      </section>

      <section className="digest-panel">
        <h2>Cleanup suggestion</h2>
        <p>{cleanup.length} archived save{cleanup.length === 1 ? "" : "s"} have never been revisited. Review them before they become background clutter.</p>
      </section>

      <section className="board-section">
        <h2>Archived captures</h2>
        <div className="archive-list">
          {archived.map((capture) => (
            <article key={capture.id} className="archive-row">
              <div>
                <strong>{capture.title}</strong>
                <span>{capture.type} · {capture.tags.join(", ") || "untagged"}</span>
              </div>
              <Button variant="ghost" onClick={() => setState(toggleArchive(state, capture.id))}>Unarchive</Button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
