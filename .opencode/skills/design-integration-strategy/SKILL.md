---
name: design-integration-strategy
description: "When a new design is approved (typically from a preview route), integrate it into the production codebase in a phased order: theme tokens → primitive components → composite components → modals. Each phase is independently shippable and never touches production code until the new component is fully proven. Prevents 'big-bang redesign' failures."
---

# Design Integration Strategy

When a new design has been approved (typically built in a preview route per the `preview-route-builder` skill), the wrong move is to do a "big-bang redesign" — replace everything at once. The right move is to integrate in a phased order where each phase is independently shippable and reverts cleanly.

## Why This Order

- **Theme tokens first** — every styled component picks up the new look for free. Instant visual win.
- **Primitive components next** — Card, Button, Modal. These are the building blocks.
- **Composite components after** — RoomCard, MemberItem, WheelOfFortune. These compose primitives.
- **Modals last** — WinnerModal, MemberManagementModal. These are surface-level; they depend on everything else.

Each phase is independently testable. You can stop after any phase and have a working app. You can also roll back any phase without breaking the others.

## When to Use

- A new design has been approved (preview route screenshot + user signoff)
- The production app's existing components use the old design
- You want to ship the new design safely, with each step testable

## When NOT to Use

- The change is a small visual tweak (just edit production directly)
- The project is greenfield (no production code to migrate)
- The user wants a "big-bang" redesign (high-risk, but sometimes appropriate)

## The 5 Phases

### Phase 1: Theme tokens

**What**: Replace the core token system with the new design.

**Files**:

- `src/shared/styles/config/colors.ts`
- `src/shared/styles/config/light.ts`
- `src/shared/styles/config/dark.ts`
- `src/shared/styles/config/borderRadius.ts`
- `src/shared/styles/globalStyle.ts` (font, body styles)

**Approach**:

1. Write the new token values to a fresh file (e.g. `colors.ts`)
2. Keep the API the same — same `Color` interface, same field names
3. Replace the production file with the new one in one diff
4. Don't touch any component yet
5. Run `yarn lint && yarn build && yarn test:run` — should still pass

**Result**: Every styled component in the app automatically picks up the new colors, fonts, and radius. The layout structure is unchanged, but the visual is fresh.

**Verification**: Open the app. Take screenshots of every page. Compare to the preview. Note any components that look broken (wrong color, wrong text size).

### Phase 2: Promote primitive components

**What**: Move the preview's primitive components (Card, Button, Modal, Input) into production, replacing the old ones.

**Files**:

- `src/shared/ui/{Card,Button,Modal,Input,...}/`

**Approach**:

1. Identify which preview components are "primitive" (no business logic, just visual)
2. Move them from `src/pages/Preview/ui/components/` to `src/shared/ui/`
3. Keep the API stable — same props, same imports
4. The old component file becomes a thin re-export of the new one (so external imports don't break)
5. Test every page that uses the component

**Result**: Visual updates to the primitives propagate to every page. Cards, buttons, and modals look new.

**Verification**: Walk through every page. Confirm each primitive looks right in light + dark. Confirm focus states, hover states, disabled states.

### Phase 3: Promote composite components

**What**: Move the preview's composite components (RoomCard, MemberItem, WheelOfFortune, etc.) into production.

**Files**:

- `src/entities/room/ui/RoomItem.tsx` (or wherever the old component lives)
- `src/features/{fortune,member-management,room-management}/ui/`

**Approach**:

1. Move the preview component to its production location
2. Update props to match the production data shape (e.g. `Room` type from the entity, not mock data)
3. Wire to the real Firebase hooks (use `useActiveRooms`, not local mock state)
4. Update `index.ts` to re-export the new component, deprecate the old
5. Test with real data

**Result**: The page surfaces (room list, member list, wheel) look new. The data flow is unchanged.

**Verification**: Open real rooms. Test add/remove/toggle interactions. Confirm animations work. Confirm the data persists to Firestore.

### Phase 4: Replace modals

**What**: Move the preview's modals (WinnerModal, MemberManagementModal) into production.

**Files**:

- `src/features/fortune/ui/LuckyModal.tsx` (replace with WinnerModalModern)
- `src/pages/Room/ui/components/MembersModal.tsx` (replace with MemberManagementModalModern)
- The pages that open them

**Approach**:

1. Move the modal to its production location
2. Wire to real data: `createFortuneHistoryEntry`, real member list
3. Update the parent page to manage modal state
4. Test the full flow: open modal, interact, close, data persists

**Result**: All modals look new. The user flow (spin → save → history updates) is complete.

**Verification**: Test the full spin-and-save flow. Test discard. Test spin-again. Test member toggle active/inactive.

### Phase 5: Modernize the app chrome

**What**: Replace the top bar, sidebar, navigation, and other persistent app surfaces.

**Files**:

- `src/widgets/Layout/Layout.tsx`
- `src/widgets/Layout/styled.ts`

**Approach**:

1. Replace the top bar composition
2. Add backdrop-filter blur (if used)
3. Test sticky positioning, theme toggle
4. Test responsive behavior

**Result**: The persistent app chrome looks new. Theme toggle is modern.

**Verification**: Scroll on every page. Confirm the top bar stays sticky and looks right.

### Phase 6: Polish the home page

**What**: Add the section header, empty state, keyboard hints — the small polish details that make the design feel finished.

**Files**:

- `src/pages/Home/ui/Home.tsx`
- The room-management feature files

**Approach**:

1. Add the section header with member count + sort pill
2. Add the empty state with illustration + CTA
3. Add the keyboard hints footer
4. Add the "..." menu for remove room (if it was removed in Phase 3)
5. Test all keyboard shortcuts

**Result**: The home page feels complete. No "rough edges" or "TODO: this should look better".

**Verification**: Test the empty state. Test the keyboard shortcuts. Test the remove flow.

## After All Phases

1. Delete the preview folder (`src/pages/Preview/`)
2. Remove the preview routes from `AppRouter.tsx`
3. Remove the preview-specific theme (if separate from production)
4. Update the wiki:
   - Mark the direction as `completed`
   - Mark all tasks as `done`
   - Update `hot.md` with the new state
5. Run `yarn lint && yarn build && yarn test:run` one more time
6. Take final screenshots for documentation

## Risk Mitigation

Each phase should be in its own commit. If a phase breaks something:

- **Phase 1 break**: revert the token file. The app goes back to the old look. Nothing else is affected.
- **Phase 2 break**: revert the primitive component. The new theme is still in place; only the primitive looks old.
- **Phase 3 break**: revert the composite component. The primitives are new, but the composite is old. Still better than nothing.
- **Phase 4 break**: revert the modal. The rest of the app is new.
- **Phase 5 break**: revert the layout. The page content is new.
- **Phase 6 break**: just remove the polish additions. The base is working.

Always use git branches for each phase. Don't merge until each phase is verified.

## What If the User Wants Big-Bang?

If the user says "just do it all at once", explain the risk:

- A big-bang is higher risk (everything breaks if anything breaks)
- A phased rollout is lower risk (each step is independently testable)
- A big-bang is harder to roll back (you'd have to revert everything)

Then ask: "Are you OK with the risk?" If yes, do big-bang. If no, do phased.

## Common Pitfalls

- **Don't skip the test pass.** Each phase needs `yarn lint && yarn build && yarn test:run` clean. Skip at your peril.
- **Don't touch unrelated files.** Phase 1 is tokens only. Phase 2 is primitives only. Don't "while I'm here" refactor other code.
- **Don't break the data flow.** Phases 3 and 4 should preserve the existing Firebase hooks and props. The user shouldn't notice any backend changes.
- **Don't keep preview code in production.** After Phase 6, delete `src/pages/Preview/`. Don't leave it as a "reference".

## Example: The internal-hub Integration

The `internal-hub` project followed this exact pattern across multiple sessions:

- **Phase 1** (theme tokens): replaced `colors.ts`, `light.ts`, `dark.ts`, `borderRadius.ts`, `globalStyle.ts` with OKLCH versions
- **Phase 2** (composite): promoted `RoomCardModern` to `src/entities/room/ui/RoomItem.tsx`, kept the old component as a thin re-export during migration
- **Phase 3** (wheel palette): replaced the 18-color rainbow in `wheelConstant.ts` with the 6-color OKLCH palette
- **Removed**: the `src/pages/Preview/` folder, the `/preview/*` routes, the `shared/styles/config/modern/` folder

The remaining phases (winner modal, member management modal, top bar, home page polish) are still in the [[Direction: Direction 7 Integration]] direction in the wiki.

## Related Skills

- `design-direction-explorer` — picks the direction
- `preview-route-builder` — builds the experimental version
- `oklch-design-tokens` — the tokens to use in Phase 1
