# TASTE - Intent-Aware Memory MVP PRD

**Version:** 0.1  
**Date:** May 22, 2026  
**Author:** Nada Khas  
**Status:** Draft  
**Scope:** Project Mode primary MVP with Growth, Research, Inspiration, and Archive thin slices

## 1. Purpose

TASTE helps builders and knowledge workers reuse what they save. Instead of acting like another bookmark folder, TASTE packages captured links, screenshots, sessions, and notes around what the user is trying to do.

The first MVP focuses on **Project Mode for builders** while making all five modes visible and useful:

1. **Project Mode - Build:** organize captures around active projects.
2. **Growth Mode - Improve:** resurface saved self-improvement content as small actions.
3. **Research Mode - Understand:** turn browsing sessions into summaries and learning trails.
4. **Inspiration Mode - Create:** browse visual references and rediscover forgotten ideas.
5. **Archive Mode - Keep:** store low-priority saves without cluttering active work.

## 2. Target Users

Primary users are indie builders, founders, product engineers, designers, and product-minded creators who collect many references while building but struggle to turn them into action.

They currently use browser bookmarks, screenshots, Notion pages, DMs, folders, and memory. TASTE should feel more useful because it makes the saved material show up in the right work context.

## 3. Product Principles

- **Use beats storage:** the key metric is whether saves are reused.
- **Intent first:** mode and project context matter more than raw file type.
- **Low friction capture:** saving should feel instant.
- **Visible value quickly:** a new user should see organized saves on day one.
- **Plain language:** use words like project, save, session, board, focus, and archive.
- **Privacy by default:** screen or tab capture requires explicit user action.

## 4. Modes

### 4.1 Project Mode - Build

**Question:** What do I need right now to move this project forward?

MVP capabilities:

- Create, rename, archive, and delete projects.
- Set one active project.
- Save links and screenshots to the active project.
- Start and end project research sessions.
- View project board sections: Highlights, Visuals, Documents and Links, Sessions.
- Generate a weekly project digest preview.
- Surface a random memory from the active project.

Visual signature:

- Electric blue accent.
- Board-style layout.
- Dense but calm workspace surface.
- Cards emphasize hierarchy, project progress, and quick reuse.

### 4.2 Growth Mode - Improve

**Question:** What is one small thing I could do this week to grow?

MVP capabilities:

- Detect or manually mark growth-related saves.
- Show a weekly focus action.
- Show recently saved growth content.
- Show never-tried resources.
- Let the user mark items as tried, skipped, or not relevant.

Visual signature:

- Fresh green accent.
- Coaching-feed layout with stacked cards and a light timeline.
- One large focus card at the top.
- Calm progress indicators, no shame-based language.

### 4.3 Research Mode - Understand

**Question:** How did I get to this understanding, and what should I learn next?

MVP capabilities:

- List research sessions across projects.
- Show key pages, duration, and summary.
- Link each session back to its project.
- Suggest a next deep dive from repeated topics.

Visual signature:

- Deep violet accent.
- Timeline plus map-like session cards.
- More structured and text-forward than Inspiration Mode.

### 4.4 Inspiration Mode - Create

**Question:** What have I seen before that could spark something new right now?

MVP capabilities:

- Visual grid of screenshots, visual pages, and inspiration saves.
- Filter by all, project, UI, branding, illustration, and motion.
- Random inspiration from older visual saves.
- Create a simple moodboard from selected inspiration cards.

Visual signature:

- Warm orange or magenta accent.
- Masonry-style gallery.
- Minimal chrome around images.
- Playful rediscovery surface.

### 4.5 Archive Mode - Keep

**Question:** What can I keep without having it in my face all the time?

MVP capabilities:

- Archive or unarchive captures.
- Review archived captures in a compact list.
- Export archive data as JSON.
- Show a basic cleanup suggestion for unused archived items.

Visual signature:

- Muted grey-blue accent.
- Compact list layout.
- Low-attention design that keeps clutter out of active modes.

## 5. Core User Flows

### 5.1 Onboarding

1. User selects the main reason they are using TASTE: Build, Improve, Understand, Create, or Keep.
2. If they choose Build, they create their first project.
3. TASTE sets the selected mode and active project.
4. TASTE shows the capture paths: save link, add screenshot, start session.
5. User creates at least one capture and sees it on the relevant mode view.

### 5.2 Save to Project

1. User has an active project.
2. User clicks Save Link or Save Screenshot.
3. Capture is created with title, type, source, timestamp, project, and tags.
4. UI confirms the save and offers undo or edit.

### 5.3 Project Research Session

1. User starts a session from Project or Research Mode.
2. TASTE records a time-bounded session object.
3. User adds captures during the session.
4. User ends the session.
5. TASTE creates a session summary and shows it in the project board and Research Mode.

### 5.4 Growth Weekly Focus

1. User has growth-related saves.
2. Growth Mode selects one doable item.
3. User marks it as tried, skipped, or not relevant.
4. Future suggestions use that feedback.

### 5.5 Inspiration Moodboard

1. User opens Inspiration Mode.
2. User selects visual captures.
3. User creates a moodboard.
4. Moodboard appears in Inspiration Mode and, when project-linked, Project Mode.

## 6. Functional Requirements

### 6.1 Shared Capture Layer

- User can create captures with title, source, type, project, tags, mode flags, and notes.
- User can pin captures to Highlights.
- User can archive captures.
- User can mark captures as growth-related or inspiration-related.
- User can revisit captures and update last-opened metadata.

### 6.2 Modes and Navigation

- User can switch between Build, Improve, Understand, Create, and Keep.
- Active mode has a clear visual accent and primary action.
- Each mode uses the same data but curates it differently.

### 6.3 Project Management

- User can create and switch projects.
- User can set an active project.
- Captures can be reassigned to another project.
- Project board shows stats, captures, sessions, highlights, and digest.

### 6.4 Sessions

- User can start and end sessions.
- Session tracks project, mode, start time, end time, captures, and summary.
- Research Mode can show sessions across projects.

### 6.5 Voice Command Prototype

The MVP should include a UI-ready command model even if browser voice input is stubbed at first.

Supported command intents:

- Save this.
- Grab screenshot.
- Start session.
- End session.
- Switch to mode.
- Switch to project.
- Random memory.

### 6.6 Export

- User can export all data as JSON.
- Archive Mode can export archived captures only.

## 7. Non-Functional Requirements

- Save feedback should appear in under 500 ms in the prototype.
- UI should work on desktop and mobile widths.
- Data should persist locally for the prototype.
- No capture should imply hidden recording.
- The app should be usable without reading documentation.
- Tests should cover core state helpers and smoke-test rendering.

## 8. Success Metrics

- 60% of new users create a project and one capture on day one.
- 50% of captures are attached to a project.
- 30% of project captures are reopened within 14 days.
- 30% of active users use Random Memory weekly.
- Growth Mode users mark at least one item tried, skipped, or not relevant in week one.
- Users describe TASTE as helping them use saved material, not merely store it.

## 9. Glossary

- **Capture:** A saved item such as a link, screenshot, note, clip, or document.
- **Mode:** A purpose-based view of memory, such as Build or Improve.
- **Active Mode:** The mode currently shaping capture defaults and UI.
- **Project:** A workspace for something the user is building.
- **Active Project:** The project new Build captures default into.
- **Session:** A timed research or work period that groups related activity.
- **Cluster:** A logical group of related captures.
- **Digest:** A short summary of useful saves and activity.
- **Moodboard:** A visual board made from selected inspiration captures.
- **Metadata:** Extra information stored about a capture, such as URL, title, tags, and timestamps.
- **OCR:** Optical character recognition, a way to extract text from images.
- **Embedding:** A numeric representation of content used for similarity search.
- **Spaced Repetition:** A reminder method that resurfaces information at increasing intervals.
- **MV3:** Manifest V3, the current Chrome extension architecture.
