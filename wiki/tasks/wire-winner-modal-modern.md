---
type: task
status: done
direction: 'Direction 7 Integration'
priority: 1
owner: 'task-runner'
started: '2026-06-06'
due: ''
depends_on:
  - '[[Task: Replace WheelOfFortune with Modern Variant]]'
blocks: []
files:
  - 'src/pages/Room/ui/RoomPage.tsx'
  - 'src/features/fortune/ui/WinnerModalModern.tsx'
tags: [task, direction-7, room-page, winner-modal]
created: 2026-06-06
updated: 2026-06-06
---

# Task: Wire WinnerModalModern over LuckyModal

## Goal

Replace the production `LuckyModal` (post-spin winner dialog) with `WinnerModalModern`. The modern version has the avatar-as-focal-point layout, conic-gradient glow ring, spring check badge, and 3 ranked actions (Save / Discard / Spin Again) with keyboard shortcuts.

## Acceptance Criteria

- [ ] Production room page shows the modern winner modal after a spin completes
- [ ] Avatar is in the winner's hue color
- [ ] Conic-gradient glow ring animates behind the avatar
- [ ] Check badge springs in 400ms after the modal opens
- [ ] "Save to history" calls the real `createFortuneHistoryEntry` and persists to Firestore
- [ ] "Discard" closes the modal without writing
- [ ] "Spin again" closes the modal and re-spins after 80ms
- [ ] Keyboard: `⏎` saves, `S` re-spins, `Esc` discards
- [ ] `yarn lint && yarn build && yarn test:run` all pass
- [ ] Visually verify: spin → modal appears → save → history updates

## Files

- `src/features/fortune/ui/LuckyModal.tsx` — replace or re-export
- `src/pages/Room/ui/RoomPage.tsx` — update imports + state management

## Dependencies

- [[Task: Replace production WheelOfFortune with WheelOfFortuneModern]] — must be done first

## Blocked By / Blocks

- **Blocked by**: wheel replacement
- **Blocks**: nothing (downstream consumers can use either modal)

## Status

- `status`: `todo` | `in-progress` | `blocked` | `review` | `done`
- `owner`: which agent is working on this
- `started`: YYYY-MM-DD when status moved to in-progress
- `due`: YYYY-MM-DD target completion

## Progress Log

- 2026-06-06: Task created during Direction 7 Integration direction scaffold
- 2026-06-06: Claimed by task-runner (P1 wave)
- 2026-06-06: Done. `WinnerModalModern` is wired into `RoomPage` via `showWinner` state; `handleSave` calls `createFortuneHistoryEntry`; `handleSpinAgain` closes + re-spins after 80ms; kbd `⏎`/`S`/`Esc` all work. Visual verified — modal shows the avatar, conic glow, check badge, 3 actions. Old `LuckyModal` no longer imported by RoomPage.

## Related

- [[Direction: Direction 7 Integration]]
- [[Module: fortune]]
- [[Flow: Spin the Wheel]]
