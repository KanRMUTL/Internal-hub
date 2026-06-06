---
type: flow
name: 'Add Member'
trigger: "User navigates into a room, clicks 'Manage' in the members side card, then types a name in the add form at the top of the modal and submits"
outcome: "A new member document is created in the room's `members` subcollection in Firestore; the new member appears in the list (real-time); the add form clears"
tags: [flow, member-management, add]
created: 2026-06-06
updated: 2026-06-06
---

# Flow: Add Member

## Trigger

Inside any room, the user clicks the `Manage` button in the `Members` side card. The `MemberManagementModalModern` opens.

## Steps

1. User types a name in the inline add form (single text input, placeholder "e.g. Casey").
2. User submits via Enter key or the `+ Add` button.
3. `RoomPage.handleAddMember` calls `useCreateNewMember.handleCreateMember(roomId, name)`.
4. `handleCreateMember` writes to the room's `members` subcollection: `{ id: auto, name, isEligibleRandom: true, joinAt, createdAt, updatedAt }`.
5. `useMemberCollection` (real-time) picks up the new member; the modal list re-renders with the new row at the bottom.
6. The input clears and re-focuses for the next entry.

## Outcome

- **Success:** new member row appears with a colored avatar (deterministic from name), `Eye` icon (active), and a `Trash2` remove button.
- **Failure:** inline error appears under the input; the value is preserved.

## Edge Cases

- **Empty name:** submit is disabled (button) / ignored (Enter).
- **Duplicate name:** allowed (members are uniquely identified by Firestore ID, not name).
- **Network offline:** write fails; inline error appears.

## Accessibility

- The input has an `aria-label` (no visible label needed since the placeholder is descriptive).
- Submitting via Enter works because the input is a single field.
- The new member row animates in (`motion.li` with staggered mount).

## Related

- [[Module: member-management]] — implements this flow
- [[Module: fortune]] — the wheel reads from this collection
- [[Flow: Member Toggle Active/Inactive]] — managing members after adding
- [[Flow: Spin the Wheel]] — what becomes possible after members exist
