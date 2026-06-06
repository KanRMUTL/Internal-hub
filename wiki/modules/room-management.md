---
type: module
path: 'src/features/room-management/'
status: active
language: typescript
purpose: 'CRUD for rooms. Each room is a self-contained fortune-wheel context.'
maintainer: ''
last_updated: 2026-06-06
linked_issues: []
depends_on:
  - '[[Dependency: Firebase]]'
used_by:
  - '[[Page: Home]]'
  - '[[Module: member-management]]'
tags: [module]
created: 2026-06-06
updated: 2026-06-06
---

# Module: room-management

CRUD for rooms. Each room is a self-contained fortune-wheel context with its own members, history, and active state.

## Location

`src/features/room-management/`

## Structure

```
src/features/room-management/
├── ui/
│   ├── RoomManagement.tsx       # Home page composition
│   ├── RoomList.tsx             # Grid of RoomItems + AddRoomCard
│   ├── RoomGrid.tsx             # Responsive grid wrapper
│   ├── RoomItem.tsx (→ [[Module: room-management]] for the modern version)
│   ├── RoomCardSkeleton.tsx     # Loading state
│   ├── RoomModal.tsx            # Create-room form
│   ├── AddRoomCard.tsx          # "New room" CTA
│   └── ModalConfirmRemoveRoom.tsx
├── hooks/                       # useActiveRooms, useRoomManagement, useRemoveRoom
└── index.ts
```

## Public API

`RoomManagement`, `RoomList`, `RoomGrid`, `RoomItem`, `RoomModal`, `AddRoomCard`, `useActiveRooms`, `useRoomManagement`, `useRemoveRoom`

## Data Model

```ts
interface Room {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
  active: boolean // is this the "Now Spinning" featured room
  lastWinner: string
  members: RoomMember[] // embedded (denormalized)
}
```

## Firestore Collection

`rooms/{roomId}` (top-level collection)

## Modernization Status (Direction 7)

| Aspect                   | Status          | Task                                                                          |
| ------------------------ | --------------- | ----------------------------------------------------------------------------- |
| `RoomItem` (3 variants)  | ✅ Production   | `src/entities/room/ui/RoomItem.tsx` — promoted from preview, fully integrated |
| `AddRoomCard`            | ✅ Production   | Thin wrapper over `RoomItem variant="add"`                                    |
| Home page composition    | ❌ Preview only | [[Task: Update Home page composition to ModernHomePreview]]                   |
| "Remove room" affordance | ⚠️ Simplified   | [[Task: Add "..." menu for remove room]]                                      |

## Open UX Question

When integrating the modern Home page, the "Remove Room" action was removed (it was on a trash icon in the old card). The cleanest replacement is a "..." menu on the card. This is still TBD.

## Related

- [[Page: Home]]
- [[Module: member-management]]
- [[Concept: Design System]]
