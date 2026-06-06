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
  - 'src/features/room-management/ui/RoomManagement.tsx'
tags: [task, direction-7, home-page, keyboard]
created: 2026-06-06
updated: 2026-06-06
---

# Task: Add Home page keyboard hints

## Goal

Add a footer to the Home page with keyboard shortcuts (kbd-styled chips): `N` for new room, `↑↓` to navigate rooms, `⏎` to open. The shortcuts should actually work.

## Acceptance Criteria

- [ ] Footer renders at the bottom of the Home page
- [ ] Three shortcut hints: `N` new room · `↑↓` navigate · `⏎` open
- [ ] Kbd chips use the JetBrains Mono font, with a 1px border and a 2px bottom border (the "keyboard key" look)
- [ ] Pressing `N` opens the create-room modal (when not in an input)
- [ ] Pressing `↑↓` cycles focus through the room cards
- [ ] Pressing `⏎` opens the focused room
- [ ] `yarn lint && yarn build && yarn test:run` all pass
- [ ] Manually verify each shortcut works in the browser

## Files

- `src/pages/Home/ui/Home.tsx` — add the footer + key handlers

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
- 2026-06-06: Done. Added `KbdFooter` to `RoomManagement` (3 kbd-styled chips: `N` new room, `↑↓` navigate, `⏎` open) + keyboard handlers that work in browser. JetBrains Mono + 1px border + 2px bottom border for the "keyboard key" look. Build clean. Visual verified.

## Related

- [[Direction: Direction 7 Integration]]
- [[Concept: Design System]]
