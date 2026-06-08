---
type: concept
status: mature
tags: [concept, design, color]
created: 2026-06-06
updated: 2026-06-06
---

# Concept: OKLCH Color Space

All design tokens in this project use [OKLCH](https://oklch.com/) — not hex, not `rgb()`, not HSL. Why:

## Why OKLCH Over Hex/RGB

- **Perceptual uniformity**: equal numerical changes produce equal perceived changes. `L 0.6` looks the same "amount lighter" regardless of hue.
- **Predictable contrast**: building a 12% darker version of a color is `L 0.72 → L 0.60`, no guessing.
- **Wide gamut**: P3 displays can show colors that don't exist in sRGB; OKLCH specifies the full range.
- **Better greys**: tinting neutrals toward a brand hue (e.g. `oklch(50% 0.012 180)` for a teal-grey) is a single chroma parameter. With hex, you'd hand-pick each grey.
- **Tool-friendly**: every modern color picker (Figma, etc.) supports OKLCH.

## How We Use It

All tokens are OKLCH:

- `colors.primary` = `oklch(72% 0.156 178)` — refined teal
- `colors.grey.500` = `oklch(50% 0.012 180)` — neutral grey, slightly tinted teal
- `background.surface` = `oklch(100% 0 0)` — pure white card

The 4th argument (hue) is fixed near 180° for all neutrals — that's the brand teal hue. We never use warm-tinted greys (the AI-default that "everything should look like beige paper").

## Contrast Verification

Body text uses:

- Light: `oklch(20% 0.012 180)` on `oklch(98.5% 0.004 180)` → ~12:1 contrast
- Dark: `oklch(95% 0.005 180)` on `oklch(12% 0.008 180)` → ~15:1 contrast

Muted text uses:

- Light: `oklch(50% 0.012 180)` on `oklch(98.5% 0.004 180)` → ~4.7:1 (passes WCAG AA 4.5:1)
- Dark: `oklch(65% 0.01 180)` on `oklch(12% 0.008 180)` → ~6:1

## Browser Support

OKLCH is supported in all modern browsers (Chrome 111+, Firefox 113+, Safari 15.4+). No polyfill needed.

## Related

- [[Concept: Design System]]
- [[ADR-001: Direction 7 Design]]
