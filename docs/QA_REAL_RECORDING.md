# Kukomo Real Recording QA

Use this checklist in a normal browser window, not headless automation.

## Permission Happy Path

1. Run `npm run dev -- --host 127.0.0.1`.
2. Open `http://127.0.0.1:5173/`.
3. Click `Record YouTube` or `Record now`.
4. Approve the browser screen/tab capture prompt.
5. Record at least 5 seconds.
6. Click `Stop and process`.
7. Confirm the latest cluster includes:
   - Source context
   - Persistent video artifact
   - Sampled keyframes
   - Audio layer
   - Transcript
   - Keyframe OCR
   - Reverse-engineered style prompt
   - Summary
8. Refresh the page.
9. Confirm the persistent artifact node attempts to restore from IndexedDB.

## Permission Denied Path

1. Click `Record now`.
2. Deny screen capture permission.
3. Confirm Kukomo shows a fallback status.
4. Click `Stop and process`.
5. Confirm simulated cluster nodes are generated without crashing.

## Edge Cases

- Start and stop in under 2 seconds.
- Record without tab audio.
- Record a tab with fast visual changes.
- Use `Cmd+K` / `Ctrl+K` and run `record youtube`, then `stop`.
