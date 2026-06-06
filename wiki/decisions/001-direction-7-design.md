---
type: decision
status: accepted
priority: 1
date: 2026-06-06
owner: ''
context: 'Choosing a design language for the modernization of internal-hub.'
tags: [decision, design, adr]
created: 2026-06-06
updated: 2026-06-06
---

# ADR-001: Direction 7 Design

## Status

Accepted. Theme tokens in production. Cards and wheel palette in production. Modal integrations pending.

## Context

The project had a working but unrefined design: bright primary `#00d1b2` used everywhere, 18-color rainbow wheel, no design system, gradient shadow stacks. The brief from the product owner was to "explore a new design" and "redesign the whole website."

Six aesthetic directions were explored. The winner — **Direction 7: Modern × Minimal × Playful** — was selected because:

1. It matches the "internal tool" register (earned familiarity, not marketing showmanship)
2. It has a single moment of personality (the active room's pulsing live-dot, the plus-icon rotation on hover) — not ten
3. It uses the existing brand teal as the anchor, with restrained neutrals tinted toward teal
4. It survives dark mode parity cleanly
5. It passes the AI-slop test: no cream/sand body bg, no glassmorphism, no identical card grids, no gradient text, no numbered section markers on every page

## Decision

Adopt Direction 7 as the production design language.

**Color**: OKLCH palette, teal-led, restrained. Greys tinted toward teal hue at 0.005-0.012 chroma. Brand teal earns one moment per surface; everything else is neutrals.

**Type**: Inter, one family, modest fixed scale, tabular nums on data.

**Geometry**: Hairline 1px borders (no shadows on most surfaces), 4/8/12/20 radius scale, generous spacing.

**Motion**: 250ms ease-out-quart, stagger on mount, single ambient pulse (live indicators), `prefers-reduced-motion` fallbacks.

**Wheel**: 6-color OKLCH palette (teal-led, matched chroma/lightness) instead of 18-color rainbow.

## Consequences

### Positive

- Every styled component in the app picked up the new look automatically (theme swap)
- The brand teal is now used consistently across surfaces
- Dark mode parity is genuine, not an afterthought
- The 6-color wheel reads as a system, not a rainbow

### Negative

- In-progress: Room page composition still uses old `WheelOfFortune` (only the colors are updated)
- In-progress: modals (winner, member management) are still in preview, not production
- Removed UX: "Add Member" / "Remove Room" actions on the Home card (moved to the room page or a future "..." menu)
- Investment: ~2.5 hours of focused work to ship the remaining visible redesign

### Neutral

- Toned-down delight: the playful beat is a single ambient pulse + plus-icon rotation, not bursts of confetti
- Strict typography: no display/body pairing, no second font

## Alternatives Considered

### Direction 1: Editorial-tech (Linear)

Restrained, type-driven, monochrome. Strong but too sterile for the team's daily-driver tool. Lacked any personality beat.

### Direction 2: Dimensional-spatial (Raycast)

Dark-first, layered panels, command palette. Too "OS-in-a-window" for a meeting-room tool.

### Direction 3: Warm-object (Things)

Light-first, soft warm-tinted neutrals, committed brand surface, gentle motion. Highest delight but high risk on a tool that needs to feel serious. Also: warm-tinted neutrals default to AI slop (cream/sand), would need extra care to differentiate from "every AI-generated design."

### Direction 4: Terminal-native

Mono UI, dark, dense. Developer credibility but no warmth. Not appropriate for non-engineers on the team.

### Direction 5: Datalab (Datadog)

Tables-first, hairline rules, info density. Engineering credibility but lacks the wheel's personality moment.

### Direction 6: Neo-brutalist (Geist/Vercel)

Sharp, structural, white/black, teal as block. Current 2026 default for dev tools. Strong, but the "structural honesty" was less interesting than Direction 7's restraint + single playful beat.

## Related

- [[Source: PRODUCT.md]] — the brand personality, anti-references, and design principles this ADR operationalizes
- [[Concept: Design System]]
- [[Concept: OKLCH Color Space]]
- [[Concept: Inter Font Stack]]
- [[Hot Cache]] (integration status)
