---
type: flow
name: 'Create Room'
trigger: "User clicks the 'New' button in the home page header, or the 'New room' add card on the grid, or presses the 'N' keyboard shortcut"
outcome: 'A new room document is created in Firestore; the user sees the new card in the grid (or a flash alert if creation failed)'
tags: [flow, room-management, create]
created: 2026-06-06
updated: 2026-06-06
---

# Flow: Create Room

## Trigger

Three ways to start:

1. Click `+ New` in the home page section header
2. Click the dashed `New room` add card in the grid
3. Press `N` anywhere on the home page (when not focused on an input)

## Steps

1. `roomModal.open()` is called (from `useRoomManagement` hook).
2. The `RoomModal` opens with a centered dialog, `name` + `description` fields.
3. User types a name (1–60 chars) and an optional description.
4. User submits (button or Enter key).
5. `RoomManagement.handleCreateRoomWithFeedback` calls `useRoomManagement.handleCreateRoom`.
6. `handleCreateRoom` writes to Firestore `rooms` collection with `active: true`, empty members array, timestamps.
7. On success: `FlashAlert` shows "Room created successfully!" (success, auto-dismiss).
8. On error: `FlashAlert` shows "Failed to create room. Please try again." (danger).

## Outcome

- **Success:** new room appears in the grid (Firestore real-time subscription updates the `useActiveRooms` list). Modal closes. Flash alert visible for 3 seconds.
- **Failure:** modal stays open with fields preserved. Flash alert visible.

## Error Paths

- **Network offline:** the `useRoomManagement` hook catches the error; flash alert shows danger state.
- **Empty name:** `RoomModal` validates and shows inline error; submit is disabled.
- **Duplicate name:** Firestore allows duplicates (rooms are not uniquely keyed by name); no error.

## Related

- [[Module: room-management]] — implements this flow
- [[Page: Home]] — where the flow starts
- [[Flow: Add Member]] — the next step after creating a room
- [[Flow: Remove Room]] — the inverse flow
