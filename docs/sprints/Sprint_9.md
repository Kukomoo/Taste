# Sprint 9 - Persistent Recording Artifacts

## Goal

Keep real browser recordings usable after refresh by storing WebM blobs in IndexedDB and referencing them from cluster nodes with stable artifact ids.

## Scope

- Add IndexedDB storage for recorded WebM blobs.
- Save recordings after `MediaRecorder` stops.
- Store stable `artifact://...` references in cluster nodes.
- Restore persistent artifacts into playable local object URLs.
- Preserve blob URL fallback for current-session recordings.

## Tests

- Persistent artifact node metadata uses `artifact://...`.
- Artifact nodes are tagged as IndexedDB-backed.
- Existing command, recording, build, and smoke tests still pass.

## Exit Criteria

- Recording clusters no longer rely only on temporary `blob:` URLs.
- The UI can distinguish local session video artifacts from persistent IndexedDB artifacts.
