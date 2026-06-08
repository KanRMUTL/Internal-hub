# AGENTS.md

Compact guide for OpenCode (or any coding agent) working in this repo. Read this before touching code.

## What this repo is

`internal-hub` — React 19 + TypeScript + Vite SPA, deployed to Firebase Hosting (`internal-hub-1b94e`). Wheel-of-fortune + member/room management, backed by Firebase Firestore. Default branch: **`master`** (not `main`).

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
├── features/    # Business features: fortune, member-management,
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

- **Onboarding / architecture overview:** `wiki/overview.md` (or `.doc/project_documentation.md` for the long-form original)
- **Product scope & user flows:** `wiki/overview.md` (or `.kiro/steering/product.md`)
- **Stack & commands (canonical):** `wiki/` module pages (or `.kiro/steering/tech.md`)
- **Layer rules & naming:** `wiki/concepts/feature-sliced-design.md` (or `.kiro/steering/structure.md`)
- **Design system tokens:** `wiki/concepts/design-system.md`
- **Routing & entrypoint:** `src/app/App.tsx`, `src/app/routes/AppRouter.tsx`, `src/main.tsx`
- **Firebase config & env vars:** `wiki/dependencies/firebase.md` + `src/shared/config/firebase.ts` + `.env`
- **CI deploy flow:** `.github/workflows/firebase-hosting-{merge,pull-request}.yml`
- **Code intelligence / graph queries:** `.claude/skills/gitnexus/` (local skills; prefer `gitnexus_query` / `gitnexus_context` / `gitnexus_impact` over raw grep when investigating cross-file impact)

## Wiki Knowledge Base (multi-agent shared context)

This project has a wiki vault that serves as the **centralized context hub** for every agent working on it. Multiple agents share the same project knowledge by reading from the wiki.

**Location**: in the project root (`wiki/`, `.raw/`, `_templates/`, `CLAUDE.md`)

**Read order for any task**:

1. `wiki/hot.md` — ~500-word snapshot of most recent context (read this first)
2. `wiki/overview.md` + `wiki/_index.md` — project summary + master catalog (~1.5k tokens)
3. Drill into specific pages: `wiki/modules/`, `wiki/decisions/`, `wiki/concepts/`, `wiki/dependencies/`, `wiki/flows/`

**Do NOT read the wiki for**:

- General coding questions or language syntax
- Things already in this `AGENTS.md` or in the conversation context
- Tasks unrelated to this project

**When you make a change that should be remembered**:

- Update `wiki/hot.md` (~500 words) with the key new fact
- Add to `wiki/log.md` (append at the TOP)
- Update the relevant `wiki/modules/` or `wiki/decisions/` page
- If a major decision, create a new ADR in `wiki/decisions/` using `_templates/decision.md`

See `CLAUDE.md` in the project root for the full wiki conventions.

## Conventions worth preserving

- Styled-components with `$`-prefixed transient props (e.g., `$isActive`) — don't pass non-DOM props to underlying elements without `$`.
- Animations go through shared wrappers in `src/shared/ui/MotionWrapper` and `WithMotion` — don't import `motion` ad-hoc in features.
- Accessibility primitives (`LiveRegion`, `ScreenReaderOnly`, `FocusTrap`, `SkipLinks`) live in `src/shared/ui/`. Use them; don't reinvent.
- Feature flags / toggles are encouraged (per `.doc/project_documentation.md` §2.1) — incomplete work should not affect production.

## Project-Local Skills (`.opencode/skills/`)

This project has 6 project-local skills in `.opencode/skills/`. These are scoped to `internal-hub` — they won't appear in other projects. Use them when the trigger matches.

| Skill                                           | Use when                                                                                                    |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `.opencode/skills/design-direction-explorer/`   | Starting a design refresh, "redesign X", or "modernize the look" — present 6+ distinct aesthetic directions |
| `.opencode/skills/preview-route-builder/`       | Need to show a new design in isolation without touching production — build `/preview/[name]`                |
| `.opencode/skills/oklch-design-tokens/`         | Building or modernizing a design system — how to author tokens in OKLCH                                     |
| `.opencode/skills/design-integration-strategy/` | A new design is approved — phased rollout: tokens → primitives → composites → modals → chrome               |
| `.opencode/skills/multi-agent-task-tracker/`    | Multiple agents (or humans) working on the same project — directions + tasks + file-locks                   |
| `.opencode/skills/wiki-scaffold-mode-b/`        | Setting up a wiki for a developer project — Mode B structure (modules/, components/, decisions/, etc.)      |

The skills encode the patterns that worked during the Direction 7 redesign + wiki scaffold. They're grounded in real work done in this repo.

## Project-Local Agents (`.opencode/agents/`)

This project has 4 specialist agents in `.opencode/agents/`. They are scoped to `internal-hub` only and will not appear in other projects. Use the `Task` tool to spawn them; they will pre-load only the wiki pages they need and hand off work outside their scope to other agents.

| Agent                                 | Use when                                                                                                                                                                                      | Pre-loads                                                                                                                                               |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.opencode/agents/wiki-curator.md`    | "Update the wiki", "sync docs", "reflect this change in the docs". After any significant code change. Does NOT modify code.                                                                   | `wiki/hot.md`, `wiki/_index.md`, `wiki/log.md`, relevant module/concept pages                                                                           |
| `.opencode/agents/design-reviewer.md` | "Review this design", "is this on-brand", "check Direction 7 compliance", before merging any PR that touches `src/shared/ui/`. Does NOT modify code — produces a structured PASS/FAIL report. | `wiki/decisions/001-direction-7-design.md`, `wiki/concepts/design-system.md`, `wiki/concepts/oklch-color-space.md`, `wiki/concepts/inter-font-stack.md` |
| `.opencode/agents/task-runner.md`     | "What should I work on next", "pick a task", "claim a task". Reads `wiki/tasks/`, picks the highest-priority todo, claims it, executes, updates status. Respects file-locks.                  | `wiki/hot.md`, `wiki/tasks/_index.md`, the specific task page, relevant module/concept pages                                                            |
| `.opencode/agents/fsd-architect.md`   | "Is this FSD-compliant", "where should this file go", before merging any PR that adds new files in `src/`. Does NOT modify code — produces a structured PASS/FAIL report.                     | `wiki/concepts/feature-sliced-design.md`, `wiki/decisions/002-fsd-architecture.md`, `AGENTS.md` layer rules section                                     |

### Token economy

Each agent's system prompt explicitly lists which wiki pages to pre-load and which to skip. This keeps each agent's context window focused. The general pattern is:

- Always read `wiki/hot.md` first (~500 tokens)
- Read only the specific page relevant to the task (200-400 tokens)
- Use `grep` for codebase exploration, not file-by-file reading
- Explicitly say "DO NOT read X" for things outside the agent's scope

### Coordination between agents

The agents are designed to hand off work to each other:

- `wiki-curator` maintains docs; if a doc references a new design pattern, it suggests `design-reviewer`
- `design-reviewer` reports issues; fixing them is `task-runner`'s job
- `task-runner` does the work; if a task changes the design system, it suggests `wiki-curator` and `design-reviewer`
- `fsd-architect` reports violations; fixing them is `task-runner`'s job

None of the agents are siloed. They share the wiki as their source of truth and use the task tracker to coordinate.

<!-- gitnexus:start -->

# GitNexus — Code Intelligence

This project is indexed by GitNexus as **Internal-hub** (2359 symbols, 2845 relationships, 9 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Resources

| Resource                                      | Use for                                  |
| --------------------------------------------- | ---------------------------------------- |
| `gitnexus://repo/Internal-hub/context`        | Codebase overview, check index freshness |
| `gitnexus://repo/Internal-hub/clusters`       | All functional areas                     |
| `gitnexus://repo/Internal-hub/processes`      | All execution flows                      |
| `gitnexus://repo/Internal-hub/process/{name}` | Step-by-step execution trace             |

## CLI

| Task                                         | Read this skill file                                        |
| -------------------------------------------- | ----------------------------------------------------------- |
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md`       |
| Blast radius / "What breaks if I change X?"  | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?"             | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md`       |
| Rename / extract / split / refactor          | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md`     |
| Tools, resources, schema reference           | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md`           |
| Index, status, clean, wiki CLI commands      | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md`             |

<!-- gitnexus:end -->
