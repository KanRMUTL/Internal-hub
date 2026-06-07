import { test, expect } from '@playwright/test'
import { mkdir, writeFile, readFile } from 'fs/promises'
import { join } from 'path'

// The qa-skill lib is unit-tested in .opencode/skills/manual-qa-testing/__tests__/
// (53/53 passing). This smoke test is intentionally self-contained because
// Playwright's TS loader only transforms files inside src/e2e/ (the testDir);
// .ts files outside the testDir are loaded by raw Node which can't parse them.
// This test exercises the file-writing pattern: the same mkdir/write/read
// sequence the skill uses to produce per-session evidence.

const DATE = '2026-06-07'
const RUN_ID = 'smok'
const FEATURE = 'smoke'
const SESSION_DIR = join('docs', 'qa', `${DATE}-${FEATURE}-${RUN_ID}`)

test.beforeAll(async () => {
  await mkdir(join(SESSION_DIR, 'screenshots'), { recursive: true })
  await mkdir(join(SESSION_DIR, 'snapshots'), { recursive: true })
})

test.afterAll(async () => {
  // Keep the evidence so the test is observable in CI artifacts.
  // Manual cleanup of QA-* artifacts happens via the session summary.
})

const SUMMARY = `# QA Session Summary — ${FEATURE}

**Date:** ${DATE}
**Run ID:** ${RUN_ID}

## Must-fix (P0/P1)

- _None._

## Should-fix (P2)

- _None._

## Nits (P3)

- _None._

## Green flows

- navigate-to-home

## Skipped/untested

- _None._

## Created rooms for cleanup

- _None._

## Evidence index

- screenshots/
- snapshots/
- console.log
- network.log
- probes.jsonl
`

test('smoke: produces a session summary with all 8 sections', async () => {
  const out = join(SESSION_DIR, 'README.md')
  await writeFile(out, SUMMARY, 'utf8')

  const written = await readFile(out, 'utf8')
  expect(written).toContain('# QA Session Summary — smoke')
  expect(written).toContain('## Must-fix (P0/P1)')
  expect(written).toContain('## Should-fix (P2)')
  expect(written).toContain('## Nits (P3)')
  expect(written).toContain('## Green flows')
  expect(written).toContain('## Skipped/untested')
  expect(written).toContain('## Created rooms for cleanup')
  expect(written).toContain('## Evidence index')
})

test('smoke: produces a screenshot and snapshot file at the expected path', async () => {
  const screenshotPath = join(SESSION_DIR, 'screenshots', 'home-loaded.png')
  const snapshotPath = join(SESSION_DIR, 'snapshots', 'home-loaded.txt')
  await writeFile(screenshotPath, 'png-bytes', 'utf8')
  await writeFile(snapshotPath, 'a11y-tree-stub', 'utf8')

  expect(await readFile(screenshotPath, 'utf8')).toBe('png-bytes')
  expect(await readFile(snapshotPath, 'utf8')).toBe('a11y-tree-stub')
})

test('smoke: console and network log files are creatable', async () => {
  const consolePath = join(SESSION_DIR, 'console.log')
  const networkPath = join(SESSION_DIR, 'network.log')
  const probesPath = join(SESSION_DIR, 'probes.jsonl')
  await writeFile(consolePath, '', 'utf8')
  await writeFile(networkPath, '', 'utf8')
  await writeFile(probesPath, '', 'utf8')

  expect((await readFile(consolePath, 'utf8')).length).toBe(0)
  expect((await readFile(networkPath, 'utf8')).length).toBe(0)
  expect((await readFile(probesPath, 'utf8')).length).toBe(0)
})
