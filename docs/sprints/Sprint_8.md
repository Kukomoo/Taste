# Sprint 8 - Browser Recording Pipeline Prototype

## Goal

Move Kukomo from simulated recording into a browser-native capture prototype using `getDisplayMedia`, `MediaRecorder`, and in-browser keyframe sampling.

## Scope

- Start a real screen/tab capture when the user explicitly clicks record.
- Stop recording and produce a local `webm` object URL.
- Sample keyframes from the local recording with a video element and canvas.
- Attach recording artifacts to the active cluster.
- Preserve simulated processing as a fallback when screen capture is unavailable or denied.
- Show permission and processing states in the assistant cockpit.

## Tests

- Artifact helper creates recording nodes with video, keyframe, audio, transcript, prompt, and summary information.
- Existing command simulation still works.
- Browser smoke verifies fallback command flow and visible real-capture controls.

## Exit Criteria

- The interface clearly offers a real browser recording path.
- A stopped browser recording can become a ready cluster with local video and keyframe nodes.
