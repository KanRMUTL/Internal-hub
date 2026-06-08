---
type: module
path: 'src/features/fortune/'
status: active
language: typescript
purpose: 'Wheel of fortune + spin history. The hero feature of every room.'
maintainer: ''
last_updated: 2026-06-07
linked_issues: []
depends_on:
  - '[[Dependency: Firebase]]'
  - '[[Dependency: Motion]]'
  - '[[Dependency: shared/ui/MotionWrapper]]'
  - '[[Dependency: shared/ui/FocusTrap]]'
  - '[[Dependency: shared/ui/LiveRegion]]'
  - '[[Module: room-management]]'
  - '[[Module: member-management]]'
used_by:
  - '[[Page: Room]]'
tags: [module, hero-feature]
created: 2026-06-06
updated: 2026-06-07
---

# Module: fortune

The wheel of fortune + the persistent spin history. The hero feature of every room.

## Location

`src/features/fortune/`

## Structure

```
src/features/fortune/
├── ui/
│   ├── WheelOfFortuneModern.tsx  # Direction 7 wheel; adaptive label fitting
│   ├── wheelModern.ts            # 6-color OKLCH palette + spin constants + helper functions
│   ├── WinnerModalModern.tsx     # Post-spin winner dialog (a11y: FocusTrap + LiveRegion)
│   ├── HistoryListModern.tsx     # Row list with stagger; shared EmptyState
│   ├── FortuneHistoryListModern.tsx  # Subscribes to history; announces new rows
│   ├── FortuneHistoryDataBoundary.tsx  # Loading/error/skeleton; skeleton mirrors real row
│   └── __tests__/wheelModern.test.ts   # Helper tests for the spin lifecycle
├── hooks/                         # useFortuneHistory, useWheelSpin
├── services/                      # createFortuneHistoryEntry
├── model/                         # FortuneHistoryEntry types
├── config/                        # fortuneHistoryConstant (wheelConstant.ts removed)
└── index.ts
```

## Public API (modern — the only API)

`WheelOfFortuneModern`, `WinnerModalModern`, `FortuneHistoryListModern`, `HistoryListModern`, `createFortuneHistoryEntry`, `useFortuneHistory`, `useWheelSpin`, `pickWinnerIndex`, `computeNextRotation`, `MODERN_SPIN_DURATION_MS`, `ModernWheelMember`.

## Key Constants & Helpers

`src/features/fortune/ui/wheelModern.ts`:

- `MODERN_WHEEL_COLORS` — 6 OKLCH colors, matched chroma/lightness, teal-led
- `MODERN_WHEEL_RADIUS = 156`
- `MODERN_WHEEL_SPIN_DURATION = 5.6s`
- `MODERN_WHEEL_SPINS = 6`
- `POINTER_ANGLE_DEG = 270` — pointer at the top of the wheel
- `pickWinnerIndex(rotation, memberCount)` — pure helper, computes the winning slice from rotation
- `computeNextRotation(currentRotation)` — pure helper, returns the next rotation value
- `MODERN_SPIN_DURATION_MS = 5600` — derived from `MODERN_WHEEL_SPIN_DURATION`

## Animation Details

- Easing: `[0.22, 1, 0.36, 1]` (expo out) for the wheel; `[0.16, 1, 0.3, 1]` for modals
- 6 full rotations + random offset per spin
- Pointer at 270° (top of wheel)
- Winner = slice under pointer after spin lands (`pickWinnerIndex`)

## Label Fitting (crowded wheels)

`WheelOfFortuneModern` adapts label radius, font size, char cap, and text-length to the member count:

| Members | labelR | fontSize | max chars           | textLength cap |
| ------- | ------ | -------- | ------------------- | -------------- |
| ≤ 8     | 0.72   | 11       | floor(arcLen / 5.5) | arc − 10px     |
| 9–12    | 0.64   | 10       | floor(arcLen / 5.5) | arc − 10px     |
| 13+     | 0.56   | 9        | floor(arcLen / 5.5) | arc − 10px     |

`textLength` + `lengthAdjust="spacingAndGlyphs"` guarantees the renderer fits the label inside the segment arc.

## State / Data Flow

- `RoomPage` calls `useWheelSpin({ members: activeMembers, disabled: showMembersModal })` to own the spin state machine (`rotation`, `spinning`, `winner`, `showWinnerModal` + the setTimeout for winner reveal)
- `RoomPage` passes `rotation`/`spinning` to `WheelOfFortuneModern` and `winner`/`showWinnerModal` to `WinnerModalModern`
- On Save → `createFortuneHistoryEntry` writes to Firestore; on Discard → `dismissWinner`; on Spin Again → `spinAgain`
- `useFortuneHistory` subscribes to live updates, re-renders `FortuneHistoryListModern`
- `FortuneHistoryListModern` detects new entries via `previousHistoryIdsRef`, highlights them, and announces "{name} just won" via `LiveRegion`

## Accessibility

- **Winner modal:** wrapped in `FocusTrap` (initial focus on Save); `aria-modal`/`aria-labelledby="winner-name"`; LiveRegion announces "{name} is up" on open; Esc/Enter/S shortcuts gated on input focus.
- **Member management modal:** wrapped in `FocusTrap` (initial focus on the add input); Esc closes; aria-modal/aria-labelledby wired.
- **Wheel:** `role="img"` + `aria-label="Fortune wheel"` on the SVG.
- **History list:** LiveRegion (polite) announces new spins; container has no `aria-live` attribute (the shared LiveRegion is a sibling).

## Motion

- The wheel's primary rotation uses `motion.svg` (the only motion import in `WheelOfFortuneModern`); the shared `MotionWrapper` doesn't compose with styled-components for SVG elements.
- All other flourishes (`HubDot` pulse, modal backdrops/dialogs, avatar frames, history rows, empty states) use `MotionWrapper` / `MotionSpan` from `shared/ui/MotionWrapper`. See [[ADR-004: Motion Wrapper Consolidation]].

## Modernization Status (Direction 7)

| Aspect         | Status        | Task                                                                                      |
| -------------- | ------------- | ----------------------------------------------------------------------------------------- |
| Wheel palette  | ✅ Production | 6-color OKLCH in `wheelModern.ts`                                                         |
| Wheel visual   | ✅ Production | Adaptive label fitting, hairline border, no decorative halo                               |
| Winner modal   | ✅ Production | 1 primary + 1 text link + 1 icon; FocusTrap + LiveRegion                                  |
| History list   | ✅ Production | Skeleton mirrors real row; LiveRegion announces new entries                               |
| Spin lifecycle | ✅ Production | `useWheelSpin` owns rotation/spinning/winner/showWinnerModal; helpers in `wheelModern.ts` |
| Legacy aliases | ✅ Removed    | `WheelOfFortune` (alias) + `LuckyModal` + `wheelConstant.ts` deleted; see [[ADR-005]]     |
| Critique       | ✅ Reviewed   | `.impeccable/critique/2026-06-07T07-42-50Z__src-features-fortune.md`                      |

## Related

- [[Module: room-management]] — provides roomId
- [[Module: member-management]] — provides eligible members
- [[Flow: Spin the Wheel]]
- [[Concept: Design System]]
- [[ADR-004: Motion Wrapper Consolidation]]
- [[ADR-005: The Modern Path Replaces Legacy UI]]
