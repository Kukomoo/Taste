# TASTE - Technical Specification

**Version:** 0.1  
**Date:** May 22, 2026  
**Author:** Nada Khas  
**Status:** Draft

## 1. MVP Architecture

The prototype is a browser-first React app with local persistence. It models the future extension and backend architecture while staying easy to run and test.

Production target:

- Web app: Next.js or React.
- Extension: Plasmo with Manifest V3.
- Auth and database: Supabase.
- Object storage: Cloudflare R2 or Supabase Storage.
- OCR: Tesseract.js client-side.
- Transcription: Workers AI or hosted speech model.
- AI summaries: hosted LLM.
- Embeddings: open-source embedding model with vector search.

Prototype implementation:

- React + Vite + TypeScript.
- Local state with localStorage.
- Deterministic sample data.
- Pure helper functions for ranking, grouping, export, and session state.
- Vitest for unit tests.

## 2. Data Model

### Project

- `id`: string
- `name`: string
- `emoji`: string
- `goal`: string
- `status`: active, paused, archived
- `createdAt`: ISO datetime
- `lastActiveAt`: ISO datetime

### Capture

- `id`: string
- `title`: string
- `type`: link, screenshot, clip, note, voice, file
- `sourceUrl`: string optional
- `thumbnail`: string optional
- `projectId`: string optional
- `modeHints`: array of project, growth, research, inspiration, archive
- `tags`: string array
- `note`: string optional
- `createdAt`: ISO datetime
- `lastOpenedAt`: ISO datetime optional
- `revisitCount`: number
- `pinned`: boolean
- `archived`: boolean
- `growthStatus`: untried, tried, skipped, not_relevant optional

### Session

- `id`: string
- `projectId`: string optional
- `mode`: project or research
- `title`: string
- `startedAt`: ISO datetime
- `endedAt`: ISO datetime optional
- `captureIds`: string array
- `summary`: string
- `keyPages`: string array

### Moodboard

- `id`: string
- `name`: string
- `projectId`: string optional
- `captureIds`: string array
- `createdAt`: ISO datetime

### AppState

- `activeMode`
- `activeProjectId`
- `projects`
- `captures`
- `sessions`
- `moodboards`
- `currentSessionId`
- `voiceCommands`

## 3. Core Modules

- `data/seed.ts`: starter data for demo and tests.
- `state/store.ts`: state creation, persistence, and actions.
- `logic/selectors.ts`: derived data for mode views.
- `logic/ranking.ts`: growth focus, random memory, digest selection.
- `logic/export.ts`: JSON export helpers.
- `components/AppShell.tsx`: global navigation and layout.
- `components/modes/*`: mode-specific screens.
- `components/ui/*`: reusable controls and cards.

## 4. Algorithms

### Project Digest Ranking

Rank project captures by:

1. pinned items
2. revisit count
3. recent activity
4. session membership

The MVP does not need AI. It should produce clear digest copy from structured data.

### Growth Focus Ranking

Pick unarchived growth captures where:

- `growthStatus` is empty or `untried`
- item is older than 3 days when possible
- item has growth tags such as fitness, routine, money, focus, health, journal, or learning

### Inspiration Random Memory

Pick visual, unarchived inspiration captures:

- prefer older items
- prefer low revisit count
- include a small amount of randomness

### Archive Cleanup

Suggest review for archived captures that:

- have zero revisits
- are older than 30 days

## 5. Browser Capture Plan

The prototype uses manual forms/buttons. The production extension will use:

- Chrome Tabs API for current page metadata.
- `chrome.scripting` where permitted for page title and selection.
- `navigator.mediaDevices.getDisplayMedia()` for screen capture with user permission.
- `MediaRecorder` for short clips.
- Web Speech API for voice command detection where available.

## 6. Testing Plan

- Unit tests for selectors, ranking, export, and reducer-style actions.
- Build check with TypeScript.
- Browser smoke verification through local dev server.
- Manual flow test:
  1. create project
  2. save capture
  3. start/end session
  4. mark growth item tried
  5. create moodboard
  6. archive/export item

## 7. Glossary

- **Reducer:** A function that turns current state plus an action into next state.
- **Selector:** A function that computes view data from stored state.
- **LocalStorage:** Browser storage that persists small app data on one device.
- **Manifest V3:** Chrome's extension platform standard.
- **Vector Search:** Search using semantic similarity instead of exact keywords.
