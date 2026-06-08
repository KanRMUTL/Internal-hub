---
type: module
path: 'src/features/member-management/'
status: active
language: typescript
purpose: 'CRUD for room members. Members belong to a room and are eligible for the wheel.'
maintainer: ''
last_updated: 2026-06-06
linked_issues: []
depends_on:
  - '[[Dependency: Firebase]]'
  - '[[Module: room-management]]'
used_by:
  - '[[Module: fortune]]'
  - '[[Page: Room]]'
tags: [module]
created: 2026-06-06
updated: 2026-06-06
---

# Module: member-management

CRUD for room members. Each member belongs to a room and is eligible for the wheel draw.

## Location

`src/features/member-management/`

## Structure

```
src/features/member-management/
├── ui/
│   ├── MemberChipModern.tsx          # Single chip primitive (avatar + name + optional Sparkles/EyeOff)
│   └── MemberManagementModalModern.tsx  # Full CRUD dialog (add form + active/inactive rows + remove)
├── hooks/                            # useMemberCollection, useCreateNewMember, useMemberToggleOptimistic
├── services/                         # createMember, removeMember, switchEligibleMember
└── index.ts
```

## Public API

`MemberManagementModalModern`, `MemberChipModern`, `useMemberCollection`, `useCreateNewMember`, `useMemberToggleOptimistic`, `MemberManagementMember`.

## Data Model

```ts
interface RoomMember {
  id: string
  name: string
  isEligibleRandom: boolean // can be picked by the wheel
  joinAt: string
  createdAt: string
  updatedAt: string
}
```

## Firestore Collection

`rooms/{roomId}/members/{memberId}` (subcollection)

## Hooks

- **`useMemberCollection(roomId)`** — subscribes to the room's members, partitions by `isEligibleRandom`. Returns `{ members, loading, error, eligibleRandomMembers, normalMembers }`.
- **`useCreateNewMember()`** — owns the add flow: `useModal` for the new-member modal, `useFlashAlert` for success/error feedback, `handleCreateMember(roomId, name)`.
- **`useMemberToggleOptimistic({ roomId, members, onError })`** — owns the local member list and the optimistic eligibility toggle. Returns `{ displayMembers, removeMember, toggleActive }`. On toggle failure, the local state reverts and `onError(message)` is invoked for the page to surface a flash alert.

## Modernization Status (Direction 7)

| Aspect                  | Status        | Notes                                                                                                                  |
| ----------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Member management modal | ✅ Production | `MemberManagementModalModern` — the only CRUD surface                                                                  |
| Member chip             | ✅ Production | `MemberChipModern` — used by `RoomPage` for the chip rail                                                              |
| Active/inactive toggle  | ✅ Production | `useMemberToggleOptimistic` owns the optimistic update                                                                 |
| Legacy table view       | ✅ Removed    | `MemberList`, `MemberManagementV2`, `MemberItem`, `modals/*`, `libs/*`, `useMemberManagement` deleted; see [[ADR-005]] |

The new feature is: members can be **on or off the wheel** without being removed from the room. The wheel reflects only active members; the "X in pool" count shows active count.

## Related

- [[Module: fortune]] — consumes members (filtered by active)
- [[Module: room-management]] — provides roomId
- [[Flow: Member Toggle Active/Inactive]] (upcoming)
- [[ADR-005: The Modern Path Replaces Legacy UI]]
