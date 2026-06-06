---
type: component
path: 'src/shared/ui/Skeleton'
status: active
purpose: 'Loading placeholder. Subtle animated block matching the size of the content it represents.'
props:
  - name: 'width'
    type: 'string | number'
    default: "'100%'"
    description: 'Block width (CSS value or px).'
  - name: 'height'
    type: 'string | number'
    default: '16'
    description: 'Block height (CSS value or px).'
  - name: 'radius'
    type: 'BorderRadiusKeys'
    default: 'sm'
    description: 'Border radius token.'
  - name: 'count'
    type: 'number'
    default: '1'
    description: 'If > 1, renders `count` Skeletons stacked vertically with `gap` between them.'
  - name: 'gap'
    type: 'SpacingKeys'
    default: 'sm'
    description: 'Vertical gap between stacked Skeletons.'
used_by:
  - '[[Module: fortune]] (FortuneHistoryDataBoundary uses Skeleton during loading)'
  - '[[Module: room-management]] (RoomCardSkeleton wraps Skeleton for the grid)'
tags: [component, skeleton, loading, a11y]
created: 2026-06-06
updated: 2026-06-06
---

# Component: Skeleton

Loading placeholder. A subtle animated block that pulses between two greys. Designed to match the geometry of the content it represents, so the layout doesn't shift when the real content arrives.

## Location

`src/shared/ui/Skeleton/`

## Accessibility

- `aria-hidden="true"` (skeletons are not real content).
- The parent boundary (`DataBoundary`) sets `aria-busy="true"` while loading and announces state changes to assistive tech.

## Animation

- Pulse uses CSS `animation` with `prefers-reduced-motion: reduce` fallback (animation-duration: 0ms).
- The pulse is purely opacity — no transforms, so it doesn't trigger vestibular motion.
