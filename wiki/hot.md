---
type: meta
title: 'Hot Cache'
updated: 2026-06-06T04:15:00
---

# Recent Context

## Last Updated

2026-06-06. Wiki scaffolded. Task-tracking system added.

## Key Recent Facts

- `internal-hub` is a React 19 + TypeScript + Vite SPA on Firebase, deployed to `internal-hub-1b94e`
- The modern Direction 7 design system is the production theme (OKLCH palette, restrained teal-led neutrals)
- Modern `RoomItem` is in production; wheel palette is the 6-color modern system
- Two active **directions** for multi-agent coordination: [[Direction: Direction 7 Integration]] and [[Direction: Wiki Documentation]]
- All 15 task slots are currently `todo` / `unassigned` — see [[Tasks Index]] for the full list

## Recent Changes

- **Created**: `wiki/directions/` + `wiki/tasks/` with 15 task pages across 2 directions
- **Created**: `_templates/task.md` + `_templates/direction.md`
- **Created**: `wiki/tasks/_index.md` + `wiki/directions/_index.md` (master lists)
- **Updated**: `wiki/_index.md` (now references tasks + directions)
- **Updated**: `wiki/CLAUDE.md` (task conventions documented)

## Active Threads

- **Direction 7 Integration** (`owner: unassigned`): 10 task slots, ~35% shipped. Most impactful next picks: [[Task: Replace production WheelOfFortune with WheelOfFortuneModern]] (P1) or [[Task: Wire WinnerModalModern over LuckyModal]] (P1)
- **Wiki Documentation** (`owner: unassigned`): 5 task slots. Easiest wins: [[Task: Ingest PRODUCT.md as a wiki source]] (P1) or [[Task: Ingest AGENTS.md as a wiki source]] (P1)
- **Open UX question**: where does "Remove Room" live (post-Design-7 removal). Tracked by [[Task: Add "..." menu for remove room]]

## Currently In-Progress (live)

All 15 tasks across both directions are `done`:

- **Direction 7 Integration** (10/10) — wheel, winner modal, member management modal, history list, home page polish (header/sort/empty state/keyboard hints), Layout widget, "..." menu for remove room.
- **Wiki Documentation** (5/5) — PRODUCT.md + AGENTS.md ingested; 8 component pages, 7 dependency pages, 4 flow pages.

Post-ship polish pending: wheel label clipping at 12 o'clock for 11+ members; persist the active/inactive toggle to Firestore; delete the now-unused `MembersModal` and old `FortuneHistoryTable` (already done in this branch).

Next: commit on `feature/direction-7-integration`, open a PR.

## Recent Decisions

- [[ADR-001: Direction 7 Design]] — modern × minimal × playful is the chosen design language
- [[ADR-002: FSD Architecture]] — feature-sliced design is the project structure convention
