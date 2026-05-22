import type { AppState } from "../types";

const now = "2026-05-22T16:00:00.000Z";

export const seedState: AppState = {
  activeMode: "project",
  activeProjectId: "p1",
  projects: [
    {
      id: "p1",
      name: "SaaS Dashboard Redesign",
      emoji: "▦",
      goal: "Collect UI references, pricing research, and implementation notes for a sharper analytics dashboard.",
      status: "active",
      createdAt: "2026-05-01T10:00:00.000Z",
      lastActiveAt: now
    },
    {
      id: "p2",
      name: "Morning Routine App",
      emoji: "☼",
      goal: "Prototype a simple wellness app for consistent morning routines.",
      status: "active",
      createdAt: "2026-05-10T10:00:00.000Z",
      lastActiveAt: "2026-05-21T11:00:00.000Z"
    }
  ],
  captures: [
    {
      id: "c1",
      title: "Linear command palette interaction",
      type: "screenshot",
      thumbnail: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=900&q=80",
      projectId: "p1",
      modeHints: ["project", "inspiration"],
      tags: ["ui", "interaction", "command"],
      note: "Fast keyboard-first flow for power users.",
      createdAt: "2026-05-18T12:00:00.000Z",
      lastOpenedAt: "2026-05-21T15:00:00.000Z",
      revisitCount: 4,
      pinned: true,
      archived: false
    },
    {
      id: "c2",
      title: "Stripe pricing page teardown",
      type: "link",
      sourceUrl: "https://stripe.com/pricing",
      projectId: "p1",
      modeHints: ["project", "research"],
      tags: ["pricing", "saas", "docs"],
      note: "Clear plan comparison and enterprise CTA.",
      createdAt: "2026-05-17T12:00:00.000Z",
      lastOpenedAt: "2026-05-21T16:00:00.000Z",
      revisitCount: 5,
      pinned: false,
      archived: false
    },
    {
      id: "c3",
      title: "Dashboard color palette reference",
      type: "screenshot",
      thumbnail: "https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=900&q=80",
      projectId: "p1",
      modeHints: ["project", "inspiration"],
      tags: ["branding", "color", "dashboard"],
      note: "Muted interface with bright status colors.",
      createdAt: "2026-05-16T12:00:00.000Z",
      revisitCount: 1,
      pinned: false,
      archived: false
    },
    {
      id: "c4",
      title: "5-minute morning stretching routine",
      type: "link",
      sourceUrl: "https://example.com/stretching",
      projectId: "p2",
      modeHints: ["growth"],
      tags: ["fitness", "routine", "health"],
      note: "Could become the first daily action.",
      createdAt: "2026-05-03T08:00:00.000Z",
      revisitCount: 0,
      pinned: false,
      archived: false,
      growthStatus: "untried"
    },
    {
      id: "c5",
      title: "Brutalist Copenhagen studio website",
      type: "screenshot",
      thumbnail: "https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=900&q=80",
      modeHints: ["inspiration"],
      tags: ["ui", "branding", "typography"],
      note: "Love the bold typography.",
      createdAt: "2026-03-20T12:00:00.000Z",
      revisitCount: 0,
      pinned: false,
      archived: false
    },
    {
      id: "c6",
      title: "Old onboarding teardown",
      type: "link",
      sourceUrl: "https://example.com/old-onboarding",
      modeHints: ["archive"],
      tags: ["onboarding"],
      createdAt: "2026-02-08T12:00:00.000Z",
      revisitCount: 0,
      pinned: false,
      archived: true
    }
  ],
  sessions: [
    {
      id: "s1",
      projectId: "p1",
      mode: "research",
      title: "Pricing page research",
      startedAt: "2026-05-20T13:00:00.000Z",
      endedAt: "2026-05-20T13:42:00.000Z",
      captureIds: ["c2"],
      summary: "Compared pricing structures and noted clear upgrade paths for the dashboard redesign.",
      keyPages: ["Stripe pricing page teardown"]
    }
  ],
  moodboards: [],
  voiceCommands: {
    wakePhrase: "Hey TASTE",
    saveThis: "save this",
    startSession: "start session",
    endSession: "end session",
    randomMemory: "random memory"
  }
};
