# E2E Test Suite Design

## Context

The project has a Vitest unit/component test suite but no end-to-end coverage. A complete E2E suite would validate all user-facing flows against the running application, catching integration issues that unit tests miss.

## What

A Playwright-based E2E test suite covering all 6 documented user flows, running against the local dev server (`yarn dev`). Each test is fully isolated — it creates its own room, exercises the flow, and cleans up after itself.

## Architecture

```
src/e2e/
├── pages/                    # Page Object Models
│   ├── HomePage.ts
│   ├── RoomPage.ts
│   └── Modals/
│       ├── RoomModal.ts
│       └── ConfirmRemoveModal.ts
├── flows/                    # Reusable flow helpers
│   ├── createRoom.ts
│   ├── addMember.ts
│   ├── spinWheel.ts
│   └── removeRoom.ts
├── fixtures/
│   └── testRun.ts           # Global setup/teardown — dev server lifecycle
└── playwright.config.ts
```

### Test Coverage

| #   | Flow          | Happy Path                             | Error / Edge Cases                          |
| --- | ------------- | -------------------------------------- | ------------------------------------------- |
| 1   | Create Room   | Valid name → room card appears         | Empty name (disabled), 60+ chars (disabled) |
| 2   | Add Member    | Valid name → member in list            | Empty name (disabled)                       |
| 3   | Spin Wheel    | Spin → winner modal → save             | <2 active members (button disabled)         |
| 4   | Toggle Member | Eye click → strikethrough in side card | —                                           |
| 5   | Remove Room   | Confirm → card disappears              | Cancel, backdrop dismiss                    |
| 6   | Theme Toggle  | Click → theme switches                 | —                                           |

## Key Decisions

### Dev Server Lifecycle

`playwright.config.ts` `globalSetup` spawns `yarn dev` as a detached background process. `globalTeardown` kills it after all tests complete. No manual server management required — `npx playwright test` handles everything.

### Per-Test Room Isolation

Each test creates its own room via the `createRoom()` helper. Room names are suffixed with a unique timestamp + worker index to avoid collisions when running `workers: 4` in parallel.

### Real Firebase

Tests hit the real Firebase dev instance (`.env.local` / `.env` placeholders). Data accumulates in dev Firestore — acceptable for local dev. No Firestore mocking.

### Winner Modal

The "Spin Wheel" flow resolves the winner modal with **"Save to history"** (positive path). Separate test cases cover "Discard" and "Spin again" outcomes.

### Parallel Workers

`workers: 4` in Playwright config. Each worker runs against `http://localhost:5173`. Workers are isolated by room name, so they don't interfere.

### Screenshots on Failure

`playwright.config.ts` sets `screenshot: { onFailure: true }` so CI failures include visual context.

### Test ID Attributes

Page Object Models use `data-testid` attributes for stable element selection. Components that currently lack testids will receive them (minimal changes — see Implementation Plan).

## Component Changes Required

To support reliable Playwright selectors, the following elements need `data-testid` attributes added:

- `Button` component — already has `data-testid` via `aria-label` fallback, verify
- `RoomModal` — name input, submit button
- `MemberManagementModalModern` — add member input, submit button
- `WheelOfFortune` — spin button
- `WinnerModal` — save/discard/spin-again buttons
- `RoomItem` — room card, `...` menu button, remove room menu item
- `ModalConfirmRemoveRoom` — confirm/cancel buttons
- `ThemeToggle` — toggle button

## Test File Structure

```
src/e2e/
├── e2e.test.ts              # All test cases
├── pages/                   # Page Object Models
├── flows/                   # Composable flow helpers
├── fixtures/
│   └── testRun.ts
└── playwright.config.ts
```

## Run Commands

| Task                     | Command                                        |
| ------------------------ | ---------------------------------------------- |
| Run E2E tests            | `npx playwright test`                          |
| Run with UI              | `npx playwright test --ui`                     |
| Run one file             | `npx playwright test src/e2e/e2e.test.ts`      |
| Generate tests (codegen) | `npx playwright codegen http://localhost:5173` |

## Dependencies

- `@playwright/test` (add to `devDependencies`)
- `playwright` (browser binaries via `npx playwright install`)

## Risks & Mitigations

| Risk                                         | Mitigation                                                                                  |
| -------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Firebase rate limits on repeated dev writes  | Tests use unique room names; teardown removes rooms                                         |
| Dev server port conflict in parallel workers | Each worker spawns its own `yarn dev` on a different port (5173 + worker index)             |
| Flaky winner selection (random)              | Winner modal tests use `expect(winnerModal).toBeVisible()` without asserting specific names |
| Slow test suite                              | Group flows into a single `describe` block per flow; parallel workers reduce total time     |

## Out of Scope

- Cross-browser matrix (covered by existing `crossBrowserTesting.test.tsx`)
- Accessibility audits in E2E (covered by `accessibility.visual.test.tsx`)
- Performance benchmarking
- CI integration (GitHub Actions workflow for E2E)

## Related

- [[Flow: Create Room]]
- [[Flow: Add Member]]
- [[Flow: Spin the Wheel]]
- [[Flow: Member Toggle Active/Inactive]]
- [[Flow: Remove Room]]
- [[Flow: Theme Toggle]]
- `docs/cross-browser-testing-guide.md`
