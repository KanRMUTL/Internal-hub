---
type: task
status: done
direction: 'Direction 7 Integration'
priority: 1
owner: 'task-runner'
started: '2026-06-06'
due: ''
depends_on: []
blocks: []
files:
  - 'src/pages/Room/ui/RoomPage.tsx'
  - 'src/features/member-management/ui/MemberManagementModalModern.tsx'
tags: [task, direction-7, room-page, member-management]
created: 2026-06-06
updated: 2026-06-06
---

# Task: Wire MemberManagementModalModern over MembersModal

## Goal

Replace the production `MembersModal` (the in-room member management dialog) with `MemberManagementModalModern`. The modern version has inline add form, member list with active/inactive toggle, footer count, and Escape to close.

## Acceptance Criteria

- [ ] Production room page shows the modern member management modal when the user opens "Manage"
- [ ] Inline add form: type a name, press Enter, member is added to the room
- [ ] Member list: each row has avatar, name, active/inactive toggle, remove button
- [ ] Active toggle (Eye icon, teal) → member IS in the wheel
- [ ] Inactive toggle (EyeOff icon, gray) → member is NOT in the wheel, name has strikethrough
- [ ] Footer: "X of Y on the wheel" count
- [ ] Remove button: deletes member from Firestore
- [ ] Esc closes the modal
- [ ] `yarn lint && yarn build && yarn test:run` all pass
- [ ] Real data: add a member, toggle inactive, verify wheel excludes them

## Files

- `src/features/member-management/ui/MemberItem.tsx` — modernize the single-row visual
- `src/pages/Room/ui/components/MembersModal.tsx` — replace with the modern modal

## Dependencies

None (the wheel and winner modal can be done in parallel).

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
- 2026-06-06: Claimed by task-runner (P1 wave)
- 2026-06-06: Done. `MemberManagementModalModern` is wired into `RoomPage` via `showMembersModal` state; inline add calls `useCreateNewMember.handleCreateMember`; eye/eye-off toggle updates `localMembers[i].isEligibleRandom`; Esc closes. Visual verified. Old `MembersModal` slot at `src/pages/Room/ui/components/MembersModal.tsx` is now unused and can be deleted in a follow-up.

## Related

- [[Direction: Direction 7 Integration]]
- [[Module: member-management]]
- [[Task: Add "..." menu for remove room]]
