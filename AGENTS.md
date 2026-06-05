# AGENTS.md

Compact guide for OpenCode (or any coding agent) working in this repo. Read this before touching code.

## What this repo is

`internal-hub` — React 19 + TypeScript + Vite SPA, deployed to Firebase Hosting (`internal-hub-1b94e`). Real-time multiplayer quiz + wheel-of-fortune + member/room management, backed by Firebase Firestore. Default branch: **`master`** (not `main`).

## Stack quick-reference

- React 19, TypeScript 5.7 (strict), Vite 6
- styled-components 6, Motion (Framer Motion successor), lucide-react
- React Router DOM 6.30.0 (pinned; do not upgrade without checking React 19 compat)
- React Hook Form, dayjs, lodash, react-use
- Firebase 11 (Firestore only — no Auth, no Storage wiring in app code)
- Vitest 3 + jsdom + @testing-library/react

Full architecture lives in `.doc/project_documentation.md` and `.kiro/steering/{product,structure,tech}.md`. **Trust those for design questions; trust this file for traps.**

## Commands

This project uses **Yarn**. CI runs `yarn build`, the steering docs say `yarn dev`, and `yarn.lock` is the canonical lockfile. (`package-lock.json` is also checked in — don't regenerate it; use `yarn` only.)

| Task                                           | Command         |
| ---------------------------------------------- | --------------- |
| Dev server                                     | `yarn dev`      |
| Production build (runs `tsc -b && vite build`) | `yarn build`    |
| Lint                                           | `yarn lint`     |
| Format                                         | `yarn format`   |
| Tests (watch)                                  | `yarn test`     |
| Tests (single run, CI mode)                    | `yarn test:run` |
| Tests (UI)                                     | `yarn test:ui`  |
| Preview built bundle                           | `yarn preview`  |

**Verification order for a completed change:** `yarn lint` → `yarn build` (this also typechecks via `tsc -b`) → `yarn test:run`. All three must pass before claiming done.

Run a single test file: `yarn test:run -- src/test/crossBrowserTesting.test.tsx` (the pattern used in `docs/cross-browser-testing-guide.md`).

## Architecture — Feature-Sliced Design (FSD)

Strict unidirectional layers in `src/`. **Lower layers must never import from upper layers.**

```
src/
├── app/         # Providers, global routing (AppRouter, App.tsx)
├── pages/       # Route components (Home, Room, Lobby, HostScreen, PlayerScreen, etc.)
├── widgets/     # Composite UI blocks (only Layout/ exists today)
├── features/    # Business features: fortune, quiz, member-management,
│                #   reactions, room-management, toggle-theme
├── entities/    # Business entities: fortune-result, room
├── shared/      # UI kit, hooks, config (firebase.ts), styles, assets
└── test/        # Test setup, visual regression, cross-browser utils
```

Every feature/entity typically has: `ui/`, `hooks/`, `services/`, `model/` (or `models/`), `config/`, `index.ts` (barrel). Export only through barrels — don't import internals across slices.

### Path aliases

`vite.config.ts` and `tsconfig.json` both define these. Use them, not relative paths:

`src`, `app`, `widgets`, `pages`, `features`, `entities`, `shared`

## Traps and quirks (read these before assuming defaults)

- **Default branch is `master`.** PRs and CI trigger on `master` and on `pull_request`. Don't base branches off `main`.
- **Pre-commit is partially broken.** `package.json` → `lint-staged` includes `"*.ts": "npx tslint"`. TSLint is deprecated and not installed; expect the husky pre-commit hook to fail on staged `.ts` files. Prettier (`**/*`) works. Don't waste time debugging this unless asked — the rest of the verification flow (`yarn lint`, `yarn build`, `yarn test:run`) is what actually matters.
- **Duplicated env files.** `.env` (placeholders) and `.env.local` (real Firebase keys) are both tracked. There's also a non-dot `env.local` at the repo root with the same content — appears to be a mistake; do not propagate it. Firebase config is read in `src/shared/config/firebase.ts` via `import.meta.env.VITE_FIREBASE_*`. Required env vars listed in `.env`.
- **Page name typo preserved on purpose.** `src/pages/JoinQuizeGame/` is misspelled ("Quize"). Routes and imports use this spelling. Don't rename unless you're also updating the folder, the route, and the barrel exports in one PR.
- **Empty scaffold dirs.** `design-system/{components,patterns,theme,tokens}/` exist but are empty. They are not in use; the design system lives in `src/shared/ui/` and `src/shared/styles/`. Do not add code to `design-system/` without explicit instruction.
- **`dist/` is a build artifact.** Already in `.gitignore`; if it shows up modified, it's a stale local build — don't commit it.
- **Firebase is initialized at module load** in `src/shared/config/firebase.ts`. If env vars are missing, the app fails to render, not just to fetch. Guard when running in unusual environments.
- **Two lockfiles present.** `yarn.lock` is the source of truth (CI uses yarn). Do not run `npm install` — it will create churn in `package-lock.json`.

## Testing notes

- Vitest config at `vitest.config.ts`; setup at `src/test/setup.ts` (mocks `matchMedia`, `ResizeObserver`, `IntersectionObserver`, `CSS.supports`).
- Use `renderWithTheme` from `src/test/visualRegressionUtils.tsx` for components that consume the styled-components theme (light/dark). Don't render bare in `describe` blocks for themed components.
- Visual regression, animation, accessibility, and cross-browser suites live in `src/test/*.test.tsx`. They are heavier than unit tests — run with `yarn test:run -- <file>` to keep feedback loops tight.
- Methodology and supported browser matrix: `docs/cross-browser-testing-guide.md`.

## Where to look first when…

- **Onboarding / architecture overview:** `.doc/project_documentation.md`
- **Product scope & user flows:** `.kiro/steering/product.md`
- **Stack & commands (canonical):** `.kiro/steering/tech.md`
- **Layer rules & naming:** `.kiro/steering/structure.md`
- **Routing & entrypoint:** `src/app/App.tsx`, `src/app/routes/AppRouter.tsx`, `src/main.tsx`
- **Firebase config & env vars:** `src/shared/config/firebase.ts`, `.env`
- **CI deploy flow:** `.github/workflows/firebase-hosting-{merge,pull-request}.yml`
- **Code intelligence / graph queries:** `.claude/skills/gitnexus/` (local skills; prefer `gitnexus_query` / `gitnexus_context` / `gitnexus_impact` over raw grep when investigating cross-file impact)

## Conventions worth preserving

- Styled-components with `$`-prefixed transient props (e.g., `$isActive`) — don't pass non-DOM props to underlying elements without `$`.
- Animations go through shared wrappers in `src/shared/ui/MotionWrapper` and `WithMotion` — don't import `motion` ad-hoc in features.
- Accessibility primitives (`LiveRegion`, `ScreenReaderOnly`, `FocusTrap`, `SkipLinks`) live in `src/shared/ui/`. Use them; don't reinvent.
- Feature flags / toggles are encouraged (per `.doc/project_documentation.md` §2.1) — incomplete work should not affect production.
