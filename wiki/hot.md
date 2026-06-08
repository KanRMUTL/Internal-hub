---
type: meta
title: 'Hot Cache'
updated: 2026-06-08T00:35:00
---

# Recent Context

## Last Updated

2026-06-08 (early session). Search section in `MemberManagementModalModern` restructured as a proper section: lifted out of the `TitleBlock`, now its own `SearchSection` between Header and Divider. Adds an inline clear button (X) inside the input that only appears when there's a query, a result-count line below the input ("5 of 25 members matching 'ali'"), and a `Cmd/Ctrl+K` (also `/` from outside any input) keyboard shortcut to focus the search. Escape on the search input clears the query before falling back to closing the modal.

## Key Recent Facts

- `internal-hub` is a React 19 + TypeScript + Vite SPA on Firebase, deployed to `internal-hub-1b94e`
- The modern Direction 7 design system is the production theme (OKLCH palette, restrained teal-led neutrals)
- **Recent spins overflow fix** (this session, latest): `FortuneHistoryListModern` no longer renders its own visual `Container` — it now returns a transparent `ScrollArea` (max-height + overflow only). Visual boundary (border, background, border-radius, padding) is owned by the parent `SideCard` in `RoomPage`. Same fix applied to `FortuneHistoryDataBoundary.SkeletonContainer`. The root cause was `width: 100%` + `padding: md` + `border: 1px` overflowing the 320px right column by 13px under the project's default `box-sizing: content-box`. **No box-sizing reset anywhere in `src/`** — this is a latent project-wide risk for any future nested-card pattern; do not introduce a global reset without auditing call sites first.
- **Motion library consolidation** (this session): the fortune surface now uses the shared `MotionWrapper` / `MotionSpan` for flourishes; the primary wheel rotation stays on `motion.svg` because the shared wrapper doesn't compose with styled-components cleanly
- **A11y lift** (this session): `FocusTrap` wraps both modals, `LiveRegion` announces the winner and new history rows, `aria-modal` is wired, keyboard handlers are gated on input/textarea focus
- **Empty state unification** (this session): single `EmptyState` styled component shared across `HistoryListModern` and `FortuneHistoryListModern`; copy is now actionable ("Spin the wheel to record your first result")
- **Skeleton matches real layout** (this session): the history skeleton now shows avatar + two stacked bars, matching the real row
- **Button hierarchy** (this session): the winner modal's three co-equal buttons are now 1 primary (Save) + 1 text link (Discard) + 1 icon (Spin again)
- Two active **directions** for multi-agent coordination: [[Direction: Direction 7 Integration]] and [[Direction: Wiki Documentation]]
- **Spacing scale is now 4pt-based** (`3xs` 2px → `6xl` 96px) and consumed by every page; old `xxs`/`xxl` keys gone
- **App shell is unified** — `widgets/Layout` now exposes `usePageHeader` so the room page no longer duplicates the top bar or theme toggle

## Recent Changes

- **Recent spins width-overflow fix (this session, latest)**:
  - `FortuneHistoryListModern`: `Container` styled.div → `ScrollArea` (max-height + overflow + scrollbar only; no border/bg/radius/padding)
  - `FortuneHistoryDataBoundary.SkeletonContainer`: stripped border/bg/radius (kept `overflow: hidden`)
  - `EmptyState` padding reduced from `xl md` → `lg 0` (SideCard's padding provides horizontal inset)
  - Pre-existing cleanup: removed unused `Title` styled-component + `styled-components` import from `src/pages/Home/ui/Home.tsx` (Direction 7 refactor leftover, blocked `yarn build`)
  - **Created**: [[ADR-005: Presentational components own no visual containers]] (recommended draft below — see Recent Decisions)
- **Critique + 5-issue polish pass on `src/features/fortune` (this session)**:
  - Stripped conic-gradient halos on `WheelOfFortuneModern.OuterRing` and `WinnerModalModern.AvatarGlow`
  - Dropped the stacked `box-shadow` on the wheel SVG and the drop-shadow on the pointer
  - Consolidated motion: `HubDot`, `Backdrop`, `Dialog`, `AvatarFrame`, `CheckBadge`, `Row`, `EmptyState` now use `MotionWrapper` / `MotionSpan` from `shared/ui/MotionWrapper`
  - Added `FocusTrap` to both modals (CSS-selector `initialFocus`)
  - Added `LiveRegion` announcements for the winner (in modal) and new history rows (in list)
  - Gated the window-level `s`/`Enter` shortcut on `e.target` not being an input/textarea/contenteditable
  - Unified empty states; matched skeleton to real row layout
  - Collapsed 3 co-equal modal buttons into 1 primary + 1 text link + 1 icon
  - **Created**: snapshot at `.impeccable/critique/2026-06-07T07-42-50Z__src-features-fortune.md` (21/40)
  - **Updated**: `wiki/modules/fortune.md` to reflect modern production state
  - **Created**: [[ADR-004: Motion Wrapper Consolidation]] — one source of motion truth, shared wrappers preferred

## Active Threads

- **Direction 7 Integration** (`owner: unassigned`): 10 task slots, ~35% shipped. Most impactful next picks: [[Task: Replace production WheelOfFortune with WheelOfFortuneModern]] (P1) or [[Task: Wire WinnerModalModern over LuckyModal]] (P1)
- **Wiki Documentation** (`owner: unassigned`): 5 task slots. Easiest wins: [[Task: Ingest PRODUCT.md as a wiki source]] (P1) or [[Task: Ingest AGENTS.md as a wiki source]] (P1)
- **Open UX question**: where does "Remove Room" live (post-Design-7 removal). Tracked by [[Task: Add "..." menu for remove room]]
- **Project-wide hygiene**: project has no `box-sizing` reset. The Recent-spins overflow fix avoided introducing one; if a future change needs to add nested-card layouts, audit all `width: 100%` + `padding` + `border` call sites first.

## Currently In-Progress (live)

All 15 tasks across both directions are `done`. PR #2 is open at https://github.com/KanRMUTL/Internal-hub/pull/2 awaiting review.

## Architecture Pass — 5 candidates landed (this session)

The `/improve-codebase-architecture` skill surfaced 5 deepening opportunities. All 5 are landed; ADR-005 records the rationale. The codebase dropped 17 modules and 1 file rename; the FSD layer integrity is restored.

- **#1 (Strong)** — `RoomItem` moved from `entities/room/ui/` into `features/room-management/ui/`. The fictional cross-slice UI seam is gone; the cross-feature type seam (Room / RoomMember) stays. `entities/room/index.tsx` now exports types only.
- **#2 (Strong)** — Legacy wheel + `LuckyModal` retired. `WheelOfFortune.tsx` shim, `LuckyModal.tsx` (285 lines), `wheelConstant.ts` (duplicate palette), and `LuckyModal.test.tsx` deleted. The 6 helper tests relocated to `wheelModern.test.ts`.
- **#3 (Strong)** — Legacy member-management UI retired. `MemberList`, `MemberManagementV2`, `MemberItem`, `modals/MemberModal`, `modals/ModalConfirmRemoveMember`, `libs/memberTable`, `useMemberManagement` deleted (~600 lines). `RoomPage:432-466` inline chip JSX replaced with `<MemberChipModern />`. Feature barrel: 11 exports → 4.
- **#4 (Strong)** — `shared/ui` dead primitives dropped. `WithMotion` (the `withMotion` shim), `SuccessFeedback`, `PerformanceMonitor`, `MotionDemo` deleted. The one live caller of `withMotion` (`ModalConfirmRemoveRoom`) updated to use `MotionWrapper` directly. Motion surface halves.
- **#5 (Worth exploring)** — `RoomPage` slimmed from 517 → 420 lines. Two new hooks: `useWheelSpin({ members, disabled })` owns rotation/spinning/winner/showWinnerModal + the setTimeout for winner reveal; `useMemberToggleOptimistic({ roomId, members, onError })` owns the local member list + the optimistic toggle with revert-on-error.

Session log captured in [[2026-06-06 — Direction 7 + Wiki Documentation Complete]], this session's [[2026-06-07 — Fortune Critique + Polish Pass]], and the late-session [[2026-06-07 — Recent Spins Width Overflow Fix]].

## Recent Decisions

- [[ADR-001: Direction 7 Design]] — modern × minimal × playful is the chosen design language
- [[ADR-002: FSD Architecture]] — feature-sliced design is the project structure convention
- [[ADR-003: App shell unifies the top bar]] — `widgets/Layout` is the single source of the nav, brand, and theme toggle. Pages opt into per-route slots via `usePageHeader`
- [[ADR-004: Motion Wrapper Consolidation]] — features use `MotionWrapper` / `MotionSpan` from `shared/ui/MotionWrapper` for flourishes; the underlying `motion` import is reserved for primary animation logic that doesn't compose with styled-components
- [[ADR-005: The Modern Path Replaces Legacy UI]] — Direction 7 modern UI is the only path; legacy table/alias surfaces removed; `useWheelSpin` and `useMemberToggleOptimistic` own the page-level state machines
- **Recommended ADR (drafted, not yet created)**: presentational components own no visual containers — feature/ui components render content only; the page/widget layer (`SideCard`, `HeroCard`, `Card` from `shared/ui`) is the single source of card visuals. Avoids nested-card anti-patterns and width-overflow under the project's content-box default.
