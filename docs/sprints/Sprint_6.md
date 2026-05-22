# Sprint 6 - Real Capture Inputs and Onboarding Polish

## Goal

Turn the prototype from seeded-button interactions into a more usable MVP surface where users can enter their own project and capture details.

## Scope

- Add a lightweight onboarding/status strip.
- Replace fixed Project Mode save buttons with form-backed capture creation.
- Add form-backed project creation.
- Preserve quick demo defaults for screenshots.
- Validate empty capture/project names with conservative fallbacks.
- Keep local persistence and existing mode behavior.

## Tests

- Creating a project from user input sets it active.
- Creating captures from user input stores title, URL, note, tags, and mode hints.
- Empty form values fall back safely.
- Existing mode tests still pass.

## Exit Criteria

- User can create a named project and save named captures without editing code or relying on hardcoded demo labels.
