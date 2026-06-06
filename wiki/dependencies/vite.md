---
type: dependency
name: 'Vite'
version: '6.3.1'
status: active
risk: low
alternatives: ['webpack', 'Turbopack', 'Parcel', 'Rspack']
tags: [dependency, build, dev-server]
created: 2026-06-06
updated: 2026-06-06
---

# Dependency: Vite

## What It Is

A frontend build tool and dev server. Vite 6 uses native ES modules in dev for near-instant HMR, and Rollup for production builds. `tsc -b` is run first to typecheck, then Vite handles the actual bundle.

## Why We Use It

- **Fast HMR** — sub-100ms updates during development.
- **Native ESM** in dev — no bundling on save.
- **Rollup-based production builds** — produces a single optimized JS chunk with code splitting.
- First-class TypeScript and CSS support.

## Version

`^6.3.1` (caret)

## Risk

**Low** — Vite is mature. 6.x is the current major.

## Configuration

- `vite.config.ts` — entry point, path aliases, plugin order.
- `vitest.config.ts` — extends Vite config, adds Vitest.
- `build.chunkSizeWarningLimit` is not set; the 500kB warning is informational.
- The 965kB+ main chunk is a known concern (see [[Concept: Feature-Sliced Design]] notes on tree-shaking).

## Alternatives Considered

- **webpack** — slower HMR, more config. Industry default 5 years ago.
- **Turbopack** — Vercel-blessed but still beta as of 2026.
- **Rspack** — Rust-based, faster than webpack but smaller community.
- **Parcel** — zero-config, but harder to customize for our FSD + barrel-export setup.

## Upgrades

- [ ] Track Vite 7 (will likely be Q4 2026)
- [ ] Consider `vite-plugin-pwa` for offline mode

## Related

- [[Source: AGENTS.md]] — `yarn dev` / `yarn build` / `yarn preview`
- [[Tech Stack]]
- [[Dependency: Vitest]] — shares Vite's config
