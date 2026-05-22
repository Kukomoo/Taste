import type { AppState } from "../types";
import { archivedCaptures } from "./selectors";

export function exportArchive(state: AppState) {
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      captures: archivedCaptures(state)
    },
    null,
    2
  );
}

export function exportAllData(state: AppState) {
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      state
    },
    null,
    2
  );
}
