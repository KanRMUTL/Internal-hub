---
type: source
title: 'AGENTS.md'
source_path: 'AGENTS.md'
ingested: 2026-06-06
tags: [source, agents, conventions, fsd, wiki]
---

# AGENTS.md — Source Summary

The compact guide for OpenCode (or any coding agent) working in this repo. Defines the **stack, commands, FSD rules, traps, testing notes, and wiki integration** for any agent that touches the code.

## Project Identity

- **Name:** `internal-hub` — React 19 + TypeScript + Vite SPA, Firebase Hosting (`internal-hub-1b94e`).
- **Domain:** wheel-of-fortune + member/room management, backed by Firestore.
- **Default branch:** `master` (not `main`).
- **Long-form docs:** `.doc/project_documentation.md`, `.kiro/steering/{product,structure,tech}.md`.

## Stack Quick-Reference

- React 19, TypeScript 5.7 (strict), Vite 6
- styled-components 6, Motion (Framer Motion successor), lucide-react
- React Router DOM 6.30.0 (pinned — do not upgrade without checking React 19 compat)
- React Hook Form, dayjs, lodash, react-use
- Firebase 11 (Firestore only — no Auth, no Storage wiring in app code)
- Vitest 3 + jsdom + @testing-library/react

## Commands (Yarn)

| Task             | Command         |
| ---------------- | --------------- |
| Dev server       | `yarn dev`      |
| Production build | `yarn build`    |
| Lint             | `yarn lint`     |
| Format           | `yarn format`   |
| Tests (watch)    | `yarn test`     |
| Tests (CI)       | `yarn test:run` |
| Tests (UI)       | `yarn test:ui`  |
| Preview build    | `yarn preview`  |

**Verification order after a change:** `yarn lint` → `yarn build` (this also typechecks via `tsc -b`) → `yarn test:run`.

## Architecture: Feature-Sliced Design (FSD)

Strict unidirectional layers in `src/`. **Lower layers must never import from upper layers.**

```
src/
├── app/         # Providers, global routing
├── pages/       # Route components
├── widgets/     # Composite UI blocks (only Layout/ exists)
├── features/    # Business features: fortune, member-management, reactions, room-management, toggle-theme
├── entities/    # Business entities: fortune-result, room
├── shared/      # UI kit, hooks, config (firebase.ts), styles, assets
└── test/        # Test setup, visual regression, cross-browser utils
```

Every feature/entity has: `ui/`, `hooks/`, `services/`, `model/`, `config/`, `index.ts` (barrel). Export only through barrels.

## Path Aliases

`vite.config.ts` and `tsconfig.json` define these — use them, not relative paths:
`src`, `app`, `widgets`, `pages`, `features`, `entities`, `shared`

## Traps & Quirks (READ THESE)

1. **Default branch is `master`.** PRs and CI trigger on `master`. Don't base off `main`.
2. **Pre-commit is partially broken.** TSLint is deprecated; husky pre-commit will fail on staged `.ts` files. Use `yarn lint` / `yarn build` / `yarn test:run` for actual verification.
3. **Duplicated env files.** `.env` (placeholders) and `.env.local` (real keys) are both tracked. There's also a non-dot `env.local` at the repo root — appears to be a mistake; do not propagate.
4. **Empty scaffold dirs.** `design-system/{components,patterns,theme,tokens}/` exist but are empty. Do not add code there.
5. **`dist/` is a build artifact.** Already in `.gitignore`; don't commit.
6. **Firebase is initialized at module load** in `src/shared/config/firebase.ts`. If env vars are missing, the app fails to render.
7. **Two lockfiles.** `yarn.lock` is the source of truth. Do not run `npm install`.

## Testing Notes

- Vitest config at `vitest.config.ts`; setup at `src/test/setup.ts` (mocks `matchMedia`, `ResizeObserver`, `IntersectionObserver`, `CSS.supports`).
- Use `renderWithTheme` from `src/test/visualRegressionUtils.tsx` for themed components.
- Visual regression, animation, accessibility, and cross-browser suites live in `src/test/*.test.tsx`. Run with `yarn test:run -- <file>` for tight feedback.
- Cross-browser matrix: `docs/cross-browser-testing-guide.md`.

## Wiki Integration

**Read order for any task:**

1. `wiki/hot.md` — ~500-word snapshot of most recent context (read this first)
2. `wiki/overview.md` + `wiki/_index.md` — project summary + master catalog (~1.5k tokens)
3. Drill into specific pages: `wiki/modules/`, `wiki/decisions/`, `wiki/concepts/`, `wiki/dependencies/`, `wiki/flows/`

**Do NOT read the wiki for:** general coding questions, things in `AGENTS.md` already, tasks unrelated to the project.

## Conventions

- Styled-components with `$`-prefixed transient props (`$isActive`).
- Animations go through shared wrappers in `src/shared/ui/MotionWrapper` and `WithMotion`.
- Accessibility primitives (`LiveRegion`, `ScreenReaderOnly`, `FocusTrap`, `SkipLinks`) live in `src/shared/ui/`.
- Feature flags / toggles are encouraged — incomplete work should not affect production.
- **Project-local skills** are in `.opencode/skills/` (6 skills, scoped to this project).
- **Project-local agents** are in `.opencode/agents/` (4 agents).

## Cross-References

- [[Concept: Feature-Sliced Design]] — the layer rules in detail
- [[Hot Cache]] — current snapshot of what's happening
- [[Overview]] — one-paragraph project summary
- [[Architecture Overview]] — the codebase structure
- [[Tech Stack]] — versions, why these choices
- [[Module: fortune]] / [[Module: member-management]] / [[Module: room-management]] / [[Module: toggle-theme]] — the features
- [[Dependency: Firebase]] / [[Dependency: Motion]] / [[Dependency: styled-components]] — external libs
- [[Tasks Index]] / [[Directions Index]] — multi-agent coordination
