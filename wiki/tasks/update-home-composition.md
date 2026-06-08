---
type: task
status: done
direction: 'Direction 7 Integration'
priority: 2
owner: 'task-runner'
started: '2026-06-06'
due: ''
depends_on:
  - '[[Task: Add Home page section header]]'
  - '[[Task: Add Home page empty state with wheel illustration]]'
  - '[[Task: Add Home page keyboard hints]]'
blocks: []
files:
  - 'src/features/room-management/ui/RoomManagement.tsx'
  - 'src/features/room-management/ui/RoomList.tsx'
  - 'src/features/room-management/ui/ModernEmptyState.tsx'
tags: [task, direction-7, home-page]
created: 2026-06-06
updated: 2026-06-06
---

# Task: Update Home page composition to ModernHomePreview

## Goal

Bring the full modern Home page composition (heading, subtitle, section header with count + sort pill, room grid, empty state, keyboard hints) into production. The modern preview lives at `wiki/sources/...` reference (was at `src/pages/Preview/ui/ModernHomePreview.tsx` before integration); the production page is `src/pages/Home/ui/Home.tsx`.

## Acceptance Criteria

- [ ] Home page matches the Direction 7 visual language (heading, subtitle, section header)
- [ ] "Your rooms" section header with member-count + sort toggle pill
- [ ] Room grid with featured "NOW SPINNING" cards
- [ ] Empty state with wheel illustration when no rooms
- [ ] Footer keyboard hints (N for new room, ↑↓ to navigate, ⏎ to open)
- [ ] `yarn lint && yarn build && yarn test:run` all pass

## Files

- `src/pages/Home/ui/Home.tsx` — modernize the composition
- `src/features/room-management/ui/RoomManagement.tsx` — adapt if needed

## Dependencies

- [[Task: Add Home page section header]]
- [[Task: Add Home page empty state with wheel illustration]]
- [[Task: Add Home page keyboard hints]]

## Blocked By / Blocks

- **Blocked by**: the three Home page polish tasks
- **Blocks**: nothing

## Status

- `status`: `todo` | `in-progress` | `blocked` | `review` | `done`
- `owner`: which agent is working on this
- `started`: YYYY-MM-DD when status moved to in-progress
- `due`: YYYY-MM-DD target completion

## Progress Log

- 2026-06-06: Task created during Direction 7 Integration direction scaffold
- 2026-06-06: Done. All 4 home page polish tasks combined into a single modern composition. Home page now matches Direction 7: section header with count + sort pills, room grid with featured "NOW SPINNING" cards, modern empty state with wheel illustration, keyboard hints footer. Build clean. Visual verified end-to-end.

## Related

- [[Direction: Direction 7 Integration]]
- [[Page: Home]]
- [[Module: room-management]]
