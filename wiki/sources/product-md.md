---
type: source
title: 'PRODUCT.md'
source_path: 'PRODUCT.md'
ingested: 2026-06-06
tags: [source, product, brand, design, accessibility]
---

# PRODUCT.md — Source Summary

The canonical product-context document for `internal-hub`. It defines **who** the users are, **what** the app does, and **how** it should feel.

## Key Principles

- **Purpose:** lightweight, internal-only web app for picking meeting participants at random via a shared "fortune wheel". Each room has its own wheel drawing from a member list; active rooms are highlighted; every spin is preserved in history.
- **Register:** product. Not marketing. Not consumer.
- **Use case:** standups, design crits, retros, ad-hoc "who's up next?" decisions. The wheel replaces the awkward "who wants to present?" moment.

## Brand Personality

- Calm, not flashy.
- Confident in restraint — **one teal moment per surface, never more**.
- The wheel itself is the personality. The chrome around it should disappear.
- Plays well in a meeting: readable across the room, not distracting.

## Anti-references (what we are NOT)

- **Generic SaaS dashboards** (Linear, Stripe, Vercel) — too sterile, no personality.
- **Consumer-app "delight"** (Headspace, Notion confetti) — too playful for an internal tool.
- **18-color "rainbow" wheel** — feels like a 2010s marketing site.

## Design Principles

1. One moment of brand color per surface. The teal earns a place; it doesn't dominate.
2. Restraint is the feature. **Hairline borders, no shadows, no gradients.**
3. The wheel is the only place saturated color lives. Everything else is teal-tinted neutrals.
4. Empty states teach the interface. Loading states hint at structure, not spinners.
5. Light + dark parity is non-negotiable. The teal is the same brand in both.

## Accessibility & Inclusion

- **WCAG AA minimums:** body text ≥ 4.5:1, large text ≥ 3:1, body ink never pure black/white.
- `prefers-reduced-motion` respected on every animated property.
- Keyboard-first: every modal has `⏎` / `S` / `Esc` shortcuts, every action has an `aria-label`.
- Tabular nums on counts, OpenType stylistic sets on Inter.
- Focus rings use brand color, not browser default.

## Cross-References

- [[ADR-001: Direction 7 Design]] — the design system that operationalizes these principles.
- [[Concept: Design System]] — the tokens, primitives, and patterns.
- [[Concept: OKLCH Color Space]] — the color model that makes the teal reproducible.
- [[Concept: Inter Font Stack]] — the type system behind the OpenType features.
- [[Module: fortune]] — the wheel-of-fortune, the only place saturated color lives.
- [[Page: Home]] — empty state teaches the interface.
- [[Page: Room]] — meeting-room legibility (large wheel, restrained chrome).
- [[Flow: Spin the Wheel]] — the full UX of a single spin, including motion-respect.
