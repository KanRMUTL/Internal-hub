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
│   ├── MemberItem.tsx
│   ├── MemberList.tsx
│   ├── MemberManagementV2.tsx
│   └── modals/
├── hooks/                       # useMemberCollection, useCreateNewMember
├── services/                    # createMember, removeMember
└── index.ts
```

## Public API

`MemberItem`, `MemberList`, `MemberManagement`, `useMemberCollection`, `useCreateNewMember`, `MemberModal`

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

## Modernization Status (Direction 7)

| Aspect                  | Status          | Task                                                         |
| ----------------------- | --------------- | ------------------------------------------------------------ |
| Member list visual      | ❌ Preview only | [[Task: Wire MemberManagementModalModern over MembersModal]] |
| Member management modal | ❌ Preview only | [[Task: Wire MemberManagementModalModern over MembersModal]] |
| Active/inactive toggle  | ❌ Preview only | (part of the member management modal task)                   |

The new feature is: members can be **on or off the wheel** without being removed from the room. The wheel reflects only active members; the "X in pool" count shows active count.

## Related

- [[Module: fortune]] — consumes members (filtered by active)
- [[Module: room-management]] — provides roomId
- [[Flow: Member Toggle Active/Inactive]] (upcoming)
