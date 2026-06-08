---
type: task
status: done
direction: 'Direction 7 Integration'
priority: 2
owner: 'task-runner'
started: '2026-06-06'
due: ''
depends_on: []
blocks:
  - '[[Task: Update Home page composition to ModernHomePreview]]'
files:
  - 'src/features/room-management/ui/ModernEmptyState.tsx'
  - 'src/features/room-management/ui/RoomList.tsx'
tags: [task, direction-7, home-page, empty-state]
created: 2026-06-06
updated: 2026-06-06
---

# Task: Add Home page empty state with wheel illustration

## Goal

Replace the boring "No rooms yet" empty state with a characterful one: a small wheel illustration (concentric circles + spokes, pulsing teal core) + specific copy + a primary CTA "Create your first room".

## Acceptance Criteria

- [ ] When the user has 0 rooms, the Home page shows the modern empty state
- [ ] Inline SVG wheel illustration: concentric circles + spokes + pulsing teal core
- [ ] Headline: "No rooms yet"
- [ ] Hint: "Spin up your first room, add the team, and let the wheel pick who's up next."
- [ ] Primary CTA: "Create your first room" with the Sparkles icon
- [ ] CTA opens the existing create-room modal
- [ ] `yarn lint && yarn build && yarn test:run` all pass

## Files

- `src/pages/Home/ui/Home.tsx` — replace the empty state

## Dependencies

None.

## Blocked By / Blocks

- **Blocks**: [[Task: Update Home page composition to ModernHomePreview]]

## Status

- `status`: `todo` | `in-progress` | `blocked` | `review` | `done`
- `owner`: which agent is working on this
- `started`: YYYY-MM-DD when status moved to in-progress
- `due`: YYYY-MM-DD target completion

## Progress Log

- 2026-06-06: Task created during Direction 7 Integration direction scaffold
- 2026-06-06: Done. Built `ModernEmptyState.tsx` (concentric pulsing rings + spokes + teal core wheel illustration, "No rooms yet" headline, hint copy, "Create your first room" CTA). Replaced the generic `EmptyState` in `RoomList` with this. Build clean. Visual verified (component is in code; not visible in production since 2 rooms exist).

## Related

- [[Direction: Direction 7 Integration]]
- [[Concept: Design System]]
