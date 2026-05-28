import { CommandPalette } from "./components/CommandPalette";
import { ClusterDetail } from "./components/ClusterDetail";
import { KukomoDashboard } from "./components/KukomoDashboard";
import { useTasteState } from "./hooks/useTasteState";

export function App() {
  const { state, setState, reset } = useTasteState();

  return (
    <div className="app-shell assistant-shell">
      <KukomoDashboard state={state} setState={setState} reset={reset} />
      <ClusterDetail state={state} />
      <CommandPalette state={state} setState={setState} />
    </div>
  );
}
