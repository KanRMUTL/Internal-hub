---
type: component
path: 'src/shared/ui/Button/Button.tsx'
status: active
purpose: 'Primary action trigger. Brand-colored button with size + variant + loading + shadow tokens.'
props:
  - name: '$variant'
    type: 'ColorKeys'
    default: 'primary'
    description: 'Theme color key (primary, success, danger, info, warning, etc.) for background.'
  - name: '$size'
    type: "'sm' | 'md' | 'lg'"
    default: 'md'
    description: '32px / 40px / 48px height with matching font + padding.'
  - name: '$rounded'
    type: 'BorderRadiusKeys'
    default: 'md'
    description: 'Border radius token.'
  - name: '$shadow'
    type: 'ShadowKeys'
    default: 'md'
    description: 'Shadow token; escalates on hover.'
  - name: '$fullWidth'
    type: 'boolean'
    default: 'false'
    description: 'If true, button stretches to 100% width.'
  - name: '$loading'
    type: 'boolean'
    default: 'false'
    description: 'Shows a Spinner; sets aria-busy; disables the button.'
  - name: '$loadingText'
    type: 'string'
    default: 'Loading...'
    description: 'Used as aria-label while loading.'
used_by:
  - '[[Module: room-management]]'
  - '[[Module: member-management]]'
  - '[[Module: fortune]]'
  - '[[Page: Home]]'
  - '[[Page: Room]]'
tags: [component, button, action]
created: 2026-06-06
updated: 2026-06-06
---

# Component: Button

The primary action trigger in the app. Brand-colored, sized, and able to enter a loading state. Uses `$`-prefixed transient props to avoid leaking to the DOM.

## Location

`src/shared/ui/Button/Button.tsx`

## Visual States

- **Default** — flat background, current shadow token, brand color text.
- **Hover** — slight scale up, shadow escalates one step, brightness +5%.
- **Focus** — `:focus-visible` adds a brand-color focus ring (theme.shadow.focusVisible).
- **Active** — slight scale down.
- **Disabled** — grey background, grey text, no shadow, cursor not-allowed.
- **Loading** — Spinner replaces content visually; opacity-0 on children; aria-busy=true.

## Used By

Used in every feature that submits a form or triggers an action — see Used By list.

## Notes

- Hover scale uses `getScale('hover')` from `shared/styles/utils` so it respects `prefers-reduced-motion` automatically.
- The `$`-prefixed props are transient (styled-components) and won't be forwarded to the underlying `<button>` element.
