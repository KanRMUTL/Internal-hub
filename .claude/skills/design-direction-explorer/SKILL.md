---
name: design-direction-explorer
description: "When starting a design refresh, modernization, or 'redesign' task, present 6+ distinct aesthetic directions as real-world aesthetic families with named references. The user picks one, then you go deep. This prevents single-design lock-in and the AI-slop trap."
---

# Design Direction Explorer

When the user says "redesign", "modernize the look", "refresh the design", or you're starting a design system from scratch — don't propose one design. Propose 6+ distinct aesthetic directions as **named aesthetic families** with real-world references. Let the user pick before you go deep.

## Why This Works

- **One design is a guess. Six designs is a survey.** The user knows their domain better than you do.
- **Named references beat abstract adjectives.** "Editorial-tech (Linear)" means something; "modern and clean" means nothing.
- **Each direction is a _family_, not a palette swap.** Different geometry, motion language, type logic, and personality beat.
- **Survives the AI-slop test.** The user can immediately see which directions are the AI-default reflex ("cream/sand body bg", "identical card grids", "eyebrow on every section").

## When to Use

- Starting any design exploration (redesign, new visual system, "make it look modern")
- The user is undecided about visual direction
- The project has no design system or the existing one is a mess
- You need to differentiate from common AI-generated design defaults

## When NOT to Use

- The user already has a strong direction and just wants you to execute
- The change is a small visual tweak (color, spacing, type size) — not a full direction
- You're working on a single component, not a system

## The Procedure

### 1. Read the project context first

Don't ask the user what the project is — read the codebase, PRODUCT.md, AGENTS.md. The directions should be specific to the project's register.

### 2. Generate 6+ distinct aesthetic families

For each direction, specify:

- **Aesthetic family name** with a real-world reference (e.g. "Editorial-tech (Linear)", "Dimensional-spatial (Raycast)")
- **Type logic** (one family vs paired, fixed scale vs fluid, display weight presence)
- **Color strategy** (restrained vs committed vs drenched)
- **Geometry** (radius scale, border treatment, shadow presence)
- **Motion language** (instant vs gentle vs choreographed, single beat vs many)
- **Signature** — the one thing that makes it THIS direction
- **Best for** — what register it suits
- **Anti-tells to avoid** — the cliché that would make it look like AI-generated

The 6 should be **genuinely different from each other**, not palette swaps. Different type systems, different geometries, different motion grammars.

### 3. Present as a table for comparison

```
| Direction | Type | Density | Motion | Brand usage | Reference |
```

Plus a one-paragraph "what's this about" for each.

### 4. Ask the user to pick (one question)

Use the harness's structured question tool. Lead with the inferred best fit. Include an "explore more options" or "hybrid" option if the user wants to mix.

### 5. After the user picks, ask 2-3 follow-up questions

- Must-keep elements (famous feature, color, mechanic)
- Scope (whole-website, page-by-page, or component)
- Anything that must NOT change

### 6. Build a visual sample

Don't just describe. Build one real component in the chosen direction and screenshot it. Then refine.

## Example: The 6 Aesthetic Families

These are the lanes the AI-default reflex falls into. Name them and beat them.

1. **Editorial-tech** (Linear, Vercel docs)

   - Type does the work. Monochrome + single accent. Dense, hairline borders.
   - Best for: power users, dense data, focus
   - Anti-tells: gradient accents, big shadows, big radius

2. **Dimensional-spatial** (Raycast, Arc)

   - Dark-first, layered panels, command-palette interactions
   - Best for: keyboard-driven speed, "OS in a window"
   - Anti-tells: full glassmorphism, glow decoration

3. **Warm-object** (Things 3, Bear)

   - Light-first, soft neutrals, committed brand surface, gentle motion
   - Best for: daily-use delight, "favorite app" feel
   - Anti-tells: cream/sand body bg (2026 AI default), identical card grids

4. **Terminal-native** (Wave, Coolors CLI)

   - Mono UI, dark, dense, no easing curves
   - Best for: developer credibility
   - Anti-tells: terminal cosplay (green-on-black), fake ASCII art

5. **Datalab** (Datadog, Honeycomb)

   - Tables-first, hairline rules, info density, tabular nums everywhere
   - Best for: engineering credibility, admin surfaces
   - Anti-tells: card grids, big shadows, "consumer app" softness

6. **Neo-brutalist** (Vercel, Geist, Linear marketing)

   - Sharp corners, no shadows, white/black, teal as structural block
   - Best for: current 2026 default for dev tools, opinionated products
   - Anti-tells: doing it with rounded corners + shadows and calling it brutalist (the discipline IS the look)

7. **Modern × Minimal × Playful** (the lane that won for internal-hub)
   - One font, fixed modest scale, one moment of brand color per surface, hairline borders, single playful beat
   - Best for: internal tools that need to feel friendly without being childish
   - Anti-tells: more than one playful beat, "delight" overload

The 7th is the lane that won for the `internal-hub` project (see `wiki/decisions/001-direction-7-design.md`). It's a hybrid of Editorial-tech's restraint and Things 3's personality.

## What to Avoid in the 6

- **No palette swaps.** All 6 use the same brand color but differently is one direction. They must differ on type, geometry, and motion.
- **No "AI-default" lanes.** Cream/sand body bg, identical card grids, eyebrow on every section, "delight" overload, gradient text, glassmorphism — these are the tells, not the lanes.
- **No abstract adjectives.** "Modern and clean" means nothing. "Editorial-tech (Linear)" means something.

## After the Pick

1. Write a one-line design principle ("one moment of brand color per surface")
2. List the absolute bans (side-stripe borders, gradient text, glassmorphism as default, hero-metric template, identical card grids, numbered section markers, tiny uppercase tracked eyebrow on every section)
3. Build the preview
4. Take screenshots in both light and dark
5. Show side-by-side with the AI-slop reflex to confirm differentiation

## Reference

For the full 7-direction exploration that produced Direction 7, see the `wiki/decisions/001-direction-7-design.md` ADR in any project that has a wiki. The ADR documents the chosen direction, the 6 rejected, and the concrete moves.
