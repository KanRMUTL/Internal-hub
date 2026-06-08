---
type: direction
title: 'Direction: Manual QA Sweep'
status: active
created: 2026-06-07
---

# Manual QA Sweep

A long-running initiative. The [[Module: Manual QA Testing|manual-qa-testing]] skill drives the browser through each feature once per session, captures evidence, and turns P0/P1 findings into tracked tasks.

## Why

The unit, visual-regression, and Playwright E2E suites catch a lot, but not visual polish, animation feel, focus management, theme parity, real-time reaction propagation, or modal dismissal edge cases. The manual sweep is the only place these are exercised by an actual browser, by an actual driver that pauses on real findings.

## Cumulative metrics

| Feature           | Last tested | P0  | P1  | P2  | P3  | Status      |
| ----------------- | ----------- | --- | --- | --- | --- | ----------- |
| fortune           | 2026-06-07  | 0   | 0   | 0   | 0   | ⚪ untested |
| member-management | 2026-06-07  | 0   | 0   | 0   | 0   | ⚪ untested |
| room-management   | 2026-06-07  | 0   | 0   | 0   | 0   | ⚪ untested |
| reactions         | 2026-06-07  | 0   | 0   | 0   | 0   | ⚪ untested |
| toggle-theme      | 2026-06-07  | 0   | 0   | 0   | 0   | ⚪ untested |

## Active tasks

See `wiki/tasks/` for tasks with `direction: Manual QA Sweep`.

## How to run

- `/qa-test <feature>` — drives one feature in a new session
- `/wiki-curator ingest` — bootstrap `wiki/modules/<feature>.md` first if a feature page is missing
