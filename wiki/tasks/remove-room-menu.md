---
type: task
status: done
direction: 'Direction 7 Integration'
priority: 3
owner: 'task-runner'
started: '2026-06-06'
due: ''
depends_on:
  - '[[Task: Wire MemberManagementModalModern over MembersModal]]'
blocks: []
files:
  - 'src/entities/room/ui/RoomItem.tsx'
  - 'src/features/room-management/ui/RoomList.tsx'
  - 'src/features/room-management/ui/RoomManagement.tsx'
tags: [task, direction-7, ux, remove-room]
created: 2026-06-06
updated: 2026-06-06
---

# Task: Add "..." menu for remove room

## Goal

Restore the ability to remove a room from the Home page. When the modern RoomItem replaced the old card design, the inline "Trash" button was removed (it was on a small icon at the bottom of the old card). The new card has no affordance for "remove this room" — so users can create rooms but not delete them from the Home page.

## Acceptance Criteria

- [ ] Each room card has a "..." (more) button in the top-right corner
- [ ] Clicking opens a small popover/menu with: "Remove room" (with a Trash icon, danger color on hover)
- [ ] Clicking "Remove room" opens the existing `ModalConfirmRemoveRoom`
- [ ] Confirming the modal removes the room from Firestore
- [ ] The "..." button is unobtrusive (low opacity until hover)
- [ ] `yarn lint && yarn build && yarn test:run` all pass

## Files

- `src/entities/room/ui/RoomItem.tsx` — add the "..." button + menu

## Dependencies

- [[Task: Wire MemberManagementModalModern over MembersModal]] — must be done first to avoid file conflicts in the same area

## Blocked By / Blocks

- **Blocked by**: member management modal
- **Blocks**: nothing

## Status

- `status`: `todo` | `in-progress` | `blocked` | `review` | `done`
- `owner`: which agent is working on this
- `started`: YYYY-MM-DD when status moved to in-progress
- `due`: YYYY-MM-DD target completion

## Progress Log

- 2026-06-06: Task created during Direction 7 Integration direction scaffold
- 2026-06-06: Done. Added a "..." button to the top-right of each room card. The button is low-opacity at rest, full opacity on card hover/focus. Clicking opens a small popover with "Remove room" (red + trash icon). Card converted from `<button>` to `<div role="button">` to allow nested button (with proper Enter/Space keyboard handling). Click-outside + Escape close the menu. `onRemove` plumbed from `RoomManagement` → `RoomList` → `RoomItem`. Build clean. Visual verified — "..." appears on hover, menu opens with single Remove room item, clicking it triggers the existing `ModalConfirmRemoveRoom`.

## Related

- [[Direction: Direction 7 Integration]]
- [[Module: room-management]]
- [[Concept: Design System]] — the "no trash icons in the main UI" principle
