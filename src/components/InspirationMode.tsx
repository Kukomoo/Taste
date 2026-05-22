import { useState } from "react";
import { createMoodboard } from "../logic/actions";
import { inspirationCaptures, randomInspiration } from "../logic/selectors";
import type { AppState } from "../types";
import { Button } from "./ui";

const filters = ["all", "project", "ui", "branding", "illustration", "motion"];

export function InspirationMode({ state, setState }: { state: AppState; setState: (state: AppState) => void }) {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<string[]>([]);
  const captures = inspirationCaptures(state, filter);
  const random = randomInspiration(state);

  const toggleSelected = (id: string) => {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  const buildMoodboard = () => {
    setState(createMoodboard(state, selected, `Moodboard ${state.moodboards.length + 1}`));
    setSelected([]);
  };

  return (
    <main className="mode-page inspiration-page">
      <section className="hero-panel inspiration-hero">
        <div>
          <h1>Create</h1>
          <p>Your visual references, rediscovered when they can spark the next build.</p>
          <div className="stats-strip">
            <span>{captures.length} visible saves</span>
            <span>{state.moodboards.length} moodboards</span>
            <span>{selected.length} selected</span>
          </div>
        </div>
        <div className="random-tile">
          <span>Random inspiration</span>
          <strong>{random?.title ?? "Add visual saves to rediscover them."}</strong>
          <p>{random?.note}</p>
        </div>
      </section>

      <section className="gallery-toolbar">
        <div className="filter-row">
          {filters.map((item) => (
            <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>
              {item}
            </button>
          ))}
        </div>
        <Button disabled={selected.length === 0} onClick={buildMoodboard}>Create moodboard</Button>
      </section>

      <section className="masonry-grid" aria-label="Inspiration gallery">
        {captures.map((capture, index) => (
          <button
            key={capture.id}
            className={`inspiration-card ${selected.includes(capture.id) ? "selected" : ""} span-${(index % 3) + 1}`}
            onClick={() => toggleSelected(capture.id)}
          >
            {capture.thumbnail ? <img src={capture.thumbnail} alt="" /> : <div className="image-fallback" />}
            <span>{capture.title}</span>
            <small>{capture.tags.join(" / ")}</small>
          </button>
        ))}
      </section>

      <section className="board-section">
        <h2>Moodboards</h2>
        <div className="card-grid">
          {state.moodboards.length === 0 ? <p className="empty">Select a few visual saves to create the first moodboard.</p> : state.moodboards.map((board) => (
            <article key={board.id} className="session-card">
              <h3>{board.name}</h3>
              <p>{board.captureIds.length} selected references linked to the active project.</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
