---
type: dependency
name: 'Vitest'
version: '3.2.4'
status: active
risk: low
alternatives: ['Jest', 'Mocha', 'uvu', 'node:test']
tags: [dependency, testing, test-runner]
created: 2026-06-06
updated: 2026-06-06
---

# Dependency: Vitest

## What It Is

A Vite-native test runner. Same config (vite.config.ts), same module resolution, same transform pipeline. Jest-compatible API (`describe` / `it` / `expect` / `vi.mock`).

## Why We Use It

- **Same config as Vite** — path aliases, plugins, etc. all carry over.
- **Fast** — uses Vite's transform pipeline, parallel test workers.
- **Jest API** — team familiarity.
- **jsdom environment** — for React component tests.

## Version

`^3.2.4` (caret)

## Risk

**Low** — mature, well-maintained.

## Configuration

- `vitest.config.ts` extends Vite config + adds test globals + jsdom env.
- `src/test/setup.ts` mocks browser APIs (`matchMedia`, `ResizeObserver`, `IntersectionObserver`, `CSS.supports`).
- Visual regression tests live in `src/test/*.test.tsx` and use `renderWithTheme` from `src/test/visualRegressionUtils.tsx`.

## Commands

- `yarn test` — watch mode
- `yarn test:run` — CI mode, single pass
- `yarn test:ui` — browser-based UI
- `yarn test:run -- <file>` — run a specific test file

## Current State

- **207 tests pass** as of 2026-06-06.
- **37 tests fail** — all pre-existing issues in `src/test/animation.visual.test.tsx` (jsdom `performance.now` not available) and a few other env-specific failures. Not regressions.
- **2 uncaught exceptions** during teardown of the animation test (same jsdom env issue).

## Alternatives Considered

- **Jest** — would require duplicate config, slower.
- **Mocha + Chai** — older, more manual.
- **node:test** — too low-level for component testing.
- **uvu** — fast but no first-class React support.

## Upgrades

- [ ] Track Vitest 3.x patch releases
- [ ] Consider `vitest --coverage` for CI (not yet enabled)

## Related

- [[Source: AGENTS.md]] — verification order is `lint` → `build` → `test:run`
- [[Dependency: Vite]] — shares config
- [[Tech Stack]]
