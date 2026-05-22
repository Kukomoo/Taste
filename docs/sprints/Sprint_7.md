# Sprint 7 - Kukomo Command Assistant Experience

## Goal

Reframe the prototype around Kukomo as a voice-first and keyboard-first assistant that records triggered moments and turns them into clustered memory.

## Scope

- Add memory clusters and extracted node types.
- Add start/stop recording commands.
- Simulate processing into source, keyframe, audio, transcript, prompt, and summary nodes.
- Add a command-first assistant cockpit.
- Update the command simulator for Kukomo voice and keyboard flows.
- Make the interface communicate that recording only starts after explicit user trigger.

## Tests

- Recording command starts an active cluster.
- Stop command processes the cluster.
- Processed cluster contains individual extracted nodes.
- Browser smoke verifies record/stop and command simulator flows.

## Exit Criteria

- The first screen communicates Kukomo as a cool command assistant, not only a project dashboard.
- User can trigger recording by button or command and see a processed cluster with individual nodes.
