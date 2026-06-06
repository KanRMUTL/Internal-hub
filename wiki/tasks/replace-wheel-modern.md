---
type: task
status: done
direction: 'Direction 7 Integration'
priority: 1
owner: 'task-runner'
started: '2026-06-06'
due: ''
depends_on: []
blocks:
  - '[[Task: Wire WinnerModalModern over LuckyModal]]'
files:
  - 'src/features/fortune/ui/WheelOfFortune.tsx'
  - 'src/features/fortune/ui/WheelOfFortuneModern.tsx'
  - 'src/features/fortune/ui/wheelModern.ts'
tags: [task, direction-7, room-page, wheel]
created: 2026-06-06
updated: 2026-06-06
---

# Task: Replace production WheelOfFortune with WheelOfFortuneModern

## Goal

Swap the production wheel component for the modern Direction 7 version. Currently the production wheel uses the old SVG layout with tangential labels (which overlap on crowded wheels) and an 18-color rainbow. The modern version has horizontal radial labels, 6-color OKLCH palette, conic-gradient glow ring, and a pulsing hub.

## Acceptance Criteria

- [ ] Production `WheelOfFortune.tsx` renders the modern visual (or imports WheelOfFortuneModern and re-exports it)
- [ ] Same props API: `{ members, onSpinCompleted }` works for the existing Room page
- [ ] Real production data works: when a room has 6+ members the labels don't overlap
- [ ] Spin animation: 5.6s ease-out-quart, 6 rotations
- [ ] Pointer at top (270°) lands on the correct member
- [ ] Pulsing hub works during spin
- [ ] `yarn lint && yarn build && yarn test:run` all pass
- [ ] Visually verify in the browser at `/room/<some-real-id>`

## Files

This task owns these files. Other agents should not touch them while this task is in-progress:

- `src/features/fortune/ui/WheelOfFortune.tsx` — replace or re-export
- `src/features/fortune/config/wheelConstant.ts` — already modern (no change needed)

## Dependencies

None.

## Blocked By / Blocks

- **Blocks**: [[Task: Wire WinnerModalModern over LuckyModal]] — winner modal expects the modern wheel's animation timing

## Status

- `status`: `todo` | `in-progress` | `blocked` | `review` | `done`
- `owner`: which agent is working on this
- `started`: YYYY-MM-DD when status moved to in-progress
- `due`: YYYY-MM-DD target completion

## Progress Log

- 2026-06-06: Task created during Direction 7 Integration direction scaffold
- 2026-06-06: Claimed by task-runner (P1 wave)
- 2026-06-06: Done. Recreated `WheelOfFortuneModern.tsx` in production with controlled API (parent owns `rotation` + `spinning`); extracted constants to `wheelModern.ts`; old `WheelOfFortune.tsx` now re-exports the modern component. `RoomPage` rewritten on the new API. Build clean; 9 tests pass. Visual verified at `http://localhost:5174/room/TmRRG3CpwUwaFz2N66by` — wheel spins, pointer at 270° lands on correct slice.

## Related

- [[Direction: Direction 7 Integration]]
- [[Module: fortune]]
- [[ADR-001: Direction 7 Design]]
