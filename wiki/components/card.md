---
type: component
path: 'src/shared/ui/Card'
status: active
purpose: 'Surface primitive. Wraps content in a rounded, bordered, padded container with optional elevation.'
props:
  - name: 'variant'
    type: "'elevated' | 'outlined' | 'flat'"
    default: 'elevated'
    description: 'elevated = shadow + border. outlined = border only. flat = surface only.'
  - name: 'padding'
    type: 'SpacingKeys'
    default: 'md'
    description: 'Inner padding token.'
  - name: 'radius'
    type: 'BorderRadiusKeys'
    default: 'md'
    description: 'Border radius token.'
  - name: 'clickable'
    type: 'boolean'
    default: 'false'
    description: 'Adds hover lift + cursor pointer.'
  - name: 'as'
    type: 'ElementType'
    default: 'div'
    description: 'Polymorphic root element.'
used_by:
  - '[[Page: Home]] (RoomItem uses Card-like structure)'
  - '[[Module: room-management]]'
tags: [component, surface, container]
created: 2026-06-06
updated: 2026-06-06
---

# Component: Card

The surface primitive. Wraps content in a rounded, padded container. Three variants: elevated (default), outlined, flat. Most modern cards in the app are built directly with styled-components + motion — the modern `RoomItem` in `src/entities/room/ui/RoomItem.tsx` is one such case (it doesn't use this Card, but the patterns are similar).

## Location

`src/shared/ui/Card/`

## Variants

- **elevated** — `background.elevated` surface + 1px border + soft shadow.
- **outlined** — `background.surface` + 1px border, no shadow.
- **flat** — `background.surface`, no border, no shadow. For nested cards.

## Visual States

- **Default** — surface fill + border.
- **Hover (when `clickable`)** — translateY(-2px) + shadow upgrade.
- **Active (when `clickable`)** — translateY(0).
- **Focus** — focus-visible brand-color ring.

## Notes

- `clickable` is a hint to the styling layer, not a real button role. Wrap in a `<button>` for keyboard accessibility.
