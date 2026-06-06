# Product

## Register

product

## Users

Internal team members at the company. They use the hub for standups, design crits, retros, and ad-hoc "who's up next?" decisions. The wheel-of-fortune replaces the awkward "who wants to present?" moment in meetings.

## Product Purpose

A lightweight, internal-only web app that gives teams a shared "fortune wheel" for picking members at random. Each room has its own wheel drawing from a member list. The active room is highlighted, and history of every spin is preserved.

## Brand Personality

- Calm, not flashy
- Confident in restraint (one teal moment per surface, never more)
- The wheel itself is the personality — restrained chrome around a colorful core
- Plays well in a meeting: readable across the room, not distracting

## Anti-references

- Generic SaaS dashboards (Linear, Stripe, Vercel) — too sterile, no personality
- Consumer app "delight" (Headspace, Notion confetti) — too playful for an internal tool
- 18-color "rainbow" wheel — feels like a 2010s marketing site

## Design Principles

- One moment of brand color per surface. The teal earns a place; it doesn't dominate.
- Restraint is the feature. Hairline borders, no shadows, no gradients.
- The wheel is the only place saturated color lives. Everything else is teal-tinted neutrals.
- Empty states teach the interface. Loading states hint at structure, not spinners.
- Light + dark parity is non-negotiable. The teal is the same brand in both.

## Accessibility & Inclusion

- WCAG AA: body text ≥ 4.5:1, large text ≥ 3:1, body ink never pure black/white
- `prefers-reduced-motion` respected on every animated property
- Keyboard-first: every modal has ⏎/S/Esc shortcuts, every action has a `aria-label`
- Tabular nums on counts, OpenType stylistic sets on Inter
- Focus rings use brand color, not browser default
