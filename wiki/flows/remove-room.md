---
type: flow
name: 'Remove Room'
trigger: "User clicks the '...' (more) button on a room card in the home page, then clicks 'Remove room' in the popover menu, then confirms in the modal"
outcome: 'The room document is deleted from Firestore (soft-delete via `removedIds` in local state + real-time filter), the card disappears from the grid, a flash alert confirms'
tags: [flow, room-management, remove, delete]
created: 2026-06-06
updated: 2026-06-06
---

# Flow: Remove Room

## Trigger

Two confirmation gates:

1. Click the `...` button in the top-right of a room card → opens a popover with `Remove room` (red, with `Trash2` icon).
2. Click `Remove room` → opens the existing `ModalConfirmRemoveRoom` ("🥹 Are you sure to remove 'X'? This action cannot be undone❗️").

## Steps

1. User clicks `...` on a room card.
2. The popover menu opens (absolute-positioned below the button, top-right of the card).
3. User clicks `Remove room` in the popover.
4. `RoomItem.onRemove` calls `RoomList.onRemove(room)` which calls `RoomManagement.handleOpenRemove(room)`.
5. `handleOpenRemove` calls `useRemoveRoom.setSelectedRoom(room)` then `modalRemoveRoom.open()`.
6. `ModalConfirmRemoveRoom` renders with the room name interpolated in the prompt.
7. User clicks `Remove` to confirm (or `Not Sure` / Esc / backdrop to cancel).
8. `RoomManagement.handleRemoveRoomWithFeedback` calls `useRemoveRoom.handleConfirmRemoveRoom()`.
9. `handleConfirmRemoveRoom` deletes the room from Firestore AND adds its id to local `removedIds` state (for instant UI feedback before the real-time subscription propagates).
10. On success: `FlashAlert` shows "Room removed successfully!"; the card is filtered out of the visible list.

## Outcome

- **Success:** room card disappears (animated out via `AnimatePresence`); flash alert visible.
- **Cancel:** modal closes; no change.
- **Failure:** modal stays open; flash alert shows danger.

## Notes

- The flow uses **soft-delete in local state** (`removedIds`) for instant UI feedback, then relies on the real-time subscription to actually remove the document. This is a common pattern with Firestore's eventual consistency.
- The `ModalConfirmRemoveRoom` wording is intentionally a bit casual ("🥹 ... Not Sure") — this is a low-stakes, internal tool; corporate formality felt wrong for a daily-driver app.

## Related

- [[Module: room-management]] — implements this flow
- [[Page: Home]] — where the flow starts
- [[Flow: Create Room]] — the inverse flow
- [[Task: Add "..." menu for remove room]] — the design rationale
