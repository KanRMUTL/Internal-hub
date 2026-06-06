---
type: module
path: 'src/features/fortune/'
status: active
language: typescript
purpose: 'Wheel of fortune + spin history. The hero feature of every room.'
maintainer: ''
last_updated: 2026-06-06
linked_issues: []
depends_on:
  - '[[Dependency: Firebase]]'
  - '[[Dependency: Motion]]'
  - '[[Module: room-management]]'
  - '[[Module: member-management]]'
used_by:
  - '[[Page: Room]]'
tags: [module, hero-feature]
created: 2026-06-06
updated: 2026-06-06
---

# Module: fortune

The wheel of fortune + the persistent spin history. The hero feature of every room.

## Location

`src/features/fortune/`

## Structure

```
src/features/fortune/
├── ui/
│   ├── WheelOfFortune.tsx       # SVG wheel + spin animation
│   ├── LuckyModal.tsx           # Post-spin winner dialog
│   ├── FortuneHistoryTable.tsx  # History list
│   └── FortuneHistoryDataBoundary.tsx
├── hooks/                       # useFortuneHistory
├── services/                    # createFortuneHistoryEntry
├── model/                       # FortuneHistoryEntry types
├── config/                      # wheelConstant.ts
└── index.ts
```

## Public API

`WheelOfFortune`, `LuckyModal`, `FortuneHistoryTable`, `createFortuneHistoryEntry`, `useFortuneHistory`

## Key Constants

`src/features/fortune/config/wheelConstant.ts`:

- `WHEEL_COLORS` — 6 OKLCH colors, matched chroma/lightness, teal-led
- `SPIN_DURATION = 12s`, `SPINS_COUNT = 5`, `POINTER_ANGLE = 270`

## Animation Details

- Easing: `[0.22, 1, 0.36, 1]` (expo out)
- 5 full rotations + random offset
- Pointer at 270° (top of wheel)
- Winner = slice under pointer after spin lands

## State / Data Flow

- `RoomPage` calls `WheelOfFortune` with `members` (filtered for eligible)
- `onSpinCompleted(memberId)` triggers `LuckyModal`
- User accepts → `createFortuneHistoryEntry` writes to Firestore
- `useFortuneHistory` subscribes to live updates, re-renders `FortuneHistoryTable`

## Modernization Status (Direction 7)

| Aspect        | Status          | Task                                                                  |
| ------------- | --------------- | --------------------------------------------------------------------- |
| Wheel palette | ✅ Production   | 6-color OKLCH in `wheelConstant.ts`                                   |
| Wheel visual  | ❌ Preview only | [[Task: Replace production WheelOfFortune with WheelOfFortuneModern]] |
| Winner modal  | ❌ Preview only | [[Task: Wire WinnerModalModern over LuckyModal]]                      |
| History list  | ❌ Preview only | [[Task: Replace FortuneHistoryTable with HistoryListModern]]          |

## Related

- [[Module: room-management]] — provides roomId
- [[Module: member-management]] — provides eligible members
- [[Flow: Spin the Wheel]]
- [[Concept: Design System]]
