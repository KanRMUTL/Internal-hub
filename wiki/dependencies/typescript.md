---
type: dependency
name: 'TypeScript'
version: '5.7.2'
status: active
risk: low
alternatives: ['Flow', 'JSDoc + tsc']
tags: [dependency, language, types]
created: 2026-06-06
updated: 2026-06-06
---

# Dependency: TypeScript

## What It Is

Static type checker for JavaScript. Adds optional types, generics, structural inference, and editor support. TypeScript 5.7 ships with improved narrowing and a faster `tsc`.

## Why We Use It

- Catches a class of bugs at edit time, not at runtime.
- `yarn build` runs `tsc -b` before Vite, so type errors fail the build.
- Editor support (IntelliSense, "go to definition", rename refactor) is significantly better with TS.

## Version

`~5.7.2` (tilde — patch only)

## Risk

**Low** — TS doesn't run in production; it's a build-time check.

## Configuration

- `tsconfig.json` defines path aliases (`src`, `app`, `widgets`, `pages`, `features`, `entities`, `shared`).
- `tsconfig.node.json` is for Vite's config files.
- `strict: true` (inherited from `tseslint.configs.recommended`).
- `noUnusedLocals` and `noUnusedParameters` are on — unused vars break the build.

## Alternatives Considered

- **Flow** — historically Meta's alternative. Stagnated.
- **JSDoc + tsc** — types via comments. Rejected for ergonomics.

## Upgrades

- [ ] Track TypeScript 5.8 / 6.0 (no rush — 5.7 is current)
- [ ] Consider `verbatimModuleSyntax` for cleaner ESM output

## Related

- [[Source: AGENTS.md]] — `yarn build` runs `tsc -b`
- [[Concept: Feature-Sliced Design]] — strict path aliases enforced
- [[Tech Stack]]
