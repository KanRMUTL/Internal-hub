---
name: manual-qa-testing
description: 'Drive the local dev server through one feature as an exploratory QA pass using Chrome DevTools MCP. Captures evidence (screenshots, snapshots, console, network, state probes), classifies findings P0-P3, and writes results into wiki/qa/, wiki/tasks/, and docs/qa/. Independent of the Playwright E2E suite.'
---

# Manual Autonomous QA Testing

A single-feature-at-a-time protocol. Invoke with `/qa-test <feature>`. The skill is interactive — you (the main agent) drive the browser via the Chrome DevTools MCP tools (`mcp__chrome-devtools__*`) and follow the per-feature protocol in `flows/<feature>.md`.

## When to use

- Pre-release QA sweep across all features
- After a non-trivial code change, to surface what unit + E2E tests missed
- To verify a specific feature after a redesign (e.g., after Direction 7 changes)

## When NOT to use

- CI / headless runs (use the Playwright E2E suite at `src/e2e/e2e.test.ts`)
- Visual diffing against an approved baseline (not implemented)
- Code fixes (use `task-runner` to claim a `wiki/tasks/` entry)

## Pre-flight

1. Confirm Chrome DevTools MCP is connected: call `mcp__chrome-devtools__list_pages`.
2. Confirm `yarn dev` is up on `http://localhost:5173/`:
   ```bash
   curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/
   ```
   If not 200, start it in the background and wait up to 60s.
3. Generate a session ID: `qa-<YYYY-MM-DD>-<XXXX>` where `XXXX` is 4 base36 chars. Use `lib/session-id.ts newSessionId()`.
4. Create the evidence directory: `docs/qa/<date>-<feature>-<runId>/{screenshots,snapshots}/`. Use `lib/evidence.ts sessionDir(...)`.
5. `mcp__chrome-devtools__navigate_page` to `http://localhost:5173/`.
6. Take a baseline screenshot + snapshot.

## Per-feature loop

For the named `<feature>`:

1. **Read the spec.** Open `wiki/modules/<feature>.md` and extract the documented flows. If the page doesn't exist, halt and ask the user to run `/wiki-curator ingest` for the feature first. Do not infer flows from raw code.

2. **Plan.** Print the planned flow list to the user. The user can prune or extend before you start.

3. **Drive.** Open `flows/<feature>.md` and execute it step by step. For each step:

   - `mcp__chrome-devtools__take_snapshot` before/after
   - `mcp__chrome-devtools__take_screenshot` at visually-meaningful states
   - `mcp__chrome-devtools__list_console_messages` filtered to `error`/`warn` (delta only)
   - `mcp__chrome-devtools__list_network_requests` filtered to non-2xx or duration > 2s
   - `mcp__chrome-devtools__evaluate_script` for state checks snapshots can't see (`aria-live` text, focus position, z-index, computed styles)

4. **Classify.** Use `lib/severity.ts` `classifyFinding(finding)` on each finding. The rubric:

   - **P0** — crash, data loss, broken core flow, white screen, infinite spinner
   - **P1** — feature works but broken in a user-affecting way (modal can't dismiss, theme doesn't persist, history doesn't update, focus trap leaks)
   - **P2** — visual/UX defect that's clearly off (overflow, contrast, mis-alignment, animation stutter, missing aria-label)
   - **P3** — polish, copy, micro-issue

5. **Decide.**

   - P0/P1: **stop**, summarize the finding inline with evidence, ask the user to (a) continue past it, (b) fix and re-test, or (c) log and stop the session.
   - P2/P3: continue, batch into the final report.

6. **Resumability.** On interrupt, the next `/qa-test <feature>` invocation detects `wiki/qa/<feature>.md` frontmatter `status: in-progress` and offers to resume from the last completed step.

## Post-feature wrap

1. Update `wiki/qa/<feature>.md`:

   - Set `last_tested` and recompute `status` (red if P0, yellow if P1, green otherwise)
   - Append a `### YYYY-MM-DD runId` block with green flows, P0/P1/P2/P3 findings, skipped/untested

2. For each P0/P1, create a `wiki/tasks/<p0|p1>-<feature>-<slug>.md`:

   - Frontmatter: `type: qa-task`, `feature`, `severity`, `status: todo`, `direction: Manual QA Sweep`, `discovered`, `files` (from `lib/fsd-lookup.ts`)
   - Body: repro, expected, actual, evidence paths

3. Update `wiki/qa/_index.md` (per-feature row).

4. Update `wiki/directions/manual-qa-sweep.md` (cumulative metrics).

5. Write the session summary via `lib/report.ts renderSummary(...)` to `docs/qa/<date>-<feature>-<runId>/README.md`.

## Reference: lib/

- `lib/severity.ts` — `classifyFinding(finding)` → `'P0' | 'P1' | 'P2' | 'P3'`
- `lib/namespace.ts` — `roomNamespace`, `namespacedRoomName`, `isQaRoom`
- `lib/session-id.ts` — `newSessionId`, `parseSessionId`, `isValidSessionId`
- `lib/evidence.ts` — path helpers + `diffSnapshots` (skip no-op writes)
- `lib/fsd-lookup.ts` — `lookupImplicatedFiles(identifiers[])` → `string[]` (substring grep over `src/features`, `src/entities`, `src/pages`, `src/shared/ui`)
- `lib/report.ts` — `renderIndexRow`, `renderFeatureFrontmatter`, `renderTaskFrontmatter`, `renderTaskBody`, `renderSummary`

## Limits (called out in the final report)

- Cannot test real-time multi-user beyond two tabs in one browser
- Cannot test native OS dialogs (file pickers, print)
- Cannot toggle `prefers-reduced-motion` via MCP `emulate` (colorScheme only)
- No visual regression baseline (captures screenshots but no diffing)
- No CI (interactive Claude sessions only)
- Cannot fix code — the skill reports, fixing is the task-runner's job
