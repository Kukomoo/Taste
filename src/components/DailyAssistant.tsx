import { FormEvent, useMemo, useState } from "react";
import { recallMemory, userUnderstandingProfile } from "../logic/selectors";
import type { AppState, RecallResult } from "../types";
import { Button } from "./ui";

const examplePrompts = [
  "remember that backend video I watched the other day",
  "what did I save about command palettes?",
  "pull up the dashboard style prompt",
  "show me what I captured about auth middleware"
];

export function DailyAssistant({ state }: { state: AppState }) {
  const [query, setQuery] = useState("remember that video i watched the other day about how to build the backend");
  const [results, setResults] = useState<RecallResult[]>(() => recallMemory(state, query));
  const profile = useMemo(() => userUnderstandingProfile(state), [state]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setResults(recallMemory(state, query));
  };

  return (
    <section className="daily-assistant">
      <div className="daily-copy">
        <span className="section-label">Daily flow</span>
        <h2>Ask Kukomo like you would ask a person with perfect recall.</h2>
        <p>
          No uploading, no explaining folders. Ask for the thing you half-remember and Kukomo searches the clusters,
          transcripts, OCR, prompts, screenshots, and project context it has already absorbed.
        </p>
        <div className="understanding-strip">
          <span>{profile.clusterCount} clusters learned</span>
          <span>{profile.captureCount} saves absorbed</span>
          <span>{profile.promptCount} reusable prompts</span>
        </div>
        <div className="interest-row">
          {profile.topInterests.map((interest) => (
            <span key={interest}>{interest}</span>
          ))}
        </div>
      </div>

      <div className="recall-panel">
        <form onSubmit={submit}>
          <label htmlFor="recall-input">Ask memory</label>
          <div className="recall-input-row">
            <input id="recall-input" value={query} onChange={(event) => setQuery(event.target.value)} />
            <Button type="submit">Recall</Button>
          </div>
        </form>
        <div className="example-row">
          {examplePrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => {
                setQuery(prompt);
                setResults(recallMemory(state, prompt));
              }}
            >
              {prompt}
            </button>
          ))}
        </div>
        <div className="recall-results">
          {results.length === 0 ? (
            <p>No match yet. Record or save more context, then ask again.</p>
          ) : (
            results.map((result) => (
              <article key={`${result.kind}-${result.id}`} className={`recall-card recall-${result.kind}`}>
                <span>{result.kind}</span>
                <strong>{result.title}</strong>
                <p>{result.reason}</p>
                <ul>
                  {result.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
