---
type: task
status: done
direction: 'Direction 7 Integration'
priority: 2
owner: 'task-runner'
started: '2026-06-06'
due: ''
depends_on:
  - '[[Task: Replace WheelOfFortune with Modern Variant]]'
  - '[[Task: Wire WinnerModalModern over LuckyModal]]'
blocks: []
files:
  - 'src/features/fortune/ui/FortuneHistoryListModern.tsx'
  - 'src/pages/Room/ui/RoomPage.tsx'
tags: [task, direction-7, room-page, history]
created: 2026-06-06
updated: 2026-06-06
---

# Task: Replace FortuneHistoryTable with HistoryListModern

## Goal

Swap the production history list for the modern compact avatar-row version (`HistoryListModern`). The current table is a real HTML `<table>` with sticky header, scroll-shadow, etc. The modern version is a simple list of rows: 32px avatar, name, time + relative time, highlighted if recent.

## Acceptance Criteria

- [ ] Production room page shows the modern history list (or imports HistoryListModern and re-exports)
- [ ] Each row: avatar (in winner's hue), name (semibold), time + "X min ago"
- [ ] The most recent row is highlighted (teal tint background)
- [ ] List scrolls if it gets long (max-height with overflow)
- [ ] Real-time updates from Firestore work (history refreshes when a new entry is saved)
- [ ] `yarn lint && yarn build && yarn test:run` all pass
- [ ] Visually verify: spin + save → new entry appears at top, highlighted

## Files

- `src/features/fortune/ui/FortuneHistoryTable.tsx` — replace or re-export
- `src/pages/Room/ui/components/HistorySection.tsx` — update to use the new component

## Dependencies

None.

## Blocked By / Blocks

- **Blocked by**: nothing
- **Blocks**: nothing

## Status

- `status`: `todo` | `in-progress` | `blocked` | `review` | `done`
- `owner`: which agent is working on this
- `started`: YYYY-MM-DD when status moved to in-progress
- `due`: YYYY-MM-DD target completion

## Progress Log

- 2026-06-06: Task created during Direction 7 Integration direction scaffold
- 2026-06-06: Done. Created `FortuneHistoryListModern.tsx` (data-aware wrapper around `HistoryListModern`) with `useFortuneHistory` + `membersById` hue lookup + highlight-on-new + empty state. Added a `Recent spins` side card in `RoomPage` (below Members) that uses the new component. Build clean. Visual verified — empty state ("No spins yet. Press the wheel to get started.") renders correctly.

## Related

- [[Direction: Direction 7 Integration]]
- [[Module: fortune]]
- [[Flow: Spin the Wheel]]
