# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`internal-hub` — a React 19 + TypeScript + Vite SPA backed by Firebase Firestore. Internal wheel-of-fortune for picking team members in standups/crits. Deployed to Firebase Hosting (`internal-hub-1b94e`).

**Default branch is `master`, not `main`.** PRs and CI both trigger on `master`.

The long-form guide for agents is `AGENTS.md`; product/brand intent is `PRODUCT.md`. This file is the short version + the traps.

## Commands

This project uses **Yarn**. `yarn.lock` is canonical (CI uses yarn). A `package-lock.json` is also checked in — do not regenerate it; never run `npm install`.

| Task                         | Command                                                                |
| ---------------------------- | ---------------------------------------------------------------------- |
| Dev server                   | `yarn dev` (Vite on port 5173)                                         |
| Production build + typecheck | `yarn build` (runs `tsc -b && vite build`)                             |
| Lint                         | `yarn lint`                                                            |
| Format                       | `yarn format`                                                          |
| Unit tests (watch)           | `yarn test`                                                            |
| Unit tests (single run)      | `yarn test:run`                                                        |
| Unit tests (UI)              | `yarn test:ui`                                                         |
| Single unit test file        | `yarn test:run -- src/test/<name>.test.tsx`                            |
| E2E (Playwright, Chromium)   | `npx playwright test` (no yarn script — config auto-starts `yarn dev`) |
| Preview built bundle         | `yarn preview`                                                         |

**Verification gate before claiming a change done:** `yarn lint` → `yarn build` → `yarn test:run`. All three must pass. `yarn build` is the typecheck — there is no standalone `tsc` script.

## Architecture — Feature-Sliced Design (FSD)

Strict unidirectional layers in `src/`. **Lower layers must never import from upper layers.**

```
src/
├── app/         # Providers, routing (App.tsx, routes/AppRouter.tsx)
├── pages/       # Route components (Home, Room)
├── widgets/     # Composite UI blocks (only Layout/ today)
├── features/    # Business features: fortune, member-management,
│                #   reactions, room-management, toggle-theme
├── entities/    # Business entities: fortune-result, room
├── shared/      # UI kit, hooks, config (firebase.ts), styles, assets
├── test/        # Vitest setup + visual/cross-browser test suites
└── e2e/         # Playwright tests, page objects, flow helpers
```

Every feature/entity typically has `ui/`, `hooks/`, `services/`, `model/`, `config/`, and an `index.ts` barrel. **Import only through barrels**; don't reach into another slice's internals.

### Path aliases (use these, not relative paths)

Defined in both `vite.config.ts` and `tsconfig.json`:
`src`, `app`, `widgets`, `pages`, `features`, `entities`, `shared`.

### Composition shape

- `src/main.tsx` mounts `<StrictMode><BrowserRouter><App /></BrowserRouter></StrictMode>`.
- `App.tsx` wraps everything in `ThemeProvider` + `GlobalStyle` + `AppRouter`.
- `AppRouter` lazy-loads `Home` (`/`) and `RoomPage` (`/room/:id`) inside `Layout`.
- `Layout` (`src/widgets/Layout/`) provides the sticky nav and a `PageHeaderContext` so pages can inject custom left/right slots into the nav.
- Firestore handle (`db`) is initialized at module load in `src/shared/config/firebase.ts` from `import.meta.env.VITE_FIREBASE_*`. Missing env vars → the app fails to render, not just to fetch.

## Traps (read before assuming defaults)

- **Branch is `master`.** Don't base branches off `main`.
- **Pre-commit is partially broken.** `package.json` lint-staged config includes `"*.ts": "npx tslint"`, but TSLint is deprecated and not installed; the husky pre-commit hook fails on staged `.ts` files. Prettier (`**/*`) still works. Don't bother debugging unless asked — the real gate is `yarn lint && yarn build && yarn test:run`.
- **Env files are duplicated.** `.env` (placeholder values, tracked) and `.env.local` (real Firebase keys, tracked) both exist. A non-dot `env.local` also exists at root with the same content — appears to be a mistake; do not propagate it.
- **`design-system/{components,patterns,theme,tokens}/` is empty scaffolding.** Not in use. The real design system lives in `src/shared/ui/` and `src/shared/styles/`. Do not add code under `design-system/` without explicit instruction.
- **`dist/` is a build artifact** in `.gitignore`. If it shows up modified, it's a stale local build — don't commit it.
- **Two lockfiles present.** `yarn.lock` is canonical; leave `package-lock.json` alone.
- **React Router DOM is pinned at `6.30.0`.** Don't upgrade without verifying React 19 compatibility.

## Conventions worth preserving

- **Styled-components** use `$`-prefixed transient props (e.g., `$isActive`, `$align`) to avoid leaking non-DOM props through to underlying elements.
- **Animations go through shared wrappers** (`src/shared/ui/MotionWrapper`, `WithMotion`) — don't import `motion` ad-hoc in features. Always respect `prefers-reduced-motion`.
- **Accessibility primitives** (`LiveRegion`, `ScreenReaderOnly`, `FocusTrap`, `SkipLinks`) live in `src/shared/ui/` — use them, don't reinvent.
- **Theming** is light/dark via `features/toggle-theme`. Tokens are in `src/shared/styles/config/{colors,light,dark,spacing,fontSizes}.ts` and consumed through `theme.*` in styled-components.
- **Firestore data shape:** rooms in `room/{id}`, members nested at `room/{id}/members/*`, fortune history at `room/{id}/fortuneHistory/*`. Service modules live in each feature's `services/` directory.

## Testing notes

- Vitest config: `vitest.config.ts`; setup: `src/test/setup.ts` mocks `matchMedia`, `ResizeObserver`, `IntersectionObserver`, `CSS.supports`.
- For themed components, render with `renderWithTheme` from `src/test/visualRegressionUtils.tsx` — bare `render()` won't have a `ThemeProvider`.
- Visual-regression, animation, accessibility, and cross-browser suites are in `src/test/*.test.tsx`. They're heavier than unit tests — invoke individually via `yarn test:run -- <file>` while iterating.
- E2E tests use Playwright + Page Objects in `src/e2e/pages/` and reusable flows in `src/e2e/flows/`. They drive a real Chromium browser; the config auto-spawns `yarn dev` on port 5173 and reuses an existing server in local runs.
- E2E selectors prefer `data-testid` and accessible names (`getByRole`, `getByLabel`) — keep new components labelled.

## Wiki knowledge base (multi-agent shared context)

The `wiki/` folder is the project's shared context hub — multiple agents share project knowledge through it. Use it for **project-specific facts**, not general coding questions.

**Read order for any task touching this codebase:**

1. `wiki/hot.md` — ~500-word snapshot of the most recent context (read first)
2. `wiki/overview.md` + `wiki/_index.md` — executive summary + master catalog (~1.5k tokens)
3. Specific pages: `wiki/modules/`, `wiki/decisions/`, `wiki/concepts/`, `wiki/dependencies/`, `wiki/flows/`

**Do NOT crawl the wiki for** general syntax/library questions, anything already in this file or in conversation context, or tasks unrelated to this project.

**When you make a change worth remembering:**

1. Update `wiki/hot.md` with the key new fact (overwrite — it's a snapshot)
2. Add an entry at the **TOP** of `wiki/log.md` (append-only, newest first)
3. Update the relevant `wiki/modules/` or `wiki/decisions/` page
4. For a major decision, create an ADR in `wiki/decisions/` using `_templates/decision.md`

### Wiki structure

```
wiki/
├── modules/      # one page per major feature (src/features/*)
├── components/   # one page per shared UI component (src/shared/ui/*)
├── decisions/    # ADRs
├── dependencies/ # external libraries
├── flows/        # end-to-end user flows + data paths
├── concepts/     # design + architecture knowledge
├── directions/   # long-running initiatives (multi-agent coordination)
├── tasks/        # concrete units of work (one per task)
├── sources/      # ingested source summaries
├── questions/    # filed Q&A
├── meta/         # dashboards, lint reports
├── _index.md     # master catalog
├── log.md        # append-only chronological log (newest at TOP)
├── hot.md        # ~500-word recent context (overwrite each time)
└── overview.md   # executive summary
```

All notes use YAML frontmatter (`type`, `status`, `created`, `updated`, `tags` minimum). Wikilinks are `[[Note Name]]` — filenames are unique, no paths. `.raw/` holds immutable source documents; never modify them.

### Multi-agent task coordination

`wiki/tasks/` is a built-in task tracker so multiple agents work without file conflicts. Each task page's frontmatter carries:

- `status`: `todo` | `in-progress` | `blocked` | `review` | `done`
- `direction`: which initiative it belongs to
- `owner`: agent name currently holding the task
- `files`: **the source of truth for conflict avoidance** — other agents must not touch these files while the task is in-progress
- `depends_on` / `blocks`: cross-task dependencies

**Claim a task:** flip `status: todo → in-progress`, set `owner`, add a Progress Log entry "Claimed by <name>". **Complete:** flip to `done`, log the result, update `wiki/hot.md`, and if you changed code, run `yarn lint && yarn build && yarn test:run`.

If you need to edit a file listed in another agent's in-progress task, ask in their Progress Log first or pick a different task.

### Wiki operations

- **Ingest** a source: drop the file in `.raw/`, then say "ingest [filename]".
- **Query**: ask any question — Claude reads `hot.md` → `overview.md` → `_index.md` → specific pages.
- **Lint**: say "lint the wiki" for a health check.
- **Save**: say "save this" to file the current conversation.

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
