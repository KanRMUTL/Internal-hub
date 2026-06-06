---
type: dependency
name: 'Motion'
version: '^12.9.2'
status: active
risk: low
alternatives: ['Framer Motion (deprecated)', 'react-spring']
tags: [dependency, animation]
created: 2026-06-06
updated: 2026-06-06
---

# Dependency: Motion

## What It Is

[Framer Motion](https://motion.dev/) was renamed to **Motion** in 2024. Same library, same API. This project imports from `motion/react`.

## Why We Use It

- The richest gesture + layout + animation library for React
- `AnimatePresence` handles exit animations cleanly (CSS can't)
- Spring physics are declarative; no manual easing curves
- `whileHover` / `whileTap` integrate with React event handlers

## Risk

**Low**. Stable API, large community, performance-focused (uses transforms + opacity by default).

## Configuration

No central config — used per-component via:

```tsx
<motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
```

Reduced-motion fallbacks are inline in the styled-components CSS.

## Key Utilities

- `AnimatePresence` — exit animations
- `motion.button`, `motion.div`, `motion.svg` — animated elements
- `useAnimationControls` — imperative triggers (rarely used here)
- `LayoutGroup` — shared layout transitions (not currently used)

## Related

- [[Module: fortune]] — `WheelOfFortune` uses `motion.svg`
- [[Concept: Design System]] — motion tokens
