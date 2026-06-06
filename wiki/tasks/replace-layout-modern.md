---
type: task
status: done
direction: 'Direction 7 Integration'
priority: 3
owner: 'task-runner'
started: '2026-06-06'
due: ''
depends_on: []
blocks: []
files:
  - 'src/widgets/Layout/Layout.tsx'
  - 'src/widgets/Layout/styled.ts'
tags: [task, direction-7, app-chrome, layout]
created: 2026-06-06
updated: 2026-06-06
---

# Task: Replace production Layout widget (top bar)

## Goal

Replace the production `Layout` widget's top bar with the modern version. Currently the top bar is a heavy blue/black bar with the HatoHub logo and a moon icon. The modern version: subtle teal-tinted surface, backdrop-filter blur, icon-only theme toggle with rotate animation, sticky positioning.

## Acceptance Criteria

- [ ] Top bar uses the Direction 7 visual: off-white surface (light) or near-black (dark), 1px hairline bottom border, backdrop-filter blur
- [ ] Sticky positioning (already in place)
- [ ] Theme toggle: icon-only, sun/moon icon swaps with rotate animation
- [ ] HatoHub logo preserved (it's the brand mark)
- [ ] `yarn lint && yarn build && yarn test:run` all pass
- [ ] Visually verify: top bar feels restrained, not loud

## Files

- `src/widgets/Layout/Layout.tsx` — modernize the top bar composition
- `src/widgets/Layout/styled.ts` — modernize the styled components

## Dependencies

None.

## Blocked By / Blocks

- **Blocked by**: nothing
- **Blocks**: nothing

## Status

- `status`: `todo` | `in-progress` | `blocked` | `review` | `done`
- `owner`: which agent is working on this
- `started`: YYYY-MM-DD when status moved to in-progress
- `due`: YYYY-MM-DD target completion

## Progress Log

- 2026-06-06: Task created during Direction 7 Integration direction scaffold
- 2026-06-06: Done. Rewrote `Layout.tsx` + `styled.ts` for Direction 7. Top bar is now: sticky, hairline 1px border-bottom, surface-tinted, backdrop blur. Logo lockup = master_logo + teal "H" square + "Internal Hub" wordmark (clickable, navigates to `/`). Theme toggle is icon-only with rotate animation between sun/moon. Build clean. Visual verified in both light and dark mode.

## Related

- [[Direction: Direction 7 Integration]]
- [[Concept: Design System]]
