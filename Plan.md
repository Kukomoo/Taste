# TASTE - Sprint Plan

**Version:** 0.1  
**Date:** May 22, 2026  
**Author:** Nada Khas  
**Status:** Active

## Sprint 0 - Product and Technical Foundation

Deliverables:

- `PRD.md`
- `Tech_Specification.md`
- `UI_UX.md`
- `Plan.md`
- sprint briefs for Sprints 1-5
- repository initialized

Exit criteria:

- Docs explain what to build, how to build it, and how to test it.
- Sprint 1 has a clear implementation target.

## Sprint 1 - App Foundation and Project Mode

Goal: Build the usable app shell and Project Mode thin slice.

Deliverables:

- React + Vite + TypeScript app.
- Five-mode navigation.
- Project creation and switching.
- Save link/screenshot prototype into active project.
- Project board sections and digest preview.
- Local persistence.
- Unit tests for project selectors and state actions.

## Sprint 2 - Growth Mode

Goal: Make Growth Mode feel real and visually distinct.

Deliverables:

- Growth focus card.
- Recently saved and never-tried sections.
- Tried, skipped, and not relevant actions.
- Growth ranking helper.
- Tests for growth curation.

## Sprint 3 - Inspiration Mode

Goal: Add visual-first inspiration browsing and moodboards.

Deliverables:

- Masonry-style visual gallery.
- Inspiration filters.
- Random inspiration.
- Moodboard creation from selected captures.
- Tests for random memory and moodboard actions.

## Sprint 4 - Research and Archive Modes

Goal: Add session-centric research and quiet archive management.

Deliverables:

- Start and end session flow.
- Research timeline across projects.
- Session summary cards.
- Archive toggle, review list, cleanup suggestion, archive export.
- Tests for session and archive helpers.

## Sprint 5 - Voice Model, Polish, QA, and Final Hardening

Goal: Complete the prototype with mode-aware commands, responsive polish, and full verification.

Deliverables:

- Voice command settings and command simulator.
- Mode-aware command routing.
- Export all data.
- Responsive UI pass.
- Full test run and browser verification.
- Final commit.

## Sprint 6 - Real Capture Inputs and Onboarding Polish

Goal: Make the prototype usable with user-entered project and capture data.

Deliverables:

- Lightweight onboarding/status strip.
- Project creation form.
- Capture creation form with title, URL, note, tags, and type.
- Tests for form-backed action behavior.
- Full test run and browser verification.

## Sprint 7 - Kukomo Command Assistant Experience

Goal: Reframe the product around voice and keyboard commands that record triggered moments into clustered memory.

Deliverables:

- Memory cluster and node data model.
- Record and stop commands.
- Simulated extraction into source, keyframe, audio, transcript, prompt, and summary nodes.
- Command-first assistant cockpit.
- Browser smoke test for record/stop flow.

## Sprint 8 - Browser Recording Pipeline Prototype

Goal: Add a real browser-native capture path behind the Kukomo recording experience.

Deliverables:

- `getDisplayMedia` recording flow.
- `MediaRecorder` stop-to-WebM artifact.
- Canvas-based keyframe sampling from recorded video.
- Cluster artifact attachment.
- Permission and fallback states.
- Tests and browser smoke.
