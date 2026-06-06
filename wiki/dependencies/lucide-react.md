---
type: dependency
name: 'lucide-react'
version: '0.507.0'
status: active
risk: low
alternatives: ['react-icons', 'heroicons', 'phosphor-react', 'custom SVGs']
tags: [dependency, icons]
created: 2026-06-06
updated: 2026-06-06
---

# Dependency: lucide-react

## What It Is

A tree-shakeable React icon set, built from the Lucide icon library. ~1500 icons, all SVG, all customizable via `size` and `strokeWidth` props.

## Why We Use It

- **Tree-shakeable** — only the icons you import are bundled.
- **Consistent stroke** — `strokeWidth={1.75}` and `strokeWidth={2}` are the two values used throughout the app, keeping line weights consistent.
- **Active project** — frequent additions, well-maintained.
- **React-friendly API** — `<IconName size={16} strokeWidth={1.75} />`.

## Version

`^0.507.0` (caret)

## Risk

**Low** — pure presentation, no behavior.

## Configuration

- No global config.
- Convention in this codebase: `size={16}` for default icons, `size={14}` for inline meta, `size={20}` for illustration, `strokeWidth={1.75}` for normal, `strokeWidth={2.25}` for emphasized, `strokeWidth={2}` for default in the new design.

## Alternatives Considered

- **react-icons** — bundles many icon sets; less curated.
- **heroicons** — fewer icons, Tailwind-coded style.
- **phosphor-react** — also great, but Lucide's stroke style matches our Direction 7 design language better.
- **custom SVGs** — used for the master_logo and the HatoHub wordmark; not for UI icons.

## Upgrades

- [ ] Track 0.5xx releases (fast cadence, no breaking changes within 0.5x)

## Related

- [[Concept: Design System]] — icon sizing tokens
- [[Page: Home]] / [[Page: Room]] / [[Layout]] — heavy icon users
- [[Tech Stack]]
