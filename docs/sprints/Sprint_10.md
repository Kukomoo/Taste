# Sprint 10 - Command Palette and Keyboard Control

## Goal

Make Kukomo feel native to both voice and keyboard by adding a real command palette, compact command aliases, and a visible command history.

## Scope

- Add `Cmd+K` / `Ctrl+K` command palette.
- Support short typed aliases like `record youtube`, `record screen`, `stop`, `switch create`, `random`, and `save`.
- Record recent command history in app state.
- Show suggested commands and recent trail in the palette.
- Keep sidebar command simulator as the compact control surface.

## Tests

- Command parser recognizes aliases.
- Running commands appends command history.
- Command history is capped to recent entries.
- Browser smoke verifies opening the palette, running a command, and closing it.

## Exit Criteria

- User can operate Kukomo without clicking primary UI buttons.
- Voice-style and keyboard-style commands share the same command runner.
