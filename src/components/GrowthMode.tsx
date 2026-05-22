import { markGrowthStatus } from "../logic/actions";
import { growthCaptures, growthFocus, neverTriedGrowth } from "../logic/selectors";
import type { AppState, GrowthStatus } from "../types";
import { Button, CaptureCard } from "./ui";

export function GrowthMode({ state, setState }: { state: AppState; setState: (state: AppState) => void }) {
  const focus = growthFocus(state);
  const growth = growthCaptures(state);
  const untried = neverTriedGrowth(state);

  const mark = (captureId: string, status: GrowthStatus) => {
    setState(markGrowthStatus(state, captureId, status));
  };

  return (
    <main className="mode-page growth-page">
      <section className="hero-panel growth-hero">
        <div>
          <h1>Improve</h1>
          <p>One small saved thing to try, then a calmer list of everything you collected for growth.</p>
          <div className="stats-strip">
            <span>{growth.length} growth saves</span>
            <span>{untried.length} never tried</span>
            <span>{growth.filter((item) => item.growthStatus === "tried").length} tried</span>
          </div>
        </div>
      </section>

      <section className="focus-card">
        <div>
          <span className="section-label">This week's focus</span>
          <h2>{focus?.title ?? "No growth focus yet"}</h2>
          <p>{focus?.note ?? "Save or mark a growth resource to get a small weekly action here."}</p>
          {focus ? (
            <div className="action-row">
              <Button onClick={() => mark(focus.id, "tried")}>Do this</Button>
              <Button variant="secondary" onClick={() => mark(focus.id, "skipped")}>Skip</Button>
              <Button variant="ghost" onClick={() => mark(focus.id, "not_relevant")}>Not relevant</Button>
            </div>
          ) : null}
        </div>
        <div className="streak-box">
          <strong>2</strong>
          <span>weeks showing up</span>
        </div>
      </section>

      <section className="board-section growth-list">
        <h2>Recently saved for growth</h2>
        <div className="stacked-list">
          {growth.map((capture) => (
            <div key={capture.id} className="growth-row">
              <CaptureCard capture={capture} />
              <div className="growth-actions">
                <Button variant="secondary" onClick={() => mark(capture.id, "tried")}>Tried</Button>
                <Button variant="ghost" onClick={() => mark(capture.id, "skipped")}>Skipped</Button>
                <Button variant="ghost" onClick={() => mark(capture.id, "not_relevant")}>Not relevant</Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="board-section">
        <h2>Never tried</h2>
        <div className="horizontal-strip">
          {untried.map((capture) => (
            <article key={capture.id} className="mini-card">
              <strong>{capture.title}</strong>
              <span>{capture.tags.join(", ")}</span>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
