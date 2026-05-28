import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { runCommand } from "../logic/commands";
import type { AppState } from "../types";
import { Button } from "./ui";

const suggestions = [
  { label: "Record YouTube", command: "record youtube", detail: "Start a capture cluster for a YouTube or video reference." },
  { label: "Record screen", command: "record screen", detail: "Start recording the current screen flow." },
  { label: "Stop and process", command: "stop", detail: "Stop recording and generate source, keyframe, audio, transcript, OCR, prompt, and summary nodes." },
  { label: "Switch to Create", command: "switch create", detail: "Open Inspiration Mode." },
  { label: "Random memory", command: "random", detail: "Surface a project or inspiration memory." },
  { label: "Save current context", command: "save", detail: "Save into the current mode." }
];

export function CommandPalette({
  state,
  setState
}: {
  state: AppState;
  setState: (state: AppState) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("Type a command or pick one below.");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      window.setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const filtered = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    if (!normalized) return suggestions;
    return suggestions.filter((item) =>
      `${item.label} ${item.command} ${item.detail}`.toLowerCase().includes(normalized)
    );
  }, [query]);

  const execute = (command: string) => {
    const output = runCommand(state, command);
    setState(output.state);
    setResult(output.message);
    setQuery("");
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    execute(query.trim() || filtered[0]?.command || "random");
  };

  return (
    <>
      <button className="palette-trigger" onClick={() => setOpen(true)} aria-label="Open command palette">
        <span>Command</span>
        <kbd>⌘K</kbd>
      </button>
      {open ? (
        <div className="palette-backdrop" role="presentation" onMouseDown={() => setOpen(false)}>
          <section className="command-palette" role="dialog" aria-modal="true" aria-label="Kukomo command palette" onMouseDown={(event) => event.stopPropagation()}>
            <form onSubmit={submit}>
              <label htmlFor="palette-input">Ask Kukomo</label>
              <div className="palette-input-row">
                <input
                  id="palette-input"
                  ref={inputRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="record youtube, stop, switch create..."
                />
                <Button type="submit">Run</Button>
              </div>
            </form>
            <p className="palette-result">{result}</p>
            <div className="palette-grid">
              <div>
                <h2>Suggested commands</h2>
                <div className="palette-list">
                  {filtered.map((item) => (
                    <button key={item.command} onClick={() => execute(item.command)}>
                      <strong>{item.label}</strong>
                      <code>{item.command}</code>
                      <span>{item.detail}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h2>Recent trail</h2>
                <div className="history-list">
                  {(state.commandHistory ?? []).slice(0, 6).map((item) => (
                    <button key={item.id} onClick={() => execute(item.input)}>
                      <strong>{item.input}</strong>
                      <span>{item.message}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
