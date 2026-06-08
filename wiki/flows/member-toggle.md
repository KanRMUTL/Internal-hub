---
type: flow
name: 'Member Toggle Active/Inactive'
trigger: 'User clicks the Eye / EyeOff icon button on a member row in the MemberManagementModalModern'
outcome: "The member's `isEligibleRandom` flag toggles in the local state (in-room optimistic update); the wheel pool updates immediately; the chip in the members side card dims and gets a strikethrough"
tags: [flow, member-management, toggle, active, wheel]
created: 2026-06-06
updated: 2026-06-06
---

# Flow: Member Toggle Active/Inactive

## Trigger

Inside `MemberManagementModalModern`, each member row has an `Eye` (active) or `EyeOff` (inactive) icon button in a circular teal/grey surface. Clicking toggles the state.

## Steps

1. User clicks the eye icon on a member row.
2. `MemberManagementModalModern.onToggleActive(memberId)` is called.
3. The parent (`RoomPage.handleToggleActive`) updates `localMembers[i].isEligibleRandom = !localMembers[i].isEligibleRandom`.
4. **Optimistic UI update** — the modal re-renders with the new icon, the members side card updates (chip dims + strikethrough if inactive).
5. `activeMembers` (filtered from `localMembers`) shrinks/grows, which feeds the wheel.
6. (Background) Future enhancement: persist the change to Firestore. Currently this is a session-local toggle; Firestore write is not yet wired (see "Known limitations" below).

## Outcome

- **Active → Inactive:** the icon switches from `Eye` (teal) to `EyeOff` (grey); the member name gains a strikethrough in the side card; the member is excluded from the wheel pool; the wheel re-renders with one fewer slice.
- **Inactive → Active:** opposite of above.

## Visual Treatment

- The icon button is a 28px circle, teal when active, grey when inactive.
- The member row in the modal also updates the strikethrough state.
- In the side card chips (not modal), the chip is dimmed (opacity 0.55) when inactive and the name has line-through.

## Known Limitations

- **Not yet persisted to Firestore.** The toggle lives in `localMembers` (a useState) in `RoomPage`. Refreshing the page resets the state. This is a known gap; a follow-up task should wire `updateMember` to the Firestore `members` subcollection.

## Related

- [[Module: member-management]] — implements the toggle
- [[Module: fortune]] — the wheel consumes `activeMembers`
- [[Flow: Add Member]] — getting members into the room
- [[Flow: Spin the Wheel]] — what changes based on toggle
