# TASTE - UI/UX Specification

**Version:** 0.1  
**Date:** May 22, 2026  
**Author:** Nada Khas  
**Status:** Draft

## 1. Experience Goal

TASTE should feel like a working memory cockpit, not a content warehouse. The first screen is the actual app: modes, captures, sessions, project boards, nudges, and rediscovery.

## 2. Navigation

Use a persistent mode rail or top bar with five plain-language labels:

- Build
- Improve
- Understand
- Create
- Keep

Each mode changes:

- accent color
- primary action
- layout density
- card shape and content emphasis

## 3. Mode Visual Signatures

### Build

- Accent: electric blue
- Layout: project board
- Primary action: Save to project
- Secondary action: Start session
- Content style: structured cards and project stats

### Improve

- Accent: fresh green
- Layout: coaching feed
- Primary action: Do this
- Secondary action: Mark not relevant
- Content style: one focus card plus stacked resources

### Understand

- Accent: violet
- Layout: timeline
- Primary action: Start research session
- Secondary action: Open summary
- Content style: session cards and key-page lists

### Create

- Accent: magenta-orange
- Layout: masonry visual grid
- Primary action: Random inspiration
- Secondary action: Create moodboard
- Content style: image-forward cards with minimal chrome

### Keep

- Accent: muted blue-grey
- Layout: compact list
- Primary action: Export archive
- Secondary action: Review unused
- Content style: quiet rows and metadata

## 4. Core Screens

### Onboarding

The prototype may seed data, but production onboarding asks:

1. What are you using TASTE for right now?
2. What are you building or improving?
3. Do you want to enable voice commands?

### Project Board

Required regions:

- Project header with active project selector.
- Quick stats.
- Capture controls.
- Highlights.
- Visuals.
- Documents and Links.
- Sessions.
- Weekly digest panel.

### Growth Panel

Required regions:

- This Week's Focus card.
- Recently saved for growth.
- Never tried row.
- Gentle progress indicator.

### Research Timeline

Required regions:

- Session list.
- Session detail summary.
- Key pages.
- Suggested next deep dive.

### Inspiration Gallery

Required regions:

- Filter chips.
- Visual grid.
- Random inspiration tile.
- Moodboard builder.

### Archive Review

Required regions:

- Archive stats.
- Cleanup suggestion.
- Compact archive list.
- Export control.

## 5. Interaction Rules

- Every primary button must change visible state.
- Save actions should show immediate confirmation.
- Filters should keep the current mode context.
- Cards should have stable dimensions so content does not jump.
- Mobile should collapse into one-column mode views without hiding primary actions.
- No instructional marketing panels inside the app.

## 6. Accessibility

- Buttons and controls need readable labels.
- Color cannot be the only state indicator.
- Focus states should be visible.
- Text should not overlap or truncate critical information.
- Motion should respect reduced-motion settings.

## 7. Glossary

- **Mode rail:** A navigation area that switches between purpose-based views.
- **Primary action:** The most important action for the current mode.
- **Masonry grid:** A visual grid where cards can have varied heights.
- **Chrome:** The controls and frame around the content, not the browser itself.
