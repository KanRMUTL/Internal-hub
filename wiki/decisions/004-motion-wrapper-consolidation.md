---
type: decision
id: ADR-004
status: accepted
date: 2026-06-07
deciders: [impeccable-polish-pass]
tags: [architecture, motion, a11y, design-system]
---

# ADR-004: Motion Wrapper Consolidation

## Context

The fortune feature was importing `motion` directly from `motion/react` in five files and instantiating two competing motion patterns:

- ad-hoc `styled(motion.div)` / `styled(motion.svg)` / `styled(motion.span)` for visual flourishes
- ad-hoc `styled(motion.li)` / `styled(motion.div)` for entry transitions

Per `CLAUDE.md` (and the `[[Concept: Design System]]` doctrine), animations should route through the shared wrappers at `src/shared/ui/MotionWrapper/` and `src/shared/ui/WithMotion/`. These wrappers:

- automatically respect `useMotionPreference()` for `prefers-reduced-motion`
- give a single source of truth for the project's motion language (defaults, easings, durations)

Beyond the architectural drift, the direct `motion` usage meant **none** of the flourishes respected `prefers-reduced-motion`. The `[[Module: fortune]]` critique at 21/40 flagged seven instances where the infinite halos, pulses, and stagger animations ignored the system preference.

## Decision

**Features use `MotionWrapper` / `MotionSpan` from `shared/ui/MotionWrapper` for visual flourishes.** The underlying `motion` import is reserved for primary animation logic that doesn't compose with styled-components (specifically, the wheel's `motion.svg` primary rotation).

### Mapping

| Pattern                                                                                     | Replacement                                                                                                       |
| ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `styled(motion.div)` with `initial`/`animate`/`transition` (backdrop, dialog, avatar frame) | `styled(MotionWrapper).attrs({ as: 'div' })`                                                                      |
| `styled(motion.li)` for row entry stagger                                                   | `styled(MotionWrapper).attrs({ as: 'li' })`                                                                       |
| `styled(motion.span)` for self-closing decorative elements (hub dot)                        | `styled(MotionSpan)`                                                                                              |
| `styled(motion.button)` for buttons with native HTML attributes                             | **keep** (the shared wrapper's `MotionProps` type conflicts with `type="button"`, `form`, etc.)                   |
| `styled(motion.svg)` for the wheel's primary rotation                                       | **keep** (the shared wrapper doesn't compose with styled-components for SVG; this is the wheel's reason to exist) |

### Why not extend the shared wrapper to accept native HTML attributes?

We tried. `MotionWrapperProps` extends `MotionProps`; adding `HTMLAttributes<HTMLElement>` causes name collisions on `style`, `onLoad`, `onAnimationStart`, etc. Excluding them all is brittle and fragile. The pragmatic split (shared wrapper for flourishes, `motion` for primary + buttons) is consistent with the existing `MemberChipModern.tsx` pattern in the codebase.

### Why is `MotionWrapperProps.children` optional?

The wheel's `HubDot` is a self-closing decorative element (a 14×14 colored dot, no content). `React.FC` requires `children` by default. Making it optional in the interface accommodates self-closing elements; if `children` is undefined, `{undefined}` renders nothing inside the motion wrapper, which is the intended behavior for a decorative element.

## Consequences

**Positive:**

- Single source of motion truth (one place to tune easings, durations, defaults).
- All flourishes now respect `prefers-reduced-motion` automatically.
- Easier to grep: `MotionWrapper` shows up everywhere animation lives.
- New flourishes get reduced-motion handling for free.

**Negative / accepted:**

- Two motion import patterns coexist (shared wrapper + `motion` for primary). Documented above; matches the existing codebase pattern.
- `MotionWrapper`'s `MotionProps` defaults (`initial={{ scale: 0.5, opacity: 0 }}` etc.) sometimes need to be explicitly overridden via props.
- The shared wrapper doesn't compose with styled-components for SVG; the wheel's `motion.svg` is the only direct import in the modernized surface.

## Implementation

Touched in the 2026-06-07 fortune polish pass. See [[2026-06-07 — Fortune Critique + Polish Pass]].

Files: `src/shared/ui/MotionWrapper/MotionWrapper.tsx` (made `children` optional), `src/features/fortune/ui/WheelOfFortuneModern.tsx`, `src/features/fortune/ui/WinnerModalModern.tsx`, `src/features/fortune/ui/HistoryListModern.tsx`, `src/features/fortune/ui/FortuneHistoryListModern.tsx`.
