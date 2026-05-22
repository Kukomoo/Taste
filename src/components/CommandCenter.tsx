import { useState } from "react";
import { runCommand } from "../logic/commands";
import type { AppState } from "../types";
import { Button } from "./ui";

export function CommandCenter({ state, setState }: { state: AppState; setState: (state: AppState) => void }) {
  const [command, setCommand] = useState("Hey Kukomo, start recording this YouTube video now");
  const [result, setResult] = useState("Voice and keyboard command simulator ready.");

  const submit = () => {
    const output = runCommand(state, command);
    setState(output.state);
    setResult(output.exportText ? `${output.message} ${Math.round(output.exportText.length / 1024)} KB copied-ready JSON.` : output.message);
  };

  return (
    <section className="command-center">
      <label htmlFor="command-input">Voice / keyboard command</label>
      <div className="command-row">
        <input id="command-input" value={command} onChange={(event) => setCommand(event.target.value)} />
        <Button variant="secondary" onClick={submit}>Run</Button>
      </div>
      <p>{result}</p>
      <div className="command-examples">
        <button onClick={() => setCommand("Hey Kukomo, start recording this YouTube video now")}>YouTube</button>
        <button onClick={() => setCommand("Record now")}>Record</button>
        <button onClick={() => setCommand("Stop and break it down")}>Stop</button>
        <button onClick={() => setCommand("Hey Kukomo, random memory")}>Random</button>
      </div>
    </section>
  );
}
