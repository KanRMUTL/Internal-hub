---
type: concept
status: mature
tags: [concept, design, typography]
created: 2026-06-06
updated: 2026-06-06
---

# Concept: Inter Font Stack

The product uses Inter as the sole font family — no display/body pairing, no system fallback, no second typeface.

## Why One Family

- **One well-tuned sans beats three competing typefaces.** Inter was designed for screens. It has the weight range, hinting, and stylistic sets we need.
- **Consistency beats personality.** Every label, button, heading, and body text reads as the same voice. There are no "display font moments" that feel like a different product.
- **Smaller bundle.** One variable font, ~30KB gzipped, vs ~150KB+ for two typefaces with all weights.

## Configuration

`src/shared/styles/globalStyle.ts`:

```ts
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
font-feature-settings: 'cv11', 'ss01', 'ss03';
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```

- Inter first, system fonts as fallback
- `cv11` (single-storey 'a'), `ss01` (open digits), `ss03` (curved 'l') — stylistic alternates
- Antialiasing for cross-platform consistency

## OpenType Features

- `cv11` — single-storey 'a' (more humanist, less geometric)
- `ss01` — open digits (4 has an open top; 6 has an open loop; 8 has two open loops)
- `ss03` — curved 'l' (distinguishes from 'I' and '1')

These are subtle but reduce ambiguity at small sizes.

## Type Scale

Modest, fixed (no clamp — product UI doesn't need fluid type):

- `xs` 10px · `caption` 12px · `sm` 14px · `base` 16px · `lg` 20px · `xl` 24px · `xxl` 28px · `2xl` 32px · `3xl` 40px

`base` is the body. Anything smaller than `caption` is reserved for tabular data (kbd hints, version stamps).

## Tabular Nums

`font-variant-numeric: tabular-nums` on every count, version number, time, and dollar amount. So `1` and `1` are the same width, and `1,234` aligns with `5,678` in a table.

## Hierarchy via Weight + Size Contrast

- Display heading: 32-40px, semibold, `letter-spacing: -0.025em`
- Section heading: 20-24px, semibold, `letter-spacing: -0.015em`
- Body: 16px, regular (no explicit weight)
- Label / caption: 12-14px, medium, sometimes uppercase + tracked

## What's Not Used

- All-caps body copy (unreadable at body sizes)
- Italic body copy
- Multi-line letter-spacing adjustments
- Variable font weight animation

## Related

- [[Concept: Design System]]
- [[ADR-001: Direction 7 Design]]
