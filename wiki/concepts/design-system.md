---
type: concept
status: mature
tags: [concept, design-system, direction-7]
created: 2026-06-06
updated: 2026-06-06
---

# Concept: Design System

The internal-hub design system, codified in [[ADR-001: Direction 7 Design]]. Modern × minimal × playful.

## Core Principles

- **One moment of brand color per surface.** Teal earns a place; it doesn't dominate. Every page, every modal has at most one chroma moment.
- **Restraint is the feature.** Hairline 1px borders, no shadows on most surfaces, no gradients, no glassmorphism.
- **Restrained palette.** Greys are tinted toward the brand teal hue at low chroma (0.005-0.012), not toward warm-by-default.
- **One font family.** Inter (with OpenType stylistic sets: cv11, ss01, ss03), tabular nums on counts.
- **Light + dark parity.** Both modes are first-class. The teal is the same brand hue in both.
- **`prefers-reduced-motion` is non-negotiable.** Every animated property has a no-motion fallback.

## Tokens

| Token                | Light                    | Dark                   |
| -------------------- | ------------------------ | ---------------------- |
| `colors.primary`     | `oklch(72% 0.156 178)`   | `oklch(78% 0.14 178)`  |
| `colors.grey.50`     | `oklch(98.5% 0.004 180)` | `oklch(14% 0.008 180)` |
| `background.primary` | `oklch(98.5% 0.004 180)` | `oklch(12% 0.008 180)` |
| `borderRadius.lg`    | `12px`                   | `12px`                 |
| `borderRadius.xl`    | `20px`                   | `20px`                 |

Full tokens: `src/shared/styles/config/`

## Type Scale

Modest, fixed (no clamp — product UI doesn't need fluid type):

- `xs` 10px · `caption` 12px · `sm` 14px · `base` 16px · `lg` 20px · `xl` 24px · `xxl` 28px · `2xl` 32px · `3xl` 40px

## Motion Tokens

- `fast` 120ms (hover, focus)
- `medium` 180ms (component state changes)
- `slow` 250ms (modals, layout)
- Easings: `easeOut` for most, `easeInOut` for ambient

## Motion Patterns

- **Card hover**: 220ms transition on `border-color` + `transform: translateY(-2px)` + 8px box-shadow
- **Modal entrance**: scale 0.96 → 1 + y 12 → 0, 320ms ease-out-quart
- **Ambient pulse**: 2.2s `scale + opacity` loop on live indicators
- **Stagger**: 40ms delay between siblings in a list

## What's Banned

- Side-stripe borders (`border-left` or `border-right` > 1px as a colored accent)
- Gradient text (`background-clip: text` with gradient)
- Glassmorphism as default
- Numbered section markers (01 / 02 / 03) on every page
- Identical card grids
- Hero-metric template (big number + small label + supporting stats)
- All-caps body copy
- Tiny uppercase tracked eyebrow on every section

## Applied In

- `src/shared/styles/config/` — tokens
- `src/entities/room/ui/RoomItem.tsx` — modern card
- `src/pages/Home/ui/Home.tsx` — uses modern RoomItem
- `src/features/fortune/config/wheelConstant.ts` — 6-color wheel palette

## Related

- [[ADR-001: Direction 7 Design]]
- [[Concept: OKLCH Color Space]]
- [[Concept: Inter Font Stack]]
