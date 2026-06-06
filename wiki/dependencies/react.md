---
type: dependency
name: 'React'
version: '19.0.0'
status: active
risk: medium
alternatives: ['Preact', 'Solid']
tags: [dependency, framework, rendering]
created: 2026-06-06
updated: 2026-06-06
---

# Dependency: React

## What It Is

The rendering library. Component-based, declarative, with a virtual DOM and a one-way data flow. React 19 ships with the new compiler, Actions, `use()`, and improved suspense behavior.

## Why We Use It

- Industry standard; large ecosystem.
- React 19's compiler removes the need for manual `useMemo` / `useCallback` in many cases (we don't use them much).
- Concurrent rendering and `useTransition` are useful for the room page's spin flow (avoid blocking the UI while picking a winner).

## Version

`^19.0.0` (caret)

## Risk

**Medium** — React 19 is new. Some libraries lag in compatibility; React Router DOM is pinned to 6.30 specifically for React 19 compat. New APIs (`use()`, Actions) are not yet used in the codebase.

## Configuration

- No special Babel plugin. The compiler is not yet enabled in `vite.config.ts`.
- Strict mode is on by default (via Vite + React plugin).

## Alternatives Considered

- **Preact** — smaller bundle, near-identical API. Rejected because React's ecosystem (testing-library, devtools) outweighs the 30kb saving.
- **Solid** — fine-grained reactivity, very fast. Rejected for the team's familiarity with React patterns.

## Upgrades

- [ ] Track React 19.x patch releases
- [ ] Watch for React 20 (likely mid-2026)
- [ ] Evaluate React Compiler in production when stable

## Related

- [[Source: AGENTS.md]] — pinned React Router DOM is for React 19 compat
- [[Tech Stack]]
- [[Module: fortune]] / [[Module: room-management]] — primary React users
