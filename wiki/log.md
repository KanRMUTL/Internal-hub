---
type: meta
title: 'Log'
updated: 2026-06-08T00:35:00
---

# Wiki Log

Append-only chronological record. New entries go at the TOP.

---

## 2026-06-08 — Search section restructure in member management modal | member-management, ux, a11y

- **Symptom:** the search input was buried inside the modal's `TitleBlock` — visually part of the title hierarchy, not a distinct section. No clear button, no result count, no keyboard shortcut to focus, and the icon position used a theme-spacing token that didn't cleanly align with the input's pixel-padding.
- **Fix:** the search is now its own `SearchSection` between the `Header` and the `Divider`, with:
  - `SearchField` (position-relative wrapper)
  - `SearchIconWrap` (left, 12px, vertically centered)
  - `SearchInput` (36px tall, 36px right-padding to clear the clear-button column)
  - `SearchClearBtn` (right, 6px, only rendered when `query` is non-empty, has its own hover/focus states)
  - `SearchMeta` (below the input, role="status" aria-live="polite", shows "5 of 25 members matching 'ali'")
- **Keyboard:**
  - `Cmd/Ctrl+K` from anywhere inside the modal → focuses the search input (and selects the existing query for easy replace)
  - `/` from outside any input → same (GitHub command-palette affordance)
  - `Escape` while focused on the search input → clears the query (next Escape closes the modal)
  - The window-level handler respects `inEditable` so it doesn't fight the user typing in the add-input
- **Accessibility:** `SearchMeta` is a polite live region so screen readers announce "5 of 25" as the user types. The clear button is a real `<button>` (not a span) so it's focusable and announces "Clear search" via `aria-label`. The search field still has `aria-label="Search members by name"`.
- **Tests:** 11 new cases in `MemberManagementModalModern.test.tsx`:
  - search input rendered when `members.length > 0`, hidden when empty
  - case-insensitive substring filter
  - result-count line shows "X of Y" only when searching
  - clear button only rendered when query is non-empty
  - clicking clear empties the query (and the list re-renders all members)
  - Cmd+K and Ctrl+K both focus the search
  - Escape on the search input clears the query; Escape elsewhere closes the modal
  - Two cases use `waitFor` to bridge `AnimatePresence`'s 220ms exit animation
- **Verification:** `yarn build` clean. Full suite: 27 pre-existing failures, 284 → 295 passing (+11), 0 new regressions.
- **Pattern:** when a control lives inside another element's flex layout, it gets read as part of that element's hierarchy (visually and in screen-reader navigation). A "Search" is not part of the title — it's a separate concern, with its own affordances. Lifting it to its own block gives it the visual weight it deserves and makes the modal's structure honest: title above, search below, list below that.

---

## 2026-06-07 — Confirm-remove dialog in member management modal | member-management, a11y, modal

- **Symptom:** clicking the trash icon in `MemberManagementModalModern` immediately called `onRemove(id)` — a destructive, irreversible action with no confirmation. Easy to lose a member to a misclick.
- **Fix:** nested-modal confirmation. The trash click now sets `memberToRemove` (a piece of local state) instead of removing; a small Direction 7 alertdialog appears over the parent modal with the member's name in the body, an AlertTriangle icon, a Cancel button, and a danger-styled Remove button. The parent modal stays visible but is dimmed to 50% opacity and its FocusTrap releases; the confirm's FocusTrap activates, with the Cancel button as the initial focus (a destructive Remove shouldn't be the default Enter target).
- **Escape:** the parent's window-level Escape handler now checks `memberToRemove` first. If a confirm is open, Escape cancels it (and only it — the parent stays). If no confirm is open, Escape closes the parent as before. Effect deps include `memberToRemove` so the handler closure sees the latest value.
- **State reset:** when the parent modal closes (`open: false`), `setMemberToRemove(null)` runs alongside the existing `setName('')` reset, so reopening the modal never shows a stale confirm.
- **Tested:** 5 new cases in `MemberManagementModalModern.test.tsx`. Trash click does NOT call onRemove immediately. Confirm body shows the right member's name (and not the others). Cancel closes the confirm without removing. Remove calls onRemove with the correct id. Escape cancels the confirm but not the parent. Tests use `waitFor` to bridge the 220ms exit animation.
- **Verification:** `yarn build` clean. Full suite: 27 pre-existing failures, 279 → 284 passing (+5 from this change).
- **Pattern:** destructive actions need a discrete confirmation step. A nested-modal is heavier than a row-state machine ("click trash again to confirm") but heavier is good here — the user sees the name, the alert triangle, the two buttons, and the parent is dimmed. The cost of an extra 220ms exit animation is paid only when someone misclicks the trash, which is exactly when an extra beat of friction helps.

---

## 2026-06-07 — Room name on the room page hero | room, shared/hooks

- **Request:** add a "room name" section to the top of the HeroCard, above the existing HeroMeta strip.
- **Source of the name:** `room/{id}.name` from Firestore. The page already had the room id from the URL params but no subscription to the room doc.
- **New shared hook:** `src/shared/hooks/useFirestoreDocument.ts` — a single-doc subscription primitive that mirrors `useFirestoreCollection`. Returns `{ data, loading, error }`. Accepts `null` to skip subscription (e.g., when the caller doesn't have an id yet), so pages can do `useFirestoreDocument(id ? doc(db, 'room', id) : null)` without breaking React's hook rules.
- **Page change:** `RoomPage` now subscribes to the room doc and renders a `RoomNameBlock` (eyebrow "Room" + `<h1>` with the name) at the top of the `HeroCard`. The block is conditional on `room?.name`, so loading and error states show the existing `DataBoundary` message without an empty title.
- **Typographic fit:** `RoomName` uses `theme.fontSizes['2xl']` (Direction 7's H1 size), `fontWeight.semibold`, `letter-spacing: -0.025em`, `text-wrap: balance`, `max-width: 32ch`. The block is centered, matching the rest of the hero. The eyebrow uses the same `theme.fontSizes.micro` + uppercase + `theme.colors.interactive` pattern as the member-management modal's eyebrow.
- **Dead-code cleanup:** while verifying, `tsc -b` reported three pre-existing `noUnusedLocals` errors that had been masked by the build's incremental cache (`Sparkles` import in `RoomPage.tsx`, `WinnerBanner` styled component in `RoomPage.tsx`, `Eyebrow` styled component in `WinnerModalModern.tsx`). Removed all three.
- **Tests:** `src/shared/hooks/__tests__/useFirestoreDocument.test.tsx` — 5 cases: loading state, doc-exists path, doc-missing path, error path, unsubscribe on unmount. Mocks `firebase/firestore.onSnapshot` so the test doesn't need a real Firestore.
- **Verification:** `yarn build` clean, `yarn lint` clean for changed files. Full suite: 27 pre-existing failures (unchanged), 274 → 279 passing (+5 from this change).
- **Pattern:** the page used to think the URL id was enough. It wasn't — the room has a name, a description, an active flag, a last-winner pointer. The page now subscribes to the document so any of those could drive a future UI change without another Firestore round-trip. The `useFirestoreDocument` hook is the primitive; future pages that need a single doc should reuse it.

---

## 2026-06-07 — Member color consistency refactor | entities, member-management, fortune, room

- **Symptom:** the same person was a different color on the wheel vs. the chip vs. the modal avatar vs. the history row vs. the winner modal. Wheel used a fixed 6-color teal-led palette indexed by **position** (not by member), so Bob's wedge was teal but Bob's chip was a different hue. Winner modal avatar used 82% L (4% lighter than the 78% used everywhere else — a perceptual outlier). Per-member OKLCH formulas were duplicated across 4 files and `memberHue(name)` was defined inline in `RoomPage.tsx`.
- **Root cause:** no canonical member-color entity. Each component recomputed its own color, and the wheel's position-based palette was the worst offender — it didn't even know which color belonged to which member.
- **Fix:** new entity `src/entities/member/` (peer to `entities/room/`, `entities/fortune-result/`). It owns a 10-color OKLCH preset palette with three surface variants per hue: `MEMBER_PRESET_COLORS` (78% L / 0.10 C — chip + modal + history + winner avatar), `MEMBER_PRESET_WEDGE_COLORS` (70% L / 0.12 C — wheel wedges), `MEMBER_PRESET_TEXT_COLORS` (30% L / 0.08 C — text on avatar). `memberPresetIndex(name)` deterministically maps a name to 0-9; helpers `memberAvatarBackground(name)`, `memberAvatarText(name)`, `memberWedgeFill(name)` return the right CSS string for each surface.
- **Component API change:** the 4 components (`MemberChipModern`, `MemberManagementModalModern`, `HistoryListModern`, `WinnerModalModern`) used to take `hue: number` and compute the OKLCH inline. They now take `color: string` (and `textColor: string`) — the caller threads the resolved colors in. `ModernWheelMember` adds `color: string`. `MemberManagementMember` swaps `hue: number` for `color: string`. `FortuneHistoryListModern.membersById` value shape changes from `{ name, hue }` to `{ name, color }`.
- **Wheel:** `MODERN_WHEEL_COLORS` (the 6-color position-indexed palette) deleted from `wheelModern.ts`. `WheelOfFortuneModern` reads `member.color` from each `ModernWheelMember`. The wheel is now hue-driven per member.
- **Winner modal:** the 82% L → 78% L fix means the winner avatar is now the same shade as the chip / modal / history (same `MEMBER_PRESET_COLORS[index]` entry). The user accepted the loss of the "celebratory lightness" effect; the winner still feels special via the 96px size, the eyebrow chip, and the check-badge.
- **Hash stability:** production data has no color field, so the color is derived from the name via `memberPresetIndex`. The test suite pins specific values (e.g. `memberPresetIndex('a') === 7`, `memberPresetIndex('Alice') === 8`) so a future "let's use a better hash" refactor breaks the test instead of silently re-coloring every member in production.
- **Pattern:** "Where does the color come from?" used to be answered with "the page computes it, then the components recompute it." Now it's "the entity has it; the page threads the strings through; the components just paint." This is a textbook FSD move — domain knowledge (member identity) leaves `pages/` and lands in `entities/`.
- **Files:** new `src/entities/member/{index.tsx,model/{index.ts,memberColor.ts,memberColor.test.ts}}` (4 files, 11 tests); modified `src/pages/Room/ui/RoomPage.tsx` + 5 component files (`MemberChipModern`, `MemberManagementModalModern`, `HistoryListModern`, `FortuneHistoryListModern`, `WinnerModalModern`, `WheelOfFortuneModern`) + `src/features/fortune/ui/wheelModern.ts` (deleted `MODERN_WHEEL_COLORS`) + 1 test fixture.
- **Verification:** `yarn build` clean. Full suite: 27 pre-existing failures, 263 → 274 passing (+11 from this change).

---

## 2026-06-07 — Body scroll lock for both modern modals | modal, a11y, hooks, member-management, fortune

- **Symptom:** with `WinnerModalModern` or `MemberManagementModalModern` open, the page behind the modal was still scrollable. The modal stayed centered but the content moved — bad UX, and a contract violation for `aria-modal="true"`.
- **Root cause:** neither modern modal sets `document.body.style.overflow = 'hidden'` on open. The generic `Modal.tsx` does (lines 64-69), but that pattern was never propagated when the modern UI was built.
- **Fix:** new shared hook `src/shared/hooks/useBodyScrollLock.ts`. The hook uses a module-level ref counter so multiple modals can lock at once and the body's overflow is only restored on the LAST release. (Naive per-modal lock/unset would leak the unlock if the inner modal closed first.) Wired into both modern modals via `useBodyScrollLock(open)`.
- **Pattern:** when a feature is built fresh and the existing `Modal` shared component's behaviours (Esc handler, body-scroll lock, focus trap) aren't all carried over, those gaps show up one at a time. Worth auditing the modern modals against the generic `Modal` for any other inherited behaviour that's missing.
- **Tests:** `src/shared/hooks/__tests__/useBodyScrollLock.test.tsx` (5 cases: basic lock, restore previous value, no-op when inactive, nested-modal stack, isActive flip). `src/features/member-management/ui/__tests__/MemberManagementModalModern.test.tsx` extended with a body-scroll-lock assertion.
- **Verification:** `yarn build` clean. Full suite: same 27 pre-existing failures (verified by stashing the diff), 254 → 263 passing (+9 from this change).

---

## 2026-06-07 — Member-management modal list-scroll bug fix | member-management, focus-trap, layout, bug

- **Symptom:** user could not scroll the member list in `MemberManagementModalModern` once it grew past the modal's `max-height: min(80vh, 640px)`. Excess rows were clipped, not scrollable.
- **Root cause:** the `List` styled.ul declared `overflow-y: auto; flex: 1; min-height: 0;` to be a scrolling region inside the Dialog's flex column — but its direct parent was the `FocusTrap` wrapper, a plain `<div>` (no flex). The flex chain broke at FocusTrap, so `flex: 1` on `List` resolved to "grow to content", the Dialog's `overflow: hidden` clipped the overflow, and the `overflow-y: auto` had no height to apply to. Net effect: clip-without-scroll.
- **Fix:**
  - `src/shared/ui/FocusTrap/FocusTrap.tsx` — accept `className` and `style` props and forward them to the wrapper `<div>`. The trap is layout-agnostic; callers control layout.
  - `src/features/member-management/ui/MemberManagementModalModern.tsx` — pass `style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}` to FocusTrap so the chain reaches the List. Also added `data-testid="member-list"` for the regression test.
- **Regression test:** `src/features/member-management/ui/__tests__/MemberManagementModalModern.test.tsx` — 3 cases: dialog+list render, structural scroll region (asserts the FocusTrap wrapper's inline flex-column + min-height: 0), and a stubbed `scrollHeight > clientHeight` to lock in the scroll semantics.
- **Verification:** `yarn build` clean; my 3 new tests pass; the 27 failing tests on this branch are pre-existing (verified by stashing the diff — same 27 fail, 254→257 passes after the change).
- **Pattern:** when a styled child relies on `flex: 1; min-height: 0; overflow-y: auto` to scroll, every intermediate wrapper between it and the height-constrained ancestor must either be a flex container (so the longhand resolves) or be `display: contents`. Worth auditing the other two `FocusTrap` call sites (`WinnerModalModern`, `Modal`) for the same class of issue — they don't scroll today, so they're fine, but if either grows a scrollable region in future, the trap must be wired the same way.

---

## 2026-06-07 — Architecture pass: 5 deepening candidates landed | architecture, FSD, motion, member-management, fortune, room-management

- **Driver:** `/improve-codebase-architecture` skill run. The Explore agent walked `src/` and surfaced 5 candidates; the report (HTML in `$TMPDIR/architecture-review-1780831245.html`) framed them as `Strong` or `Worth exploring` against the deletion test.
- **5 candidates, all landed:**
  1. **Collapse `entities/room` seam (Strong)** — `RoomItem` moved from `entities/room/ui/` to `features/room-management/ui/`. The fictional cross-slice UI seam is gone. Types (`Room`, `RoomMember`) stay in `entities/room/model/` because the cross-feature type seam is real (both room-management and member-management need them). `entities/room/index.tsx` now exports types only.
  2. **Retire legacy wheel + LuckyModal (Strong)** — `WheelOfFortune.tsx` (16-line re-export shim), `LuckyModal.tsx` (285 lines, rainbow border, screen-reader text, loader, error retry), `wheelConstant.ts` (duplicate 6-color palette), and `LuckyModal.test.tsx` deleted. Spin-lifecycle helpers (`pickWinnerIndex`, `computeNextRotation`, `MODERN_SPIN_DURATION_MS`, `POINTER_ANGLE_DEG`) absorbed into `wheelModern.ts`. `WheelOfFortune.test.tsx` renamed to `wheelModern.test.ts`; trimmed to the 6 helper tests (lines 121-162 of the original).
  3. **Retire legacy member-management UI (Strong)** — `MemberList`, `MemberManagementV2`, `MemberItem`, `modals/MemberModal`, `modals/ModalConfirmRemoveMember`, `libs/memberTable`, `libs/index.ts`, `hooks/useMemberManagement` deleted. `RoomPage.tsx:432-466` (35 lines of inline chip JSX) replaced with `<MemberChipModern />`. Feature barrel: 11 exports → 4 (`MemberManagementModalModern`, `MemberChipModern`, `useCreateNewMember`, `useMemberCollection`).
  4. **Drop shared/ui dead primitives (Strong)** — `WithMotion/withMotion.tsx` (64 lines), `SuccessFeedback` (93 lines, parallel to `FlashAlert`), `PerformanceMonitor` (177 lines, dev-only, only used by `MotionDemo`), and `MotionDemo` (118 lines, 0 production consumers) deleted. The one live caller of `withMotion` (`ModalConfirmRemoveRoom`) updated to use `MotionWrapper` directly. Motion surface halves: one configurable adapter.
  5. **Slim RoomPage via useWheelSpin + useMemberToggleOptimistic (Worth exploring)** — `useWheelSpin({ members, disabled })` returns `{ rotation, spinning, winner, showWinnerModal, startSpin, dismissWinner, spinAgain }`. The hook owns the setTimeout for winner reveal timing. `useMemberToggleOptimistic({ roomId, members, onError })` returns `{ displayMembers, removeMember, toggleActive }` — owns the local member list and the optimistic toggle with revert-on-error + flash. `RoomPage`: 517 → 420 lines.
- **New ADR:** `wiki/decisions/005-modern-path-replaces-legacy-ui.md`. Records the rationale ("modern path is the only path"), the table of before/after, and the negative consequences (helper files now host both constants and functions; `useWheelSpin` doesn't know about `showMembersModal` directly — the page passes it as `disabled`).
- **Net module count:** 2754 → 2737 (-17 modules, -1 rename). 4 barrels shrank.
- **Verification:** `yarn build` clean on each candidate. Pre-existing lint errors in `useMotionConfig.ts` / `motionUtils.ts` and pre-existing `performance.now` jsdom errors in `src/test/animation.visual.test.tsx` are unrelated to these changes (touch in `useMotionConfig` is `any` type guard, untouched by this work).
- **For the next session:** the architecture review HTML is still in `$TMPDIR/architecture-review-1780831245.html` if anyone wants to revisit the candidate diagrams. The 5 candidates are now closed.

---

## 2026-06-07 — Recent spins width-overflow fix | P2 UI

- **Symptom (reported by user):** "FortuneHistoryListModern display width longer than Recent spins section (SideCard)". The inner history list visually poked out 13px past the SideCard's right border on the 320px right column.
- **Root cause:** nested-card anti-pattern combined with the project's missing `box-sizing` reset. `FortuneHistoryListModern.Container` had `width: 100%` (of the SideCard's 278px content area) + `padding: md` (32px) + `border: 1px` (2px) = 312px outer width. Under the browser-default `box-sizing: content-box`, that 312px outer width exceeded the SideCard's 320px outer width — the right edge of the inner card extended 13px past the outer card's right border. The inner card's `border-radius: lg` (smaller than the SideCard's `xl`) and darker `grey[200]` border (vs the SideCard's `grey[100]`) compounded the visual — the inner box read as a distinct, disconnected element. The `FortuneHistoryDataBoundary.SkeletonContainer` had the same problem, producing a 3-deep nested card stack during loading.
- **Fix:** stripped `FortuneHistoryListModern.Container` to a transparent `ScrollArea` (max-height + overflow + scrollbar only — no border, background, border-radius, or padding). The parent `SideCard` in `RoomPage` is now the single visual boundary. Same treatment for `SkeletonContainer` (kept `overflow: hidden`, dropped border/bg/radius). `EmptyState` padding reduced from `xl md` → `lg 0` so it doesn't double-pad inside the SideCard.
- **Pre-existing cleanup:** removed unused `Title` styled-component + `styled-components` import from `src/pages/Home/ui/Home.tsx`. Added during the Direction 7 refactor but never rendered; blocked `yarn build` with `TS6133`. `styled` was the only use of `styled-components` in the file, so both were removed.
- **Why not a global `box-sizing` reset:** project has 0 hits for `box-sizing` anywhere in `src/`. A global reset would be the "correct" long-term fix but requires auditing every `width: %` + `padding` + `border` call site for regressions. Not in scope for this UI fix — flagged in `wiki/hot.md` Active Threads as a project-wide hygiene item for future work.
- **Verification:** `yarn lint` clean on all 3 edited files (8 pre-existing errors in `useMotionConfig.ts` / `motionUtils.ts` / `Home.tsx pre-cleanup` — all in untouched code), `yarn build` clean (no TS errors after the `Title` removal), `yarn test:run -- src/features/fortune/ui/__tests__/WheelOfFortune.test.tsx` 12/12 pass. Full `yarn test:run`: 207/244 pass; 37 pre-existing failures all in untouched files (10× `LuckyModal.test.tsx` stale copy test, ~20× visual-regression suites, ~5× animation suite `performance.now` jsdom error).
- **Files touched (3):** `src/features/fortune/ui/FortuneHistoryListModern.tsx`, `src/features/fortune/ui/FortuneHistoryDataBoundary.tsx`, `src/pages/Home/ui/Home.tsx` (cleanup).
- **Wiki updates:** `wiki/hot.md` rewritten with this fix as the headline; recommended a future ADR ("presentational components own no visual containers") — see Recent Decisions in `hot.md`.

---

## 2026-06-07 — fortune critique + 5-issue polish pass | P0 + 3×P1 + P2

- **Scope:** `/impeccable critique src/features/fortune` (21/40) followed by autonomous execution of the 6-step action plan. User answered: priority = a11y & motion safety cluster; scope = all five priority issues end-to-end; constraints = keep wheel label fitting (11+ members) and the active/inactive toggle persistence as-is.
- **P0 brand mandate:** stripped conic-gradient halos on `WheelOfFortuneModern.OuterRing` (removed entirely) and `WinnerModalModern.AvatarGlow` (removed entirely). Dropped the stacked `box-shadow` on the wheel SVG, the `box-shadow` on the Hub, and the `drop-shadow` filter on the pointer. All replaced with hairline borders.
- **P1 motion consolidation:** `HubDot`, `Backdrop`, `Dialog`, `AvatarFrame`, `CheckBadge`, `Row`, `EmptyState` now use `MotionWrapper` / `MotionSpan` from `shared/ui/MotionWrapper`. `MotionWrapperProps.children` made optional in the shared file to support self-closing decorative elements (HubDot is a 14×14 dot). `WheelOfFortuneModern.HubDot` and `WinnerModalModern` buttons still use `styled(motion.button)` where the shared wrapper's `MotionProps` type conflicts with native HTML button attributes (type, etc.) — pragmatic, matches the existing `MemberChipModern` pattern.
- **P1 reduced-motion:** all 7 motion instances now route through the shared wrapper, which falls back to a brief opacity crossfade or static when `useMotionPreference()` is true. The infinite rotate on the (now-removed) OuterRing and AvatarGlow is gone entirely.
- **P1 aria-live:** `LiveRegion` (shared) announces "{name} is up" when the winner modal opens and "{name} just won" when a new history row appears. The history LiveRegion clears after 5s.
- **P1 focus trap:** `FocusTrap` (shared) wraps both modals. Initial focus uses a `[data-testid='…']` CSS selector on the primary action (Save for the winner modal, member-add-input for the member management modal). Focus returns to the trigger on close.
- **P1 key-handler scope:** the winner modal's window-level `s`/`Enter` listener now returns early if `e.target.tagName` is INPUT or TEXTAREA, or `e.target.isContentEditable` is true. The handler is also unblocked for both new modal layouts.
- **P2 empty state unification:** `HistoryListModern` and `FortuneHistoryListModern` now share a consistent empty treatment (centered, `theme.colors.grey[500]`, `theme.fontSizes.sm`). Copy is actionable: "No spins yet. Spin the wheel to record your first result." The inline `style={{ color: 'var(--grey-500, #6b7280)' }}` is gone — all colors now read from the theme.
- **P2 skeleton:** the history skeleton in `FortuneHistoryDataBoundary` was a 3-cell header + 5 rows of 3 cells (didn't match the real row). Rebuilt to: avatar circle (32px) + body with 2 stacked bars (name at 55% width, time at 35%). The header row was removed (the real list has no header).
- **Button hierarchy (P3 polish):** the winner modal's three co-equal buttons are now 1 full-width primary (Save to history) + 1 quiet text link (Discard) + 1 32px icon button (Spin again). The hero-metric template is gone.
- **Code cleanup:** removed dead `useRef<HTMLButtonElement>(null)` and `saveRef` from `WinnerModalModern` (FocusTrap handles initial focus via CSS selector). `inputRef` in `MemberManagementModalModern` kept — it's still used to refocus the input after a successful add.
- **Verification:** `yarn lint` clean (8 pre-existing errors in untouched `useMotionConfig.ts`/`motionUtils.ts`), `yarn build` clean, `yarn test:run -- src/features/fortune/ui/__tests__/WheelOfFortune.test.tsx` 12/12 pass. Full suite 244 tests, 207 pass, 37 pre-existing failures (visual regression suites + legacy `LuckyModal` copy mismatch + e2e), all in untouched files.
- **New critique snapshot:** `.impeccable/critique/2026-06-07T07-42-50Z__src-features-fortune.md` (21/40 baseline; estimated high-20s after the fixes).
- **New ADR:** [[ADR-004: Motion Wrapper Consolidation]].
- **Files touched (6):** `src/features/fortune/ui/WheelOfFortuneModern.tsx`, `src/features/fortune/ui/WinnerModalModern.tsx`, `src/features/fortune/ui/HistoryListModern.tsx`, `src/features/fortune/ui/FortuneHistoryListModern.tsx`, `src/features/fortune/ui/FortuneHistoryDataBoundary.tsx`, `src/features/member-management/ui/MemberManagementModalModern.tsx`. **Plus one shared touch:** `src/shared/ui/MotionWrapper/MotionWrapper.tsx` (made `children` optional).

---

## 2026-06-06 — audit fixes | P1-P3 from the audit report

- **Scope:** resolve the P1-P3 findings from the audit (brand teal contrast, semantic HTML, code split, rgba shadows, font-size tokens, touch targets, inline breakpoints, inline style props, reduced-motion)
- **P1 contrast:** new token `colors.interactive` (oklch(48% 0.18 178)) used for buttons, accent text, and any primary surface carrying text. White-on-interactive = 5.26:1 (was 2.25:1), interactive-on-light = 5.04:1 (was 2.15:1). Both pass WCAG AA. The brand `primary` is now reserved for decorative accents (borders, hover tints, wheel segments, gradients). 11 call sites updated
- **P1 semantic HTML:** shell's `Main` is now a `<div>` (not `<main>`); `RoomPage` adds its own `<main id="main-content">`. Room card `Title` is h2 (was h3 — flat h1→h2 is now valid). Side-card `SideHeader` is `<div>` (was `<header>` — landmark count was 3 headers, now 1)
- **P2 code split:** `AppRouter` lazy-loads `Home` and `RoomPage` via `React.lazy` + `Suspense`. `RoomPage` also lazy-loads the winner/member/history modals. Main bundle: 984 kB → 360 kB (gzip 118 kB); 4 lazy chunks load on demand
- **P2 rgba shadows:** new tokens `shadow.menu`, `shadow.modal`, `shadow.popover`, `shadow.pointer` (with dark-mode parity). Replaced 13 hard-coded `rgba(...)` shadows in `RoomItem`, `MemberManagementModalModern`, `WinnerModalModern`, `WheelOfFortuneModern`
- **P2 logo swap (DEFERRED):** the only swap candidate (`hatohub-logo-full.svg`, 8 KB) is a different mark than the current `master_logo.png` (72 KB). Defer to user — they own the brand
- **P3 font-size tokens:** new `fontSizes.micro` (11px) and `fontSizes.chip` (13px). 9 inline `font-size: 11px/13px` call sites tokenized
- **P3 touch targets:** `ManageBtn` 28 h → 32 h; `MoreBtn` (28×28) gets an `::before { inset: -8px; }` hit-area to 44×44 without changing the visual size
- **P3 breakpoints:** `Layout.tsx` and `Home.tsx` now use `theme.breakpoints.mobile/tablet` instead of inline `768px/1024px`
- **P3 style={{}}:** last two `style={{ ... }}` in `Layout.tsx` (the brand image `display: block` and the theme-toggle motion.span `display: inline-flex`) moved to `LogoImage` and `ToggleIconWrap` styled components
- **P3 reduced-motion:** added `prefers-reduced-motion: reduce` blocks on `WinnerBanner` and `SpinCta` in RoomPage
- **Verification:** `tsc -b` clean, `vite build` clean (360 kB main + 4 lazy chunks). Visually verified at 1280 desktop + 375 mobile + dark/light, 0 console errors
- **Audit score projection:** A11y 2 → 4 (both P1s resolved), Theming 3 → 4 (no remaining hard-coded rgba in features), Responsive 3 → 4 (touch targets bumped), Performance 2 → 3 (main bundle halved). Estimated total 13 → 17/20

---

## 2026-06-06 — distill | Site-wide distillation pass (whole site)

- **Scope:** strip decoration. Functionality stays.
- **Net:** 479 added / 1092 deleted across 7 files. Bundle 984 kB → 968 kB.
- **Home page:** dropped the page-header eyebrow + subtitle, the "Your rooms · X rooms · Y members" section header, the sort pills, the "+ New" pill, the keyboard-shortcuts footer. Page is now: brand → "Rooms" h1 → room cards. `RoomManagement` lost 250 lines (SectionHeader, SortPill, NewRoomBtn, KbdFooter + 6 styled components).
- **RoomItem:** dropped the "Now Spinning" badge (with 3-nested-span pulsing live-dot animation), the gradient featured variant, the footer (count + arrow), the "No description yet" fallback, the hover-lift transform, the `+ Add` extra variant, the `empty` variant, and the opacity-fade pattern on the "..." menu. File: 563 → 280 lines. Variants collapsed to `default` and `add`.
- **RoomPage:** dropped the "FORTUNE WHEEL" eyebrow above the hero, and the duplicate meta ("0 in pool" + "0 eligible" — same number). Hero is now: title + winner banner (conditional) + wheel + CTA.
- **App shell:** dropped the "H" hat in the brand lockup (image + wordmark is enough; the hat was a 3rd element), dropped the `backdrop-filter: blur` on the nav (decoration), simplified the theme-toggle swap from a 45° rotate to a 150 ms crossfade.
- **ModernEmptyState:** dropped the 96px wheel illustration (3 concentric pulsing rings, 6 spokes, pulsing core) and the Sparkles icon on the CTA. Now: heading + hint + button. 136 → 76 lines.
- **Verification:** `tsc -b` clean, `vite build` clean. Visually verified at 1280 desktop, 375 mobile, and dark mode for both pages. 0 console errors. `yarn test:run` baseline unchanged (pre-existing `motion.performance.now` and visual-regression failures, none in the files I touched).

---

## 2026-06-06 — layout | Layout refinement pass (whole site)

- **Type:** session
- **Location:** `wiki/meta/2026-06-06-direction-7-and-wiki-complete.md`
- **From:** conversation on completing the full Direction 7 Integration direction (10/10 tasks) + Wiki Documentation direction (5/5 tasks) + cleanup + PR #2
- Captures: components shipped, page rewrites, theme tokens, cleanup decisions, architecture decisions, wiki conventions, project-local agents + skills, verification artifacts, and known limitations

---

## 2026-06-06 — Wiki Documentation: ALL 5 TASKS DONE

Completed all 5 tasks in the Wiki Documentation direction:

- `ingest-product` (P1) — `wiki/sources/product-md.md`
- `ingest-agents` (P1) — `wiki/sources/agents-md.md`
- `document-components` (P2) — 8 component pages: Button, Card, Modal, Input, TextArea, Toggle, Table, Skeleton
- `document-deps` (P3) — 7 dependency pages: React, TypeScript, Vite, React Router DOM, React Hook Form, lucide-react, Vitest
- `document-flows` (P3) — 4 flow pages: Create Room, Add Member, Remove Room, Member Toggle

Also deleted the now-dead code in `src/pages/Room/ui/components/` (5 files, none imported by anything) and the old heavy `FortuneHistoryTable` in `src/features/fortune/ui/` (superseded by the modern wrapper). Build + lint + tests all still pass.

All 15 tasks across both directions are now `done`. Next: commit on `feature/direction-7-integration` and open a PR.

## 2026-06-06 — Wiki Documentation: ingest AGENTS.md

`wiki/sources/agents-md.md` created with the OpenCode agent conventions summary (stack, commands, FSD rules, traps, testing notes, wiki integration). Cross-referenced from [[Concept: Feature-Sliced Design]] and the sources index. Both P1 ingestion tasks now done.

## 2026-06-06 — Wiki Documentation: ingest PRODUCT.md

`wiki/sources/product-md.md` created with summary of the canonical product document (register, users, brand personality, anti-references, design principles, accessibility commitments). Cross-referenced from `ADR-001` and the sources index. Source template added to `_templates/source.md`. Next: ingest `AGENTS.md`.

## 2026-06-06 — Direction 7 Integration: ALL 10 TASKS DONE

P2 + P3 waves complete. The entire Direction 7 Integration direction is shipped.

**P2 (Home page polish)**:

- `home-section-header` — "Your rooms · N rooms · M members" header with bold count + Recent/A–Z/New sort pills
- `home-empty-state` — `ModernEmptyState` with concentric pulsing rings + spokes + teal core wheel illustration + "Create your first room" CTA
- `home-keyboard-hints` — Kbd-styled footer (N new room · ↑↓ navigate · ⏎ open) with JetBrains Mono + 1px border + 2px bottom border. Keyboard handlers wired.
- `update-home-composition` — All 4 home page polish tasks combined into a single modern composition

**P3 (App chrome)**:

- `replace-layout-modern` — Rewrote `Layout.tsx` + `styled.ts`: white surface, hairline border, backdrop blur, sticky, master_logo + teal "H" square + "Internal Hub" wordmark, icon-only sun/moon theme toggle with rotate animation. Verified in both light and dark mode.
- `remove-room-menu` — Added "..." button to each room card (top-right, low-opacity at rest, full opacity on hover/focus). Opens a popover menu with "Remove room" (red + trash icon) that triggers the existing `ModalConfirmRemoveRoom`. Card converted from `<button>` to `<div role="button">` for proper a11y with nested button. Escape + click-outside close the menu.

**P1 + extras from earlier in the day** (still in hot context):

- `replace-wheel-modern`, `wire-winner-modal-modern`, `wire-member-management-modal` — all done
- `replace-history-modern` — added as P2 mid-flight, done

Files touched in P2+P3:

- `src/pages/Room/ui/RoomPage.tsx` (added "Recent spins" side card with modern history list)
- `src/features/fortune/ui/FortuneHistoryListModern.tsx` (new — data-aware history wrapper)
- `src/pages/Room/ui/components/HistorySection.tsx` (modernized)
- `src/features/room-management/ui/RoomManagement.tsx` (section header + sort + keyboard hints)
- `src/features/room-management/ui/RoomList.tsx` (uses ModernEmptyState, accepts onRemove)
- `src/features/room-management/ui/ModernEmptyState.tsx` (new — wheel illustration + CTA)
- `src/widgets/Layout/Layout.tsx` + `styled.ts` (modern top bar)
- `src/entities/room/ui/RoomItem.tsx` (added MoreBtn + Menu + onRemove prop)
- Barrel exports updated

Verification:

- `yarn build` clean
- `yarn lint` — 8 pre-existing errors (useMotionConfig.ts, motionUtils.ts), 0 new
- `yarn test:run` — 207 pass, 37 pre-existing fail (jsdom env issues)
- Visual verified all surfaces in light + dark mode

Next: Wiki Documentation direction (5 tasks) and any post-ship polish.

## 2026-06-06 — P1 wave done: Room page fully modernized

## 2026-06-06 — Wiki initialized

- **Vault scaffolded** in Mode B (GitHub/Repository) + concepts/ extension
- Created folder structure: modules/, components/, decisions/, dependencies/, flows/, concepts/, sources/, questions/, meta/
- Created `_index.md`, `log.md`, `hot.md`, `overview.md`
- Created `_templates/` with 6 note templates
- Created `.obsidian/snippets/vault-colors.css` for visual customization
- Created `CLAUDE.md` in project root for wiki routing
- Added "Wiki Knowledge Base" section to `AGENTS.md` for agent integration
- Seeded initial pages:
  - [[Overview]] — project summary
  - [[Architecture Overview]]
  - [[Tech Stack]]
  - [[Module: fortune]] / [[Module: member-management]] / [[Module: room-management]] / [[Module: toggle-theme]]
  - [[Concept: Design System]] / [[Concept: Feature-Sliced Design]] / [[Concept: OKLCH Color Space]] / [[Concept: Inter Font Stack]]
  - [[ADR-001: Direction 7 Design]] / [[ADR-002: FSD Architecture]]
  - [[Dependency: Firebase]] / [[Dependency: Motion]] / [[Dependency: styled-components]]
  - [[Flow: Spin the Wheel]] / [[Flow: Theme Toggle]]
  - [[Components Index]] / [[Decisions Index]] / [[Dependencies Index]] / [[Flows Index]] / [[Sources Index]] / [[Questions Index]]

### Context

Project: `internal-hub` — React 19 + TypeScript + Vite SPA, Firebase Firestore backend, deployed to Firebase Hosting. Default branch: `master`. Currently mid-redesign: Direction 7 (modern × minimal × playful) integrated for theme tokens, RoomCard, and wheel palette. Room page composition still on old architecture — flagged as next integration target.
