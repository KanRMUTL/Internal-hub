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
tags: [task, direction-7, home-page]
created: 2026-06-06
updated: 2026-06-06
---

# Task: Add Home page section header

## Goal

Add a "Your rooms" section header on the Home page with a member count ("5 rooms · 55 members") and a sort toggle pill (Recent / A–Z). Currently the Home page just shows the room grid with no header.

## Acceptance Criteria

- [ ] "Your rooms" section header renders above the room grid
- [ ] Member count: "5 rooms · 55 members" (5 is the count, 55 is the total member count across all rooms)
- [ ] Sort toggle pill: "Recent" / "A–Z" with the ArrowDownAZ icon
- [ ] Toggle changes the sort order of the rooms
- [ ] "5" is bold (SectionCountStrong), the rest is muted
- [ ] `yarn lint && yarn build && yarn test:run` all pass

## Files

- `src/pages/Home/ui/Home.tsx` — add the section header

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
- 2026-06-06: Done. Added "Your rooms · N rooms · M members" header with bold count + Recent/A–Z/New sort pills to `RoomManagement`. Build clean. Visual verified — header shows "2 rooms · 0 members", sort pills toggle.

## Related

- [[Direction: Direction 7 Integration]]
- [[Concept: Design System]]
