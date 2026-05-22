import { useEffect, useState } from "react";
import { seedState } from "../data/seed";
import type { AppState } from "../types";

const STORAGE_KEY = "taste.mvp.state";

function loadState(): AppState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as AppState) : seedState;
  } catch {
    return seedState;
  }
}

export function useTasteState() {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const reset = () => setState(seedState);

  return { state, setState, reset };
}
