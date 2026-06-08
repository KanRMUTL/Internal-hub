# Manual Autonomous Testing — Design

## Context

`internal-hub` is in active development (Direction 7 redesign, then critique + polish, then width-overflow fix). The unit suite (`yarn test:run`), the visual-regression suite (`src/test/visual*.test.tsx`), and the Playwright E2E suite (`src/e2e/e2e.test.ts`) all exist — but none of them is good at _exploratory_ QA: visual polish, animation feel, multi-step UX, focus management, `prefers-reduced-motion` regressions, theme parity, real-time reaction propagation, modal dismissals, edge-case input. These gaps only surface when a human (or an AI) drives the actual browser, looking.

We want an **agent-driven, exploratory QA pass** that uses the Chrome DevTools MCP tools already wired into this Claude session, walks every feature end-to-end, captures evidence, classifies findings, and turns P0/P1 issues into tracked `wiki/tasks/` entries.

**Goals (in priority order):**

1. Find real bugs and regressions in the current state of the app
2. Be repeatable across sessions (the protocol doesn't drift)
3. Be resumable (a session can stop mid-feature and pick up later)
4. Be transferable (the protocol lives in a skill, not in my context)

**Non-goals:**

- Replace the Playwright E2E suite — it stays for CI assertions (see [[2026-06-06 — E2E Test Suite Design]])
- Auto-fix code — the skill reports, fixing is the task-runner's job
- Visual diffing against an approved baseline — future work
- Headless / CI execution — interactive Claude sessions only

## What

A new project-local skill at `.opencode/skills/manual-qa-testing/` that, when invoked with `/qa-test <feature>`, drives the local dev server through every documented flow of that feature using the Chrome DevTools MCP, captures evidence, classifies findings, and writes results into `wiki/qa/`, `wiki/tasks/`, and `docs/qa/`.

The skill is invoked **once per feature per session**. To cover all 5 features, run it 5 times (in 5 sessions, or back-to-back in one).

## Architecture

```
.opencode/skills/manual-qa-testing/
├── SKILL.md                          # main entrypoint (Claude reads this on /qa-test)
├── __tests__/
│   ├── classifier.test.ts            # severity classification
│   ├── renderer.test.ts              # finding → wiki/tasks/ frontmatter
│   ├── index-updater.test.ts         # wiki/qa/_index.md append
│   ├── namespace.test.ts             # qa-<date>-<runId> prefix generation
│   └── session-id.test.ts            # date+runId validation
├── templates/
│   ├── qa-index.md                   # wiki/qa/_index.md template
│   ├── qa-feature.md                 # wiki/qa/<feature>.md template
│   ├── qa-task.md                    # wiki/tasks/<p0|p1>-*.md template
│   ├── session-summary.md            # docs/qa/YYYY-MM-DD-<feature>-<runId>.md
│   └── direction.md                  # wiki/directions/manual-qa-sweep.md template
├── lib/
│   ├── severity.ts                   # classifier + rubric
│   ├── evidence.ts                   # paths, diff helpers
│   ├── fsd-lookup.ts                 # test-id/aria-label → src/<slice>/<file>
│   └── report.ts                     # renderers for the templates
└── flows/
    ├── fortune.md                    # per-feature protocol
    ├── member-management.md
    ├── room-management.md
    ├── reactions.md
    └── toggle-theme.md

src/e2e/
└── qa-skill.smoke.test.ts            # skill integration smoke (~30s)
```

The skill is invoked through Claude's Skill tool. It runs in the main agent (not a sub-agent) because Chrome DevTools MCP is a single browser instance and we want one coherent driver.

## Lifecycle

### 1. Pre-flight (per session)

1. Verify Chrome DevTools MCP is reachable (`mcp__chrome-devtools__list_pages`)
2. Verify `yarn dev` is up on `http://localhost:5173/` (Bash `curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/`). If not, start it in the background: `cd <repo> && yarn dev &` and wait up to 60s.
3. Open or claim a session ID: `qa-<YYYY-MM-DD>-<runId>`. `runId` is a 4-char base36 random. The session ID prefixes all created rooms.
4. Create the session evidence directory: `docs/qa/<date>-<feature>-<runId>/{screenshots,snapshots}/`
5. `mcp__chrome-devtools__navigate_page` to `http://localhost:5173/`
6. Take baseline snapshot + screenshot. Record `list_console_messages` and `list_network_requests` baseline counts.

### 2. Per-feature loop

For one named feature (e.g., `fortune`):

1. **Read the spec** — `wiki/modules/<feature>.md`. Extract the listed flows. If the page doesn't exist, halt and ask the user to run `/wiki-curator ingest` for the feature first. Do not infer flows from raw code.
2. **Plan** — Print the planned flow list to the user. User can prune or extend.
3. **Drive** — For each flow step:
   - `take_snapshot` before/after
   - `take_screenshot` at visually-meaningful states (modal open, wheel spinning, empty state, error toast)
   - `list_console_messages` filtered to `error`/`warn` after the action; record deltas only
   - `list_network_requests` filtered to non-2xx and slow (>2s)
   - `evaluate_script` for state checks snapshots can't see (e.g., `document.querySelector('[role="status"]').textContent`, focus position, z-index)
4. **Classify** — Each finding uses this rubric:
   - **P0** — Crash, data loss, broken core flow, white screen, infinite spinner
   - **P1** — Feature works but is broken in a way that affects the user (e.g., modal can't be dismissed, theme toggle doesn't persist, history doesn't update, focus trap leaks)
   - **P2** — Visual/UX defect that's clearly off (e.g., overflow, contrast, mis-aligned chips, animation stutter, missing aria-label on an action button)
   - **P3** — Polish, copy, micro-issue (e.g., "empty state copy is grammatically off", "toast disappears too fast")
5. **Decide** —
   - P0/P1: stop, summarize the finding inline with the evidence, ask the user to (a) continue past it, (b) fix it now and re-test, or (c) log it and stop the session.
   - P2/P3: keep going; final report at the end of the feature.
6. **Resumability** — At any point, the user can `Esc` / interrupt. The next `/qa-test <feature>` invocation detects `wiki/qa/<feature>.md` frontmatter `status: in-progress` and offers to resume from the last completed step (kept in a `## Progress` section).

### 3. Post-feature wrap

1. Update `wiki/qa/<feature>.md`:
   - Set frontmatter `last_tested: <date>`, recompute `status: green | yellow | red` (red if any P0, yellow if any P1, green otherwise)
   - Append a `### YYYY-MM-DD runId` block with: green flows subsection, P0/P1 findings (with wiki/tasks/ links), P2/P3 findings, skipped/untested with reason
2. For each P0/P1, create a `wiki/tasks/<p0|p1>-<feature>-<slug>.md` with: frontmatter (`type: qa-task`, `feature`, `severity`, `status: todo`, `direction: Manual QA Sweep`, `discovered`, `files: []` populated by `lib/fsd-lookup.ts`), body (repro, expected vs actual, screenshot path, console excerpt, network excerpt)
3. Update `wiki/qa/_index.md` — bump per-feature last-tested date, P0/P1/P2/P3 counts, status
4. Create or update `wiki/directions/manual-qa-sweep.md` with cumulative QA metrics
5. Write the session summary to `docs/qa/<date>-<feature>-<runId>/README.md`

### 4. Final report

The session summary is the discoverable artifact. It has these sections in this order:

1. **Header** — feature, date, runId, total flows run, total findings
2. **Must-fix (P0/P1)** — bulleted, each linking to its `wiki/tasks/` entry
3. **Should-fix (P2)** — bulleted, terse
4. **Nits (P3)** — bulleted, terse
5. **Green flows** — which flows passed cleanly (links to the canonical flow list)
6. **Skipped/untested** — why
7. **Created rooms for cleanup** — list of `qa-<date>-<runId>-<n>` room names
8. **Evidence index** — tree of `screenshots/`, `snapshots/`, `console.log`, `network.log`, `probes.jsonl`

## Evidence capture

| Kind         | Tool                                                                                   | Saved to                                                                                                                                  |
| ------------ | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Screenshots  | `mcp__chrome-devtools__take_screenshot`                                                | `docs/qa/<session>/screenshots/<step>-<state>.png` (default viewport 1440×900; resize to 375×812 for mobile spot-checks of the same flow) |
| Snapshots    | `mcp__chrome-devtools__take_snapshot`                                                  | `docs/qa/<session>/snapshots/<step>.txt` (text a11y tree)                                                                                 |
| Console      | `mcp__chrome-devtools__list_console_messages` filtered to `error`/`warn`               | `docs/qa/<session>/console.log` (append-only, with timestamps)                                                                            |
| Network      | `mcp__chrome-devtools__list_network_requests` filtered to non-2xx or duration > 2000ms | `docs/qa/<session>/network.log`                                                                                                           |
| State probes | `mcp__chrome-devtools__evaluate_script`                                                | `docs/qa/<session>/probes.jsonl`                                                                                                          |

Snapshots are diffed before saving — only changes are persisted. This keeps the evidence dir small.

## Per-feature protocols (initial scope)

`flows/<feature>.md` is the canonical checklist per feature. Initial set:

- **fortune** — Open room, add 3 members, toggle one inactive, press `S` to spin, wait for wheel to land, confirm winner modal, save, check history, spin again, press `Esc` to close, verify `prefers-reduced-motion` (skipped, see limits)
- **member-management** — Open member modal, add 2 members, edit one, remove one (confirm dialog), check empty state, cancel mid-add
- **room-management** — From Home, create room, edit room name, navigate to Room, return to Home, remove room (confirm dialog), check empty Home state
- **reactions** — Two Chrome tabs in the same instance, both viewing the same room. From tab A, send reaction. From tab B, verify it appears. Verify reaction count in tab A increments.
- **toggle-theme** — Click toggle, verify `data-theme` attribute changes, verify `localStorage.theme` is set, hard-reload, verify theme persists. Switch back, repeat.

Each per-feature file lists: flows, expected assertions, common regressions to look for, evidence targets.

## Environment

- **MCP** — Chrome DevTools MCP server is connected in this session; the skill calls its tools directly.
- **Dev server** — `yarn dev` on `http://localhost:5173/`. Skill auto-starts if down.
- **Firestore** — Real Firestore (the `.env.local` has the project keys). Test data is namespaced with `qa-<date>-<runId>-<n>` to make cleanup easy. The session summary lists created rooms for manual deletion.
- **Browser dialogs** — `mcp__chrome-devtools__handle_dialog` covers `window.confirm`/`alert`/`prompt`. The app uses `confirm` for "remove room"; the skill treats accept and dismiss as separate test cases.
- **Two-tab flows** — Use `mcp__chrome-devtools__new_page` with `background: true` for the second observer tab (reactions).

## Edge cases (handled in the skill)

| Case                                                     | Behavior                                                                                               |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `wiki/qa/_index.md` doesn't exist                        | Create from `templates/qa-index.md`                                                                    |
| `wiki/modules/<feature>.md` doesn't exist                | Halt; tell user to run `/wiki-curator ingest` for the feature first. Do not infer flows from raw code. |
| Dev server crash mid-test                                | Detect navigation timeout > 10s; pause; ask user to restart                                            |
| P0/P1 found                                              | Stop, summarize with evidence, ask user (continue / fix-and-retest / log-and-stop)                     |
| User interrupts (Esc)                                    | Persist `status: in-progress` to `wiki/qa/<feature>.md` frontmatter; update `## Progress` section      |
| Browser dialog                                           | Auto-handle via `mcp__chrome-devtools__handle_dialog` per the per-feature protocol                     |
| Destructive action imminent (remove room, delete member) | Take "before" snapshot first so the finding is self-contained                                          |
| Same finding in two flows                                | One wiki/tasks/ entry, two flow references in the body                                                 |
| Console message that existed before the action           | Not counted; only deltas are recorded                                                                  |
| Test pollutes Firestore                                  | Accept pollution. Cleanup list at end of session. The skill never deletes a non-`qa-*` room.           |

## Testing the skill

Two layers, both in CI:

1. **Skill unit tests** — `__tests__/*.test.ts` (Vitest). Pure-function tests for the transforms: severity classifier, finding → wiki/tasks/ frontmatter, `wiki/qa/_index.md` append, room-namespace prefix generator, session-ID validation.
2. **Skill integration smoke** — `src/e2e/qa-skill.smoke.test.ts` (Playwright). Runs the protocol against a trivial "ping" page (the skill exposes a `--smoke` flag that swaps in a static page). Asserts the QA report + tasks files are produced with the right shape. ≤ 30s, so it doesn't bloat the existing Playwright budget.

## Limits and known gaps (called out explicitly in the skill's output)

- **Cannot test real-time multi-user** beyond two tabs in the same browser. Chrome DevTools MCP can't drive two browser _contexts_. True multi-user would need two physical browsers or Playwright.
- **Cannot test native OS dialogs** like file pickers or print.
- **Cannot toggle `prefers-reduced-motion`** via `mcp__chrome-devtools__emulate` (the tool only does colorScheme, not motion). Motion regressions are inferred from animation timing observations, not direct verification.
- **No visual regression baseline** — the skill captures screenshots but does not diff against an approved baseline. Visual diffing is future work.
- **No CI** — interactive Claude sessions only.
- **Cannot fix code** — the skill reports findings. Fixing is the task-runner's job, claimed via `wiki/tasks/`.

## Open questions

- Should P2 findings also create `wiki/tasks/` entries? **Decision (2026-06-07): No, P0/P1 only.** P2/P3 noise can flood the task tracker. P2/P3 live in `wiki/qa/<feature>.md` and the session summary. The user can manually promote a P2 to a task if they want it tracked.
- Should the skill auto-dispatch `wiki-curator` if `wiki/modules/<feature>.md` is missing? **Decision: No, halt and tell the user.** Auto-dispatching adds coupling and surprise.

## Acceptance criteria

The design is considered done when:

1. `.opencode/skills/manual-qa-testing/` is scaffolded with SKILL.md + lib + templates + flows + **tests**
2. `wiki/qa/_index.md`, `wiki/qa/fortune.md`, `wiki/directions/manual-qa-sweep.md` exist with template content
3. A sample run for one feature (e.g., `fortune`) produces: a wiki/qa/ update, ≥1 wiki/tasks/ entry (if any P0/P1 found), a docs/qa/ summary, and a populated evidence directory
4. `yarn lint && yarn build && yarn test:run` pass
5. The new `src/e2e/qa-skill.smoke.test.ts` passes in ≤ 30s
