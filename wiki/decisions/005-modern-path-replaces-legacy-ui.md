---
type: decision
id: ADR-005
status: accepted
date: 2026-06-07
deciders: [improve-codebase-architecture]
tags: [architecture, fsd, member-management, fortune]
---

# ADR-005: The Modern Path Replaces Legacy UI

## Context

The Direction 7 modernization shipped in two waves:

1. **A new "modern" UI surface** — `WheelOfFortuneModern`, `WinnerModalModern`, `MemberManagementModalModern`, `MemberChipModern` — built for the OKLCH palette, modern modal patterns, and the active/inactive eligibility concept.
2. **A legacy "table" path** — `MemberManagementV2` (table view), `MemberList`, `MemberItem`, `MemberModal`, `ModalConfirmRemoveMember`, `libs/memberTable` (column factory), and the `useMemberManagement` hook that composed them.

Both paths coexisted in `features/member-management/`, exporting 11 symbols through the feature barrel. The modern modal was the one `RoomPage` actually used. The table path had **zero production consumers** but still occupied ~600 lines and kept the feature barrel self-contradictory ("here's the modern path, and also here's a totally different table path you might want to use").

The same pattern existed in `features/fortune/`: the barrel re-exported the legacy `WheelOfFortune` (alias) and `LuckyModal` "for backward compatibility" — but no production code imported them. The legacy `wheelConstant.ts` duplicated the modern 6-color palette verbatim.

## Decision

**The modern path is the path. Legacy UI is removed.**

- In `features/member-management/`, the table path is deleted entirely. The modern `MemberManagementModalModern` + `MemberChipModern` are the only UI surface. The `MemberChipModern` (previously exported but unused) replaces the 35-line inline chip JSX in `RoomPage`.
- In `features/fortune/`, the legacy `WheelOfFortune.tsx` shim, `LuckyModal.tsx`, and `wheelConstant.ts` are deleted. The barrel re-exports only the modern path.
- The spin-lifecycle helpers (`pickWinnerIndex`, `computeNextRotation`, `MODERN_SPIN_DURATION_MS`, `POINTER_ANGLE_DEG`) move from the bottom of `WheelOfFortuneModern.tsx` into `wheelModern.ts` — the geometry/constants file is the right home for primitive helpers.
- `RoomPage` is slimmed by extracting the spin state machine into `useWheelSpin` (rotation, spinning, winner, showWinnerModal, startSpin, dismissWinner, spinAgain) and the optimistic member toggle into `useMemberToggleOptimistic` (displayMembers, removeMember, toggleActive).

### Concretely

| Module                              | Before                                                                                  | After                                                    |
| ----------------------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `features/member-management` barrel | 11 exports (4 used, 7 dead)                                                             | 4 exports (all used)                                     |
| `features/fortune` barrel           | Exports modern + legacy aliases                                                         | Exports modern only                                      |
| `RoomPage`                          | 517 lines, owns spin + member state machines                                            | 420 lines, pure composition                              |
| `shared/ui`                         | 4 dead primitives (`WithMotion`, `SuccessFeedback`, `PerformanceMonitor`, `MotionDemo`) | Removed; `MotionWrapper` is the one configurable adapter |

### Why not a "compat layer"?

The legacy path was never externalized. There were no external consumers needing backward compatibility — the barrel's "kept for backward compat" comment was a lie. Adding a real deprecation cycle (banner, console warnings, removal in N versions) would be ceremony for a transition that no one outside the team experienced. Internal-only app, no downstream consumers, no reason to drag out the retirement.

### Why is `MotionWrapper` the one configurable adapter?

`WithMotion` was a hardcoded `scale: 0.5 → 1 → 1.1` wrapper used by two files, both slated for deletion. After the deletions, `MotionWrapper` (the configurable sibling) is the only consumer. One adapter, one concept — no need for a seam. (See [[ADR-004: Motion Wrapper Consolidation]] for the broader motion-consolidation rationale.)

## Consequences

**Positive:**

- **Interface shrinks.** Feature barrels expose 4 names each (down from 11 in member-management, 14+ in fortune). Callers learn fewer names.
- **Locality.** Spin lifecycle lives in one hook. Optimistic toggle lives in another. Page is composition.
- **No more dead surface.** Wiki readers, future agents, and the FSD layer audit can see the bar (`MemberManagementModalModern`, `MemberChipModern`, `useMemberCollection`, `useCreateNewMember`, `useMemberToggleOptimistic`) and trust it.
- **`MotionWrapper` is honest.** It's the one configurable motion adapter; no parallel `withMotion` shim.
- **Box-sizing hygiene deferred** — the nested-card issue from the previous session is structural (no global reset), not solved by this work; called out in `wiki/hot.md` Active Threads.

**Negative / accepted:**

- The spin-lifecycle helpers used to be co-located with the wheel component. They're now in `wheelModern.ts`. The `wheelModern.ts` file is no longer "constants only" — it has constants + helpers. Acceptable; both are pure, testable, and importable independently.
- `useWheelSpin` takes `disabled: boolean` to gate `startSpin` (page passes `showMembersModal`). The hook doesn't know about the members modal directly. Clean separation; means the hook is testable without the modal.
- Wiki pages for member-management and fortune need updating to reflect the new state. (`RoomItem` move into room-management also needs a wiki update — see [[ADR-002: FSD Architecture]].)

**Neutral:**

- The `entities/room` layer is now empty of UI but keeps `Room` / `RoomMember` types. The cross-feature type seam is real (both room-management and member-management need the types); the cross-feature UI seam was fictional and is gone. (See `wiki/concepts/feature-sliced-design.md`.)

## Related

- [[ADR-001: Direction 7 Design]] — the design language the modern path is built for
- [[ADR-002: FSD Architecture]] — FSD layer conventions
- [[ADR-004: Motion Wrapper Consolidation]] — the motion rationale; ADR-005 is the parallel decision for the UI surface
- [[Module: fortune]]
- [[Module: member-management]]
- [[Module: room-management]]
- `wiki/decisions/004-motion-wrapper-consolidation.md`
