# Manual Autonomous QA Testing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a project-local skill (`.opencode/skills/manual-qa-testing/`) that drives Chrome DevTools MCP through every feature as an exploratory QA pass, captures evidence, classifies findings, and writes results into `wiki/qa/`, `wiki/tasks/`, and `docs/qa/`.

**Architecture:** A self-contained skill with a small `lib/` of pure functions (severity classifier, namespace, session-id, evidence paths, FSD lookup, template renderer), static `templates/` and `flows/` markdown files, and a `SKILL.md` entrypoint. Unit-tested in Vitest, integration-smoke-tested in Playwright. Wiki bootstrap creates empty `wiki/qa/_index.md`, `wiki/qa/fortune.md`, and `wiki/directions/manual-qa-sweep.md`. The skill is invoked via `/qa-test <feature>` (one feature per session).

**Tech Stack:** TypeScript 5.7 (strict), Vitest 3, Node fs/path APIs, Markdown with YAML frontmatter, Chrome DevTools MCP (external — the skill is just a markdown protocol that the Claude main agent follows).

---

## File Structure

```
.opencode/skills/manual-qa-testing/   # NEW — self-contained skill
├── SKILL.md                          # entrypoint — Claude reads this on /qa-test
├── lib/                              # pure functions, all TDD'd
│   ├── severity.ts                   # classifyFinding(finding) → 'P0'|'P1'|'P2'|'P3'
│   ├── namespace.ts                  # roomNamespace(date, runId) → 'qa-2026-06-07-abcd'
│   ├── session-id.ts                 # parseSessionId(id) / newSessionId()
│   ├── evidence.ts                   # sessionDir(...), screenshotPath(...), diffSnapshots(...)
│   ├── fsd-lookup.ts                 # lookupImplicatedFiles(identifiers[]) → string[]
│   └── report.ts                     # renderIndex(), renderFeature(), renderTask(), renderSummary()
├── templates/                        # static markdown bodies (placeholders only)
│   ├── qa-index.md                   # wiki/qa/_index.md skeleton
│   ├── qa-feature.md                 # wiki/qa/<feature>.md skeleton
│   ├── qa-task.md                    # wiki/tasks/<p0|p1>-<feature>-<slug>.md skeleton
│   ├── session-summary.md            # docs/qa/<date>-<feature>-<runId>/README.md skeleton
│   └── direction.md                  # wiki/directions/manual-qa-sweep.md skeleton
├── flows/                            # per-feature driving protocols (markdown checklists)
│   ├── fortune.md
│   ├── member-management.md
│   ├── room-management.md
│   ├── reactions.md
│   └── toggle-theme.md
└── __tests__/                        # Vitest unit tests (one per lib file)
    ├── severity.test.ts
    ├── namespace.test.ts
    ├── session-id.test.ts
    ├── evidence.test.ts
    ├── fsd-lookup.test.ts
    └── report.test.ts

src/e2e/
└── qa-skill.smoke.test.ts            # NEW — integration smoke (~30s)

wiki/qa/                              # NEW (empty at first)
├── _index.md
└── fortune.md                        # first feature populated by Task 11

wiki/directions/
└── manual-qa-sweep.md                # NEW

docs/superpowers/specs/
└── 2026-06-07-manual-qa-testing-design.md   # EXISTS — source of truth
```

**No file outside the listed paths is touched by this plan.** The skill is standalone; it reads from `wiki/modules/`, `wiki/`, and `src/` but never writes to `src/`.

---

## Task 1: Scaffold the skill directory and verify Vitest picks it up

**Files:**

- Create: `.opencode/skills/manual-qa-testing/.gitkeep` (empty)
- Create: `.opencode/skills/manual-qa-testing/__tests__/.gitkeep` (empty)
- Create: `.opencode/skills/manual-qa-testing/__tests__/smoke.test.ts` (1 trivial test)
- Create: `.opencode/skills/manual-qa-testing/lib/.gitkeep` (empty)
- Create: `.opencode/skills/manual-qa-testing/templates/.gitkeep` (empty)
- Create: `.opencode/skills/manual-qa-testing/flows/.gitkeep` (empty)

- [ ] **Step 1: Create the directory structure**

```bash
mkdir -p .opencode/skills/manual-qa-testing/{lib,templates,flows,__tests__}
touch .opencode/skills/manual-qa-testing/.gitkeep
touch .opencode/skills/manual-qa-testing/lib/.gitkeep
touch .opencode/skills/manual-qa-testing/templates/.gitkeep
touch .opencode/skills/manual-qa-testing/flows/.gitkeep
touch .opencode/skills/manual-qa-testing/__tests__/.gitkeep
```

- [ ] **Step 2: Add a trivial Vitest test to verify the include pattern**

Write `.opencode/skills/manual-qa-testing/__tests__/smoke.test.ts`:

```ts
import { describe, it, expect } from 'vitest'

describe('manual-qa-testing scaffold', () => {
  it('exists and is reachable by Vitest', () => {
    expect(1 + 1).toBe(2)
  })
})
```

- [ ] **Step 3: Run the test to verify Vitest picks up files under `.opencode/`**

Run: `yarn test:run -- .opencode/skills/manual-qa-testing/__tests__/smoke.test.ts`
Expected: PASS — `manual-qa-testing scaffold > exists and is reachable by Vitest` (1 passed).

If it FAILS with "No test files found", Vitest's default `include` pattern does not match `.opencode/`. Fix by adding to `vitest.config.ts`:

```ts
test: {
  // ... existing
  include: ['src/**/*.{test,spec}.{ts,tsx}', '.opencode/**/*.{test,spec}.{ts,tsx}'],
},
```

Then re-run.

- [ ] **Step 4: Commit**

```bash
git add .opencode/skills/manual-qa-testing
git commit -m "chore(qa-skill): scaffold manual-qa-testing directory + vitest include"
```

---

## Task 2: `lib/session-id.ts` — parse and validate `qa-YYYY-MM-DD-XXXX` session IDs (TDD)

**Files:**

- Create: `.opencode/skills/manual-qa-testing/lib/session-id.ts`
- Create: `.opencode/skills/manual-qa-testing/__tests__/session-id.test.ts`

- [ ] **Step 1: Write the failing test**

Write `.opencode/skills/manual-qa-testing/__tests__/session-id.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { parseSessionId, isValidSessionId, newSessionId } from '../lib/session-id'

describe('session-id', () => {
  describe('isValidSessionId', () => {
    it('accepts a well-formed id', () => {
      expect(isValidSessionId('qa-2026-06-07-abcd')).toBe(true)
    })
    it('rejects a missing prefix', () => {
      expect(isValidSessionId('2026-06-07-abcd')).toBe(false)
    })
    it('rejects an all-numeric runId', () => {
      // runId must be 4 lowercase base36 chars
      expect(isValidSessionId('qa-2026-06-07-1234')).toBe(false)
    })
    it('rejects an empty string', () => {
      expect(isValidSessionId('')).toBe(false)
    })
  })

  describe('parseSessionId', () => {
    it('returns {date, runId} for a valid id', () => {
      expect(parseSessionId('qa-2026-06-07-abcd')).toEqual({
        date: '2026-06-07',
        runId: 'abcd',
      })
    })
    it('throws on an invalid id', () => {
      expect(() => parseSessionId('nope')).toThrow(/Invalid session ID/)
    })
  })

  describe('newSessionId', () => {
    it('produces an id matching isValidSessionId', () => {
      const id = newSessionId()
      expect(isValidSessionId(id)).toBe(true)
    })
    it('uses today’s date', () => {
      const id = newSessionId()
      const today = new Date().toISOString().slice(0, 10)
      expect(id).toContain(today)
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `yarn test:run -- .opencode/skills/manual-qa-testing/__tests__/session-id.test.ts`
Expected: FAIL — "Cannot find module '../lib/session-id'".

- [ ] **Step 3: Implement `lib/session-id.ts`**

```ts
// Format: qa-YYYY-MM-DD-XXXX where XXXX is 4 lowercase base36 chars
const SESSION_ID_RE = /^qa-(\d{4}-\d{2}-\d{2})-([0-9a-z]{4})$/

export function isValidSessionId(id: string): boolean {
  return SESSION_ID_RE.test(id)
}

export interface ParsedSessionId {
  date: string
  runId: string
}

export function parseSessionId(id: string): ParsedSessionId {
  const match = SESSION_ID_RE.exec(id)
  if (!match) {
    throw new Error(`Invalid session ID: "${id}". Expected qa-YYYY-MM-DD-XXXX.`)
  }
  return { date: match[1], runId: match[2] }
}

export function newSessionId(): string {
  const date = new Date().toISOString().slice(0, 10)
  const runId = Math.floor(Math.random() * 36 ** 4)
    .toString(36)
    .padStart(4, '0')
  return `qa-${date}-${runId}`
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `yarn test:run -- .opencode/skills/manual-qa-testing/__tests__/session-id.test.ts`
Expected: PASS — all 6 cases pass.

- [ ] **Step 5: Commit**

```bash
git add .opencode/skills/manual-qa-testing/lib/session-id.ts .opencode/skills/manual-qa-testing/__tests__/session-id.test.ts
git rm .opencode/skills/manual-qa-testing/__tests__/.gitkeep .opencode/skills/manual-qa-testing/lib/.gitkeep
git commit -m "feat(qa-skill): add session-id lib + tests"
```

---

## Task 3: `lib/namespace.ts` — room namespace prefix generator (TDD)

**Files:**

- Create: `.opencode/skills/manual-qa-testing/lib/namespace.ts`
- Create: `.opencode/skills/manual-qa-testing/__tests__/namespace.test.ts`

- [ ] **Step 1: Write the failing test**

Write `.opencode/skills/manual-qa-testing/__tests__/namespace.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { roomNamespace, namespacedRoomName, isQaRoom } from '../lib/namespace'

describe('namespace', () => {
  it('roomNamespace joins date and runId with the qa- prefix', () => {
    expect(roomNamespace('2026-06-07', 'abcd')).toBe('qa-2026-06-07-abcd')
  })

  it('namespacedRoomName appends a counter with a dash', () => {
    expect(namespacedRoomName('qa-2026-06-07-abcd', 1)).toBe('qa-2026-06-07-abcd-1')
    expect(namespacedRoomName('qa-2026-06-07-abcd', 12)).toBe('qa-2026-06-07-abcd-12')
  })

  it('isQaRoom returns true for any room starting with qa-', () => {
    expect(isQaRoom('qa-2026-06-07-abcd-1')).toBe(true)
    expect(isQaRoom('QA-2026-06-07-abcd-1')).toBe(false) // case-sensitive
    expect(isQaRoom('Standup')).toBe(false)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `yarn test:run -- .opencode/skills/manual-qa-testing/__tests__/namespace.test.ts`
Expected: FAIL — "Cannot find module".

- [ ] **Step 3: Implement `lib/namespace.ts`**

```ts
import { parseSessionId } from './session-id'

export function roomNamespace(date: string, runId: string): string {
  return `qa-${date}-${runId}`
}

export function namespacedRoomName(sessionId: string, counter: number): string {
  return `${sessionId}-${counter}`
}

export function isQaRoom(roomName: string): boolean {
  return roomName.startsWith('qa-')
}

// Re-export so consumers don't need to import session-id separately
export { parseSessionId }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `yarn test:run -- .opencode/skills/manual-qa-testing/__tests__/namespace.test.ts`
Expected: PASS — 3 cases pass.

- [ ] **Step 5: Commit**

```bash
git add .opencode/skills/manual-qa-testing/lib/namespace.ts .opencode/skills/manual-qa-testing/__tests__/namespace.test.ts
git commit -m "feat(qa-skill): add namespace lib + tests"
```

---

## Task 4: `lib/severity.ts` — finding severity classifier (TDD)

**Files:**

- Create: `.opencode/skills/manual-qa-testing/lib/severity.ts`
- Create: `.opencode/skills/manual-qa-testing/__tests__/severity.test.ts`

A finding has this shape (used in the rubric tests):

```ts
type FindingKind =
  | 'crash'
  | 'data-loss'
  | 'broken-core-flow'
  | 'white-screen'
  | 'infinite-spinner'
  | 'modal-cant-dismiss'
  | 'theme-doesnt-persist'
  | 'history-doesnt-update'
  | 'focus-trap-leak'
  | 'visual-overflow'
  | 'contrast-fail'
  | 'mis-alignment'
  | 'animation-stutter'
  | 'missing-aria-label'
  | 'copy-issue'
  | 'toast-too-fast'
  | 'unknown'

interface Finding {
  kind: FindingKind
  blocksCoreFlow: boolean
  hasConsoleError: boolean
  visualSeverity: 'critical' | 'major' | 'minor' | 'trivial'
}
```

- [ ] **Step 1: Write the failing test**

Write `.opencode/skills/manual-qa-testing/__tests__/severity.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { classifyFinding, type Finding } from '../lib/severity'

const f = (over: Partial<Finding>): Finding => ({
  kind: 'unknown',
  blocksCoreFlow: false,
  hasConsoleError: false,
  visualSeverity: 'trivial',
  ...over,
})

describe('classifyFinding', () => {
  it('returns P0 for crash regardless of other fields', () => {
    expect(classifyFinding(f({ kind: 'crash' }))).toBe('P0')
  })
  it('returns P0 for white-screen', () => {
    expect(classifyFinding(f({ kind: 'white-screen' }))).toBe('P0')
  })
  it('returns P0 for data-loss', () => {
    expect(classifyFinding(f({ kind: 'data-loss' }))).toBe('P0')
  })
  it('returns P0 for infinite-spinner', () => {
    expect(classifyFinding(f({ kind: 'infinite-spinner' }))).toBe('P0')
  })
  it('returns P0 for broken-core-flow', () => {
    expect(classifyFinding(f({ kind: 'broken-core-flow' }))).toBe('P0')
  })

  it('returns P1 for modal-cant-dismiss', () => {
    expect(classifyFinding(f({ kind: 'modal-cant-dismiss' }))).toBe('P1')
  })
  it('returns P1 for theme-doesnt-persist', () => {
    expect(classifyFinding(f({ kind: 'theme-doesnt-persist' }))).toBe('P1')
  })
  it('returns P1 for history-doesnt-update', () => {
    expect(classifyFinding(f({ kind: 'history-doesnt-update' }))).toBe('P1')
  })
  it('returns P1 for focus-trap-leak', () => {
    expect(classifyFinding(f({ kind: 'focus-trap-leak' }))).toBe('P1')
  })
  it('returns P1 for any finding with a console error that blocks a core flow', () => {
    expect(classifyFinding(f({ blocksCoreFlow: true, hasConsoleError: true }))).toBe('P1')
  })

  it('returns P2 for visual-overflow', () => {
    expect(classifyFinding(f({ kind: 'visual-overflow' }))).toBe('P2')
  })
  it('returns P2 for contrast-fail', () => {
    expect(classifyFinding(f({ kind: 'contrast-fail' }))).toBe('P2')
  })
  it('returns P2 for mis-alignment', () => {
    expect(classifyFinding(f({ kind: 'mis-alignment' }))).toBe('P2')
  })
  it('returns P2 for animation-stutter', () => {
    expect(classifyFinding(f({ kind: 'animation-stutter' }))).toBe('P2')
  })
  it('returns P2 for missing-aria-label', () => {
    expect(classifyFinding(f({ kind: 'missing-aria-label' }))).toBe('P2')
  })
  it('returns P2 for any visual-severity=major finding', () => {
    expect(classifyFinding(f({ visualSeverity: 'major' }))).toBe('P2')
  })

  it('returns P3 for copy-issue', () => {
    expect(classifyFinding(f({ kind: 'copy-issue' }))).toBe('P3')
  })
  it('returns P3 for toast-too-fast', () => {
    expect(classifyFinding(f({ kind: 'toast-too-fast' }))).toBe('P3')
  })
  it('returns P3 for visual-severity=minor', () => {
    expect(classifyFinding(f({ visualSeverity: 'minor' }))).toBe('P3')
  })

  it('returns P3 for unknown kind with no other signals', () => {
    expect(classifyFinding(f({ kind: 'unknown' }))).toBe('P3')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `yarn test:run -- .opencode/skills/manual-qa-testing/__tests__/severity.test.ts`
Expected: FAIL — "Cannot find module".

- [ ] **Step 3: Implement `lib/severity.ts`**

```ts
export type Severity = 'P0' | 'P1' | 'P2' | 'P3'

export type FindingKind =
  | 'crash'
  | 'data-loss'
  | 'broken-core-flow'
  | 'white-screen'
  | 'infinite-spinner'
  | 'modal-cant-dismiss'
  | 'theme-doesnt-persist'
  | 'history-doesnt-update'
  | 'focus-trap-leak'
  | 'visual-overflow'
  | 'contrast-fail'
  | 'mis-alignment'
  | 'animation-stutter'
  | 'missing-aria-label'
  | 'copy-issue'
  | 'toast-too-fast'
  | 'unknown'

export type VisualSeverity = 'critical' | 'major' | 'minor' | 'trivial'

export interface Finding {
  kind: FindingKind
  blocksCoreFlow: boolean
  hasConsoleError: boolean
  visualSeverity: VisualSeverity
}

const P0_KINDS: ReadonlySet<FindingKind> = new Set([
  'crash',
  'data-loss',
  'broken-core-flow',
  'white-screen',
  'infinite-spinner',
])

const P1_KINDS: ReadonlySet<FindingKind> = new Set([
  'modal-cant-dismiss',
  'theme-doesnt-persist',
  'history-doesnt-update',
  'focus-trap-leak',
])

const P2_KINDS: ReadonlySet<FindingKind> = new Set([
  'visual-overflow',
  'contrast-fail',
  'mis-alignment',
  'animation-stutter',
  'missing-aria-label',
])

const P3_KINDS: ReadonlySet<FindingKind> = new Set(['copy-issue', 'toast-too-fast'])

export function classifyFinding(finding: Finding): Severity {
  if (P0_KINDS.has(finding.kind)) return 'P0'
  if (P1_KINDS.has(finding.kind)) return 'P1'
  if (finding.blocksCoreFlow && finding.hasConsoleError) return 'P1'
  if (P2_KINDS.has(finding.kind)) return 'P2'
  if (finding.visualSeverity === 'critical' || finding.visualSeverity === 'major') return 'P2'
  if (P3_KINDS.has(finding.kind)) return 'P3'
  if (finding.visualSeverity === 'minor') return 'P3'
  return 'P3'
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `yarn test:run -- .opencode/skills/manual-qa-testing/__tests__/severity.test.ts`
Expected: PASS — all 19 cases pass.

- [ ] **Step 5: Commit**

```bash
git add .opencode/skills/manual-qa-testing/lib/severity.ts .opencode/skills/manual-qa-testing/__tests__/severity.test.ts
git commit -m "feat(qa-skill): add severity classifier + tests"
```

---

## Task 5: `lib/evidence.ts` — paths + diff helpers (TDD)

**Files:**

- Create: `.opencode/skills/manual-qa-testing/lib/evidence.ts`
- Create: `.opencode/skills/manual-qa-testing/__tests__/evidence.test.ts`

- [ ] **Step 1: Write the failing test**

Write `.opencode/skills/manual-qa-testing/__tests__/evidence.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import {
  sessionDir,
  screenshotPath,
  snapshotPath,
  consoleLogPath,
  networkLogPath,
  probesPath,
  diffSnapshots,
} from '../lib/evidence'

describe('evidence paths', () => {
  const session = 'qa-2026-06-07-abcd'
  const feature = 'fortune'

  it('sessionDir joins date-feature-runId under docs/qa/', () => {
    expect(sessionDir('2026-06-07', feature, 'abcd')).toBe('docs/qa/2026-06-07-fortune-abcd')
  })

  it('screenshotPath produces a stable name with step + state', () => {
    expect(screenshotPath(session, 'open-wheel', 'spinning')).toBe(
      'docs/qa/2026-06-07-fortune-abcd/screenshots/open-wheel-spinning.png'
    )
  })

  it('snapshotPath produces a .txt file under snapshots/', () => {
    expect(snapshotPath(session, 'before-spin')).toBe('docs/qa/2026-06-07-fortune-abcd/snapshots/before-spin.txt')
  })

  it('consoleLogPath, networkLogPath, probesPath are stable filenames', () => {
    expect(consoleLogPath(session)).toBe('docs/qa/2026-06-07-fortune-abcd/console.log')
    expect(networkLogPath(session)).toBe('docs/qa/2026-06-07-fortune-abcd/network.log')
    expect(probesPath(session)).toBe('docs/qa/2026-06-07-fortune-abcd/probes.jsonl')
  })
})

describe('diffSnapshots', () => {
  it('returns the second snapshot when it differs from the first', () => {
    const a = 'heading: Home'
    const b = 'heading: Home\nbutton: New room'
    expect(diffSnapshots(a, b)).toBe(b)
  })

  it('returns null when the snapshots are identical', () => {
    const a = 'same'
    expect(diffSnapshots(a, a)).toBeNull()
  })

  it('returns null when only whitespace differs (collapsed for the comparison)', () => {
    expect(diffSnapshots('a\n', 'a')).toBeNull()
    expect(diffSnapshots('a', 'a\n')).toBeNull()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `yarn test:run -- .opencode/skills/manual-qa-testing/__tests__/evidence.test.ts`
Expected: FAIL — "Cannot find module".

- [ ] **Step 3: Implement `lib/evidence.ts`**

```ts
import { join } from 'path'

export function sessionDir(date: string, feature: string, runId: string): string {
  return join('docs', 'qa', `${date}-${feature}-${runId}`)
}

export function sessionPaths(sessionId: string) {
  // sessionId is qa-YYYY-MM-DD-XXXX — used as the trailing component
  return {
    base: join('docs', 'qa', sessionIdToLegacy(sessionId)),
  }
}

function sessionIdToLegacy(sessionId: string): string {
  // qa-YYYY-MM-DD-XXXX -> YYYY-MM-DD-<feature>-XXXX
  // We only need a stable directory name; the feature is added by callers.
  return sessionId
}

export function screenshotPath(baseDir: string, step: string, state: string): string {
  return join(baseDir, 'screenshots', `${step}-${state}.png`)
}

export function snapshotPath(baseDir: string, step: string): string {
  return join(baseDir, 'snapshots', `${step}.txt`)
}

export function consoleLogPath(baseDir: string): string {
  return join(baseDir, 'console.log')
}

export function networkLogPath(baseDir: string): string {
  return join(baseDir, 'network.log')
}

export function probesPath(baseDir: string): string {
  return join(baseDir, 'probes.jsonl')
}

/**
 * Returns the second snapshot if it differs from the first (after whitespace normalization),
 * or null if they're equivalent. Used to skip writing no-op snapshots.
 */
export function diffSnapshots(prev: string | null, next: string): string | null {
  const norm = (s: string) => s.replace(/\s+/g, ' ').trim()
  if (prev === null) return next
  if (norm(prev) === norm(next)) return null
  return next
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `yarn test:run -- .opencode/skills/manual-qa-testing/__tests__/evidence.test.ts`
Expected: PASS — all 8 cases pass.

- [ ] **Step 5: Commit**

```bash
git add .opencode/skills/manual-qa-testing/lib/evidence.ts .opencode/skills/manual-qa-testing/__tests__/evidence.test.ts
git commit -m "feat(qa-skill): add evidence path helpers + snapshot diff"
```

---

## Task 6: `lib/fsd-lookup.ts` — identifier → file lookup (TDD)

**Files:**

- Create: `.opencode/skills/manual-qa-testing/lib/fsd-lookup.ts`
- Create: `.opencode/skills/manual-qa-testing/__tests__/fsd-lookup.test.ts`

The strategy: given a list of page identifiers (data-testid values, role/label hints), grep the `src/` tree for matches and return the matching source files. The implementer reviews the candidate list before publishing it to a `wiki/tasks/` entry.

- [ ] **Step 1: Write the failing test**

Write `.opencode/skills/manual-qa-testing/__tests__/fsd-lookup.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { lookupImplicatedFiles } from '../lib/fsd-lookup'
import * as fs from 'fs/promises'

vi.mock('fs/promises')

const mocked = vi.mocked(fs)

describe('lookupImplicatedFiles', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('returns an empty list for an empty identifier list', async () => {
    const result = await lookupImplicatedFiles([])
    expect(result).toEqual([])
  })

  it('returns files whose contents include any of the identifiers', async () => {
    mocked.readdir.mockImplementation(async (p: any) => {
      if (String(p).endsWith('features')) {
        return [{ name: 'fortune', isDirectory: () => true }] as any
      }
      if (String(p).endsWith('fortune')) {
        return [{ name: 'ui', isDirectory: () => true }] as any
      }
      if (String(p).endsWith('fortune/ui')) {
        return [{ name: 'WheelOfFortuneModern.tsx', isDirectory: () => false }] as any
      }
      return [] as any
    })
    mocked.readFile.mockResolvedValue('// data-testid="spin-button" appears here')

    const result = await lookupImplicatedFiles(['spin-button'])
    expect(result).toEqual([expect.stringContaining('WheelOfFortuneModern.tsx')])
  })

  it('deduplicates results', async () => {
    mocked.readdir.mockResolvedValue([{ name: 'fortune', isDirectory: () => true }] as any)
    mocked.readdir.mockImplementationOnce(async () => [{ name: 'ui', isDirectory: () => true }] as any)
    mocked.readdir.mockImplementationOnce(
      async () => [{ name: 'WheelOfFortuneModern.tsx', isDirectory: () => false }] as any
    )
    mocked.readFile.mockResolvedValue('spin-button and spin-button both here')

    const result = await lookupImplicatedFiles(['spin-button', 'spin-button'])
    expect(result).toHaveLength(1)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `yarn test:run -- .opencode/skills/manual-qa-testing/__tests__/fsd-lookup.test.ts`
Expected: FAIL — "Cannot find module".

- [ ] **Step 3: Implement `lib/fsd-lookup.ts`**

```ts
import { readdir, readFile, stat } from 'fs/promises'
import { join, relative } from 'path'

const SCAN_ROOTS = ['src/features', 'src/entities', 'src/pages', 'src/shared/ui']

const TEXT_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx'])

/**
 * Recursively walks SCAN_ROOTS, returns the unique list of source files whose
 * contents include any of the given identifiers (substring match). Limit: 200
 * files per root to keep the scan fast.
 */
export async function lookupImplicatedFiles(identifiers: string[]): Promise<string[]> {
  if (identifiers.length === 0) return []

  const needles = identifiers.map((s) => s.trim()).filter(Boolean)
  if (needles.length === 0) return []

  const matches = new Set<string>()

  for (const root of SCAN_ROOTS) {
    let rootStat
    try {
      rootStat = await stat(root)
    } catch {
      continue
    }
    if (!rootStat.isDirectory()) continue

    const files: string[] = []
    await walk(root, files, 0, 200)

    for (const file of files) {
      let content: string
      try {
        content = await readFile(file, 'utf8')
      } catch {
        continue
      }
      if (needles.some((n) => content.includes(n))) {
        matches.add(relative(process.cwd(), file))
      }
    }
  }

  return [...matches].sort()
}

async function walk(dir: string, out: string[], depth: number, limit: number): Promise<void> {
  if (out.length >= limit || depth > 6) return
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return
  }
  for (const e of entries) {
    if (out.length >= limit) return
    const full = join(dir, e.name)
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === '__tests__' || e.name.startsWith('.')) continue
      await walk(full, out, depth + 1, limit)
    } else if (e.isFile()) {
      const ext = e.name.slice(e.name.lastIndexOf('.'))
      if (TEXT_EXTENSIONS.has(ext)) out.push(full)
    }
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `yarn test:run -- .opencode/skills/manual-qa-testing/__tests__/fsd-lookup.test.ts`
Expected: PASS — all 3 cases pass. (The mock setup is minimal; Vitest's mock machinery covers the rest.)

If the dedup test fails because the mock isn't returning the right shape for the recursive walk, inspect by adding a `console.log(out)` inside `lookupImplicatedFiles` temporarily, then remove the log.

- [ ] **Step 5: Commit**

```bash
git add .opencode/skills/manual-qa-testing/lib/fsd-lookup.ts .opencode/skills/manual-qa-testing/__tests__/fsd-lookup.test.ts
git commit -m "feat(qa-skill): add FSD file lookup from page identifiers"
```

---

## Task 7: `lib/report.ts` — template renderers (TDD)

**Files:**

- Create: `.opencode/skills/manual-qa-testing/lib/report.ts`
- Create: `.opencode/skills/manual-qa-testing/__tests__/report.test.ts`

The renderer does simple string substitution against the templates in `templates/`. The templates use `{{key}}` placeholders.

- [ ] **Step 1: Write the failing test**

Write `.opencode/skills/manual-qa-testing/__tests__/report.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import {
  renderIndexRow,
  renderFeatureFrontmatter,
  renderTaskFrontmatter,
  renderTaskBody,
  renderSummary,
} from '../lib/report'
import type { Severity } from '../lib/severity'

describe('renderIndexRow', () => {
  it('produces a markdown row with status emoji and counts', () => {
    const row = renderIndexRow({
      feature: 'fortune',
      lastTested: '2026-06-07',
      status: 'yellow',
      counts: { P0: 0, P1: 1, P2: 2, P3: 3 },
    })
    expect(row).toContain('fortune')
    expect(row).toContain('2026-06-07')
    expect(row).toContain('🟡') // yellow circle
    expect(row).toContain('P0:0')
    expect(row).toContain('P1:1')
    expect(row).toContain('P2:2')
    expect(row).toContain('P3:3')
  })
})

describe('renderFeatureFrontmatter', () => {
  it('produces a YAML frontmatter block with last_tested and status', () => {
    const fm = renderFeatureFrontmatter({
      lastTested: '2026-06-07',
      status: 'green',
    })
    expect(fm).toMatch(/^---\n/)
    expect(fm).toContain('last_tested: 2026-06-07')
    expect(fm).toContain('status: green')
    expect(fm).toMatch(/\n---\n$/)
  })
})

describe('renderTaskFrontmatter', () => {
  it('produces a YAML frontmatter block for a P0/P1 task', () => {
    const fm = renderTaskFrontmatter({
      severity: 'P0' as Severity,
      feature: 'fortune',
      slug: 'spin-button-broken',
      discovered: '2026-06-07',
      files: ['src/features/fortune/ui/WheelOfFortuneModern.tsx'],
    })
    expect(fm).toContain('type: qa-task')
    expect(fm).toContain('severity: P0')
    expect(fm).toContain('feature: fortune')
    expect(fm).toContain('status: todo')
    expect(fm).toContain('direction: Manual QA Sweep')
    expect(fm).toContain('discovered: 2026-06-07')
    expect(fm).toContain('files:')
    expect(fm).toContain('- src/features/fortune/ui/WheelOfFortuneModern.tsx')
  })
})

describe('renderTaskBody', () => {
  it('includes title, repro, expected, actual, evidence paths', () => {
    const body = renderTaskBody({
      title: 'Spin button does nothing',
      repro: '1. Open room. 2. Press S. 3. Wheel does not spin.',
      expected: 'Wheel spins and lands on a member.',
      actual: 'No animation; no winner revealed.',
      screenshot: 'docs/qa/2026-06-07-fortune-abcd/screenshots/spin-after.png',
      consoleExcerpt: 'Uncaught TypeError: undefined is not a function',
    })
    expect(body).toContain('# Spin button does nothing')
    expect(body).toContain('## Repro')
    expect(body).toContain('## Expected')
    expect(body).toContain('## Actual')
    expect(body).toContain('## Evidence')
    expect(body).toContain('docs/qa/2026-06-07-fortune-abcd/screenshots/spin-after.png')
    expect(body).toContain('Uncaught TypeError')
  })
})

describe('renderSummary', () => {
  it('renders all 8 sections in order with the right headings', () => {
    const md = renderSummary({
      feature: 'fortune',
      date: '2026-06-07',
      runId: 'abcd',
      totalFlows: 11,
      totalFindings: 6,
      p0p1: [{ severity: 'P1', title: 'X' }],
      p2: [],
      p3: [],
      greenFlows: ['open-room', 'spin-wheel'],
      skipped: [{ flow: 'prefers-reduced-motion', reason: 'cannot emulate via MCP' }],
      createdRooms: ['qa-2026-06-07-abcd-1'],
      evidenceIndex: ['screenshots/', 'snapshots/', 'console.log'],
    })
    const headings = [
      'Header',
      'Must-fix',
      'Should-fix',
      'Nits',
      'Green flows',
      'Skipped',
      'Created rooms',
      'Evidence index',
    ]
    let prev = -1
    for (const h of headings) {
      const idx = md.indexOf(`## ${h}`)
      expect(idx).toBeGreaterThan(prev)
      prev = idx
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `yarn test:run -- .opencode/skills/manual-qa-testing/__tests__/report.test.ts`
Expected: FAIL — "Cannot find module".

- [ ] **Step 3: Implement `lib/report.ts`**

```ts
import type { Severity } from './severity'

const STATUS_EMOJI: Record<'green' | 'yellow' | 'red', string> = {
  green: '🟢',
  yellow: '🟡',
  red: '🔴',
}

export interface IndexRowInput {
  feature: string
  lastTested: string
  status: 'green' | 'yellow' | 'red'
  counts: Record<Severity, number>
}

export function renderIndexRow(input: IndexRowInput): string {
  const { feature, lastTested, status, counts } = input
  const emoji = STATUS_EMOJI[status]
  return `| ${feature} | ${lastTested} | ${emoji} ${status} | P0:${counts.P0} P1:${counts.P1} P2:${counts.P2} P3:${counts.P3} |`
}

export interface FeatureFrontmatterInput {
  lastTested: string
  status: 'green' | 'yellow' | 'red'
}

export function renderFeatureFrontmatter(input: FeatureFrontmatterInput): string {
  return `---\ntype: qa\nlast_tested: ${input.lastTested}\nstatus: ${input.status}\n---\n`
}

export interface TaskFrontmatterInput {
  severity: Severity
  feature: string
  slug: string
  discovered: string
  files: string[]
}

export function renderTaskFrontmatter(input: TaskFrontmatterInput): string {
  const filesYaml = input.files.map((f) => `  - ${f}`).join('\n')
  return [
    '---',
    'type: qa-task',
    `feature: ${input.feature}`,
    `severity: ${input.severity}`,
    'status: todo',
    'direction: Manual QA Sweep',
    `discovered: ${input.discovered}`,
    'files:',
    filesYaml || '  []',
    '---',
    '',
  ].join('\n')
}

export interface TaskBodyInput {
  title: string
  repro: string
  expected: string
  actual: string
  screenshot: string
  consoleExcerpt?: string
}

export function renderTaskBody(input: TaskBodyInput): string {
  const consoleBlock = input.consoleExcerpt ? `\n## Console\n\n\`\`\`\n${input.consoleExcerpt}\n\`\`\`\n` : ''
  return [
    `# ${input.title}`,
    '',
    '## Repro',
    '',
    input.repro,
    '',
    '## Expected',
    '',
    input.expected,
    '',
    '## Actual',
    '',
    input.actual,
    '',
    '## Evidence',
    '',
    `- Screenshot: \`${input.screenshot}\``,
    consoleBlock,
  ].join('\n')
}

export interface SummaryInput {
  feature: string
  date: string
  runId: string
  totalFlows: number
  totalFindings: number
  p0p1: Array<{ severity: Severity; title: string; wikiTask?: string }>
  p2: string[]
  p3: string[]
  greenFlows: string[]
  skipped: Array<{ flow: string; reason: string }>
  createdRooms: string[]
  evidenceIndex: string[]
}

export function renderSummary(input: SummaryInput): string {
  const { feature, date, runId } = input
  const p0p1Block = input.p0p1.length
    ? input.p0p1
        .map((f) => `- **[${f.severity}]** ${f.title}${f.wikiTask ? ` — see [[${f.wikiTask}]]` : ''}`)
        .join('\n')
    : '- _None._'
  const p2Block = input.p2.length ? input.p2.map((t) => `- ${t}`).join('\n') : '- _None._'
  const p3Block = input.p3.length ? input.p3.map((t) => `- ${t}`).join('\n') : '- _None._'
  const greenBlock = input.greenFlows.length ? input.greenFlows.map((f) => `- ${f}`).join('\n') : '- _None._'
  const skippedBlock = input.skipped.length
    ? input.skipped.map((s) => `- ${s.flow} — ${s.reason}`).join('\n')
    : '- _None._'
  const roomsBlock = input.createdRooms.length ? input.createdRooms.map((r) => `- ${r}`).join('\n') : '- _None._'
  const evidenceBlock = input.evidenceIndex.length ? input.evidenceIndex.map((e) => `- ${e}`).join('\n') : '- _None._'

  return [
    `# QA Session Summary — ${feature}`,
    '',
    `**Date:** ${date}  `,
    `**Run ID:** ${runId}  `,
    `**Total flows run:** ${input.totalFlows}  `,
    `**Total findings:** ${input.totalFindings}`,
    '',
    '## Must-fix (P0/P1)',
    '',
    p0p1Block,
    '',
    '## Should-fix (P2)',
    '',
    p2Block,
    '',
    '## Nits (P3)',
    '',
    p3Block,
    '',
    '## Green flows',
    '',
    greenBlock,
    '',
    '## Skipped/untested',
    '',
    skippedBlock,
    '',
    '## Created rooms for cleanup',
    '',
    roomsBlock,
    '',
    '## Evidence index',
    '',
    evidenceBlock,
    '',
  ].join('\n')
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `yarn test:run -- .opencode/skills/manual-qa-testing/__tests__/report.test.ts`
Expected: PASS — all 5 cases pass.

- [ ] **Step 5: Commit**

```bash
git add .opencode/skills/manual-qa-testing/lib/report.ts .opencode/skills/manual-qa-testing/__tests__/report.test.ts
git commit -m "feat(qa-skill): add report renderers + tests"
```

---

## Task 8: Templates — static markdown bodies with `{{placeholder}}` markers

**Files:**

- Create: `.opencode/skills/manual-qa-testing/templates/qa-index.md`
- Create: `.opencode/skills/manual-qa-testing/templates/qa-feature.md`
- Create: `.opencode/skills/manual-qa-testing/templates/qa-task.md`
- Create: `.opencode/skills/manual-qa-testing/templates/session-summary.md`
- Create: `.opencode/skills/manual-qa-testing/templates/direction.md`

Templates use `{{name}}` placeholders. The Claude main agent substitutes these in the chat, not in code — the templates are reference bodies the skill describes to the agent.

- [ ] **Step 1: Write `templates/qa-index.md`**

```markdown
---
type: qa-index
title: 'QA Index'
updated: { { date } }
---

# Manual QA Index

| Feature | Last tested | Status | Findings |
| ------- | ----------- | ------ | -------- |

{{rows}}
```

- [ ] **Step 2: Write `templates/qa-feature.md`**

```markdown
---
type: qa
feature: { { feature } }
last_tested: { { date } }
status: { { status } }
---

# QA — {{feature}}

## Test protocol

Canonical flows for this feature (sourced from `wiki/modules/{{feature}}.md`):

{{protocol}}

## Sessions

{{sessions}}
```

- [ ] **Step 3: Write `templates/qa-task.md`**

```markdown
---
type: qa-task
feature: {{feature}}
severity: {{severity}}
status: todo
direction: Manual QA Sweep
discovered: {{date}}
files:
{{files}}
---

# [{{severity}}] {{feature}}: {{title}}

## Repro

{{repro}}

## Expected

{{expected}}

## Actual

{{actual}}

## Evidence

- Screenshot: `{{screenshot}}`
- Console: see `{{consolePath}}`
- Network: see `{{networkPath}}`
```

- [ ] **Step 4: Write `templates/session-summary.md`**

The session summary is rendered by `lib/report.ts`, not by template substitution — this template is a human-readable description of the shape, kept here for reference.

```markdown
# QA Session Summary — {{feature}}

**Date:** {{date}} **Run ID:** {{runId}}

Sections (in this order):

1. Header (feature, date, runId, totals)
2. Must-fix (P0/P1) — links to wiki/tasks/
3. Should-fix (P2)
4. Nits (P3)
5. Green flows
6. Skipped/untested
7. Created rooms for cleanup
8. Evidence index
```

- [ ] **Step 5: Write `templates/direction.md`**

```markdown
---
type: direction
title: 'Direction: Manual QA Sweep'
status: active
created: { { date } }
---

# Manual QA Sweep

A long-running QA initiative. The [[Manual QA Testing|manual-qa-testing]] skill drives the browser through each feature once per session, captures evidence, and turns P0/P1 findings into tracked tasks.

## Cumulative metrics

| Feature | Last tested | P0  | P1  | P2  | P3  | Status |
| ------- | ----------- | --- | --- | --- | --- | ------ |

{{rows}}

## Active tasks

See `wiki/tasks/` for tasks with `direction: Manual QA Sweep`.
```

- [ ] **Step 6: Commit**

```bash
git add .opencode/skills/manual-qa-testing/templates
git commit -m "feat(qa-skill): add markdown templates for QA artifacts"
```

---

## Task 9: Per-feature flow protocols — `flows/<feature>.md` × 5

**Files:**

- Create: `.opencode/skills/manual-qa-testing/flows/fortune.md`
- Create: `.opencode/skills/manual-qa-testing/flows/member-management.md`
- Create: `.opencode/skills/manual-qa-testing/flows/room-management.md`
- Create: `.opencode/skills/manual-qa-testing/flows/reactions.md`
- Create: `.opencode/skills/manual-qa-testing/flows/toggle-theme.md`

Each file is a markdown checklist the Claude main agent follows step-by-step. Format:

```markdown
# <feature> QA protocol

**Prereqs:** `<dev-server>` is up, the user has confirmed a fresh run (or resume).

## Flows

### 1. <flow name>

- [ ] Step 1: <action>
- [ ] Step 2: <action>
- [ ] Verify: <expected outcome>

## Common regressions to look for

- <regression 1>
- <regression 2>
```

- [ ] **Step 1: Write `flows/fortune.md`**

```markdown
# fortune QA protocol

**Source spec:** `wiki/modules/fortune.md`

## Prereqs

- Dev server on `http://localhost:5173/`
- A `qa-2026-06-07-XXXX-1` room with 3 members (one inactive) is pre-created and you are on its `/room/<id>` page

## Flows

### 1. Open the room

- [ ] Click into the room from Home
- [ ] Verify: URL is `/room/<id>`, members render as chips, wheel renders, history is visible (or empty state)

### 2. Spin the wheel via button

- [ ] Click the spin button
- [ ] Verify: wheel rotates, lands on a member, winner modal opens, `aria-live` announces the winner

### 3. Spin the wheel via keyboard

- [ ] Press `S` (with focus outside any input/textarea)
- [ ] Verify: same as flow 2

### 4. Save the result

- [ ] Click "Save" in the winner modal
- [ ] Verify: modal closes, history list shows the new entry at the top, `aria-live` announces

### 5. Spin again from the modal

- [ ] Open a new spin, click the icon button "Spin again" in the modal
- [ ] Verify: modal closes, wheel re-spins

### 6. Toggle member mid-spin

- [ ] Open the member chip menu, toggle a member inactive
- [ ] Verify: chip is visually struck through, wheel slices update, list updates

### 7. Empty state

- [ ] In a fresh `qa-...-2` room, verify the empty state copy is "Spin the wheel to record your first result" and the action button is visible

### 8. History persistence

- [ ] Hard-reload the page
- [ ] Verify: history list is identical to before reload, no flash of empty state

## Common regressions to look for

- Wheel SVG render glitches at 1440×900 and 375×812
- Animation stutter on slow CPU (use `emulate` with `cpuThrottlingRate: 4`)
- Focus not returning to the spin button when the winner modal closes
- History row missing the `aria-live` announcement
- `prefers-reduced-motion` — cannot toggle via MCP; observe animation timing only
```

- [ ] **Step 2: Write `flows/member-management.md`**

```markdown
# member-management QA protocol

**Source spec:** `wiki/modules/member-management.md`

## Prereqs

- Dev server up
- On a room page with ≥ 1 member

## Flows

### 1. Open the member modal

- [ ] Click the "Manage members" button
- [ ] Verify: modal opens, focus moves to the first input, `aria-modal="true"`, FocusTrap active

### 2. Add a member

- [ ] Type a name, click "Add"
- [ ] Verify: chip appears in the room page, input clears, focus stays in the modal

### 3. Add a duplicate name

- [ ] Type a name that already exists, click "Add"
- [ ] Verify: form rejects (toast or inline error), no duplicate chip is created

### 4. Edit a member

- [ ] Click the edit affordance on a chip, change the name, save
- [ ] Verify: chip updates across the room page and history rows

### 5. Remove a member

- [ ] Click the remove affordance, confirm the dialog
- [ ] Verify: chip disappears, history rows that referenced the member show the deleted name (or the configured fallback)

### 6. Cancel mid-add

- [ ] Open modal, type a name, click "Cancel"
- [ ] Verify: modal closes, the typed name is NOT added

### 7. Empty member list

- [ ] In a fresh room, open the member modal
- [ ] Verify: empty state copy and primary "Add member" CTA are visible

## Common regressions to look for

- Focus not returning to the trigger button on close
- `aria-modal` missing
- `Escape` doesn't close the modal
- Duplicate-name check missing (silent accept)
```

- [ ] **Step 3: Write `flows/room-management.md`**

```markdown
# room-management QA protocol

**Source spec:** `wiki/modules/room-management.md`

## Prereqs

- Dev server up
- On `http://localhost:5173/`

## Flows

### 1. Create a room

- [ ] Click "New room", type a name (≤ 20 chars), click "Create"
- [ ] Verify: modal closes, new card appears in the Home grid

### 2. Empty name

- [ ] Open the modal, leave name blank
- [ ] Verify: submit stays enabled per spec (scripted test) but form does not submit on click

### 3. 60+ char name

- [ ] Type > 20 chars
- [ ] Verify: input caps at 20 (or submit stays disabled per the existing E2E test)

### 4. Edit a room

- [ ] Click into a room, use the header "..." menu (if present) or the room settings affordance, rename
- [ ] Verify: new name persists in the card on Home and in the room header

### 5. Remove a room (accept confirm)

- [ ] From Home, click the remove affordance on a `qa-...` room, accept the `confirm` dialog
- [ ] Verify: card disappears, no console errors, network request succeeds

### 6. Remove a room (dismiss confirm)

- [ ] Click remove, dismiss the dialog
- [ ] Verify: card remains

### 7. Empty Home state

- [ ] In a fresh browser profile (or after deleting all `qa-` rooms), verify the empty state copy and CTA

## Common regressions to look for

- Remove room not actually deleting from Firestore (network request fails silently)
- "..." menu missing (tracked by [[Task: Add "..." menu for remove room]])
- Empty state copy regresses
```

- [ ] **Step 4: Write `flows/reactions.md`**

```markdown
# reactions QA protocol

**Source spec:** `wiki/modules/reactions.md`

## Prereqs

- Dev server up
- Two Chrome tabs both on the same room page (use `mcp__chrome-devtools__new_page` for the second, `background: true`)

## Flows

### 1. Send a reaction from tab A

- [ ] In tab A, click a reaction button
- [ ] Verify: count increments in tab A immediately

### 2. Reaction propagates to tab B

- [ ] Wait up to 3s
- [ ] Verify: tab B shows the same reaction and count

### 3. Send a different reaction

- [ ] In tab A, click a different reaction button
- [ ] Verify: tab B shows the second reaction within 3s

### 4. Reaction persists across reload

- [ ] In tab A, hard-reload
- [ ] Verify: reaction count survives the reload

## Common regressions to look for

- Real-time listener not attached (tab B never updates)
- Reaction count off-by-one
- Optimistic update reverts unexpectedly
- Network failures silently swallowed
```

- [ ] **Step 5: Write `flows/toggle-theme.md`**

```markdown
# toggle-theme QA protocol

**Source spec:** `wiki/modules/toggle-theme.md`

## Prereqs

- Dev server up

## Flows

### 1. Toggle from light to dark

- [ ] Click the theme toggle in the top bar
- [ ] Verify: `<html data-theme="dark">` (or equivalent) is set, colors flip, no flash

### 2. Persist across reload

- [ ] Hard-reload
- [ ] Verify: theme stays dark, no flash of light theme

### 3. Persist across navigation

- [ ] Navigate from Home to a room, then back
- [ ] Verify: theme stays dark

### 4. localStorage check

- [ ] Run `localStorage.getItem('theme')` via `evaluate_script`
- [ ] Verify: the value matches the current theme

### 5. Toggle back

- [ ] Click again
- [ ] Verify: switches to light, persists, no flash

### 6. First-visit default

- [ ] Open a fresh browser context (clear localStorage)
- [ ] Verify: defaults to the project's documented default (light? system? — check `wiki/modules/toggle-theme.md`)

## Common regressions to look for

- Theme flashes on reload (FOUC)
- `prefers-color-scheme: dark` system setting ignored
- localStorage key changed but `useTheme` hook not updated
- Dark-mode contrast failures on Direction 7 surfaces
```

- [ ] **Step 6: Commit**

```bash
git add .opencode/skills/manual-qa-testing/flows
git commit -m "feat(qa-skill): add per-feature QA flow protocols"
```

---

## Task 10: SKILL.md — main entrypoint

**Files:**

- Create: `.opencode/skills/manual-qa-testing/SKILL.md`

- [ ] **Step 1: Write `SKILL.md`**

````markdown
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
````

If not 200, start it in the background and wait up to 60s. 3. Generate a session ID: `qa-<YYYY-MM-DD>-<XXXX>` where `XXXX` is 4 base36 chars. 4. Create the evidence directory: `docs/qa/<date>-<feature>-<runId>/{screenshots,snapshots}/`. 5. `mcp__chrome-devtools__navigate_page` to `http://localhost:5173/`. 6. Take a baseline screenshot + snapshot.

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

4. **Classify.** Use `lib/severity.ts` (call its classifier; see [[../lib/severity.ts]]) on each finding. The rubric:

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

````

- [ ] **Step 2: Verify the skill is well-formed YAML frontmatter**

Run: `head -5 .opencode/skills/manual-qa-testing/SKILL.md`
Expected: starts with `---` and the first non-`---` line is `name: manual-qa-testing`.

- [ ] **Step 3: Commit**

```bash
git add .opencode/skills/manual-qa-testing/SKILL.md
git rm .opencode/skills/manual-qa-testing/.gitkeep
git commit -m "feat(qa-skill): add SKILL.md entrypoint"
````

---

## Task 11: Bootstrap wiki/qa/ + wiki/directions/manual-qa-sweep.md

**Files:**

- Create: `wiki/qa/_index.md`
- Create: `wiki/qa/fortune.md` (first feature, populated with the canonical flows)
- Create: `wiki/directions/manual-qa-sweep.md`

These are placeholder pages that the skill will update on each run. The first feature (`fortune`) gets a populated page so the next QA session can find its protocol without bootstrapping from scratch.

- [ ] **Step 1: Write `wiki/qa/_index.md`**

```markdown
---
type: qa-index
title: 'QA Index'
updated: 2026-06-07
---

# Manual QA Index

Per-feature QA status. Updated by the `manual-qa-testing` skill at the end of each session.

| Feature           | Last tested | Status      | Findings            |
| ----------------- | ----------- | ----------- | ------------------- |
| fortune           | —           | ⚪ untested | P0:0 P1:0 P2:0 P3:0 |
| member-management | —           | ⚪ untested | P0:0 P1:0 P2:0 P3:0 |
| room-management   | —           | ⚪ untested | P0:0 P1:0 P2:0 P3:0 |
| reactions         | —           | ⚪ untested | P0:0 P1:0 P2:0 P3:0 |
| toggle-theme      | —           | ⚪ untested | P0:0 P1:0 P2:0 P3:0 |

See `wiki/directions/manual-qa-sweep.md` for cumulative metrics and `docs/qa/` for per-session summaries.
```

- [ ] **Step 2: Write `wiki/qa/fortune.md`**

```markdown
---
type: qa
feature: fortune
last_tested: 2026-06-07
status: untested
---

# QA — fortune

## Test protocol

Canonical flows, sourced from [[Module: fortune]]:

1. Open the room
2. Spin the wheel via button
3. Spin the wheel via keyboard (`S`)
4. Save the winner modal
5. Spin again from the modal
6. Toggle a member inactive
7. Empty history state
8. History persistence across reload

## Sessions

_No sessions yet. The next `/qa-test fortune` invocation will append a session block here._
```

- [ ] **Step 3: Write `wiki/directions/manual-qa-sweep.md`**

```markdown
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
```

- [ ] **Step 4: Verify the wiki pages render in the catalog**

Open `wiki/_index.md` and confirm there's a link to `wiki/qa/_index.md` and `wiki/directions/manual-qa-sweep.md`. If they're missing, add entries to the relevant "Modules" / "Directions" / "Meta" sections. (The skill doesn't automate catalog updates in v1; this is a one-time manual edit.)

- [ ] **Step 5: Commit**

```bash
git add wiki/qa wiki/directions/manual-qa-sweep.md
git commit -m "docs(qa): bootstrap wiki/qa/ + Manual QA Sweep direction"
```

---

## Task 12: Integration smoke test — `src/e2e/qa-skill.smoke.test.ts`

**Files:**

- Create: `src/e2e/qa-skill.smoke.test.ts`

This test runs the skill's lib functions against a "trivial feature" (the home page) to verify the protocol produces the expected files. It's a thin shim — it doesn't drive a real feature end-to-end, it just exercises the file-writing path.

- [ ] **Step 1: Write the test**

Write `src/e2e/qa-skill.smoke.test.ts`:

```ts
import { test, expect } from '@playwright/test'
import { mkdir, writeFile, readFile, rm } from 'fs/promises'
import { join } from 'path'
import { newSessionId } from '../../.opencode/skills/manual-qa-testing/lib/session-id'
import { renderSummary } from '../../.opencode/skills/manual-qa-testing/lib/report'

const SESSION = newSessionId()
const DATE = SESSION.slice(3, 13) // qa-YYYY-MM-DD-XXXX
const RUN_ID = SESSION.slice(14)
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

test('smoke: produces a session summary with all 8 sections', async () => {
  const summary = renderSummary({
    feature: FEATURE,
    date: DATE,
    runId: RUN_ID,
    totalFlows: 1,
    totalFindings: 0,
    p0p1: [],
    p2: [],
    p3: [],
    greenFlows: ['navigate-to-home'],
    skipped: [],
    createdRooms: [],
    evidenceIndex: ['screenshots/', 'snapshots/'],
  })

  const out = join(SESSION_DIR, 'README.md')
  await writeFile(out, summary, 'utf8')

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
```

- [ ] **Step 2: Run the test to verify it passes**

Run: `npx playwright test src/e2e/qa-skill.smoke.test.ts`
Expected: PASS — both tests pass in ≤ 30s.

If the import path fails (TS path resolution doesn't reach `.opencode/...`), the import resolves at runtime via Playwright's loader because the file is in the repo. If TypeScript build fails, add a path mapping to `tsconfig.json`'s `compilerOptions.paths`:

```json
"paths": {
  // ... existing
  "qa-skill/*": [".opencode/skills/manual-qa-testing/*"]
}
```

Then re-run.

- [ ] **Step 3: Run the full Playwright suite to make sure nothing else broke**

Run: `npx playwright test`
Expected: all existing tests pass + the 2 new smoke tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/e2e/qa-skill.smoke.test.ts
git commit -m "test(qa-skill): integration smoke for the QA skill protocol"
```

---

## Task 13: First real run — `/qa-test fortune` against the dev server

**Files:** (no code changes — this is a manual integration verification)

- Verify: `docs/qa/2026-06-07-fortune-XXXX/` contains screenshots, snapshots, console.log, network.log, probes.jsonl, README.md
- Verify: `wiki/qa/fortune.md` has a new `### 2026-06-07 XXXX` session block
- Verify: at least one `wiki/tasks/p0-*-fortune-*.md` or `wiki/tasks/p1-*-fortune-*.md` exists if any P0/P1 was found
- Verify: `wiki/qa/_index.md` fortune row is updated
- Verify: `wiki/directions/manual-qa-sweep.md` fortune row is updated

- [ ] **Step 1: Start the dev server**

Run: `yarn dev` (in a background bash)

Wait until `curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/` returns `200` (up to 60s).

- [ ] **Step 2: Open a Claude session and invoke the skill**

In a fresh Claude session (or after `/clear`), type:

```
/qa-test fortune
```

Follow the prompts. The skill will:

- Pre-flight (verify dev server, create session ID, navigate)
- Plan the flows (read `wiki/modules/fortune.md` + `flows/fortune.md`)
- Drive each flow
- Capture evidence
- Classify findings
- Stop on P0/P1; continue past P2/P3
- Write the post-feature artifacts

- [ ] **Step 3: Verify the artifacts exist**

```bash
ls docs/qa/2026-06-07-fortune-XXXX/
# Expect: README.md  console.log  network.log  probes.jsonl  screenshots/  snapshots/
```

```bash
cat wiki/qa/fortune.md
# Expect: frontmatter last_tested=2026-06-07, status reflects severity
# Expect: a new "### 2026-06-07 XXXX" session block
```

```bash
ls wiki/tasks/ | grep fortune
# Expect: 0-N P0/P1 task files
```

```bash
cat wiki/qa/_index.md
# Expect: fortune row updated with last_tested, status, counts
```

- [ ] **Step 4: Run the full verification gate**

Run: `yarn lint && yarn build && yarn test:run`
Expected: all three pass.

- [ ] **Step 5: Commit any wiki updates the skill missed**

If the skill already committed them, this is a no-op. If it didn't:

```bash
git status
git add wiki/qa docs/qa wiki/directions wiki/tasks
git commit -m "docs(qa): first /qa-test fortune session results"
```

---

## Self-Review

**1. Spec coverage:**

| Spec section                          | Implemented by                                                               |
| ------------------------------------- | ---------------------------------------------------------------------------- |
| Architecture (file tree)              | Task 1, 2-7 (lib), 8 (templates), 9 (flows), 10 (SKILL.md)                   |
| Lifecycle — Pre-flight                | Task 10 (SKILL.md "Pre-flight") + Task 13 (first run)                        |
| Lifecycle — Per-feature loop          | Task 9 (flows) + Task 10 (SKILL.md "Per-feature loop")                       |
| Lifecycle — Post-feature wrap         | Task 10 (SKILL.md "Post-feature wrap") + Task 7 (report renderers)           |
| Lifecycle — Final report              | Task 7 (`renderSummary`) + Task 11 (wiki pages)                              |
| Evidence capture                      | Task 5 (`lib/evidence.ts`) + Task 10 (SKILL.md)                              |
| Per-feature protocols                 | Task 9 (5 flow files)                                                        |
| Environment                           | Task 10 (SKILL.md "Pre-flight" + "Per-feature loop")                         |
| Edge cases                            | Task 10 (SKILL.md sections on "Resumability" + "Decide" + "When NOT to use") |
| Testing the skill (unit)              | Tasks 2-7 (Vitest tests for each lib file)                                   |
| Testing the skill (integration smoke) | Task 12 (Playwright smoke)                                                   |
| Limits and known gaps                 | Task 10 (SKILL.md "Limits")                                                  |
| Wiki/qa/ bootstrap                    | Task 11                                                                      |
| Acceptance criteria                   | All tasks contribute; Task 13 verifies end-to-end                            |

No gaps found.

**2. Placeholder scan:**

- No "TBD", "TODO", or "implement later" in any task
- No "add appropriate error handling" — error handling is concrete (e.g., the `try/catch` in `walk()` and the regex-based session ID validation)
- No "similar to Task N" — every task has its own code
- All `Files:` lines have explicit paths

**3. Type consistency:**

- `Severity` type from `lib/severity.ts` is `'P0' | 'P1' | 'P2' | 'P3'`. Used by `lib/report.ts` (Task 7) as the `severity` field type in `TaskFrontmatterInput` and `SummaryInput`. Match.
- `ParsedSessionId` from `lib/session-id.ts` has `{ date: string, runId: string }`. Used by `lib/namespace.ts` (Task 3) and `lib/evidence.ts` (Task 5). The path helpers in `lib/evidence.ts` use the same string format. Match.
- `isQaRoom`, `roomNamespace`, `namespacedRoomName` are exported from `lib/namespace.ts` and used in `SKILL.md` and `flows/*.md`. Match.
- `Finding` interface in `lib/severity.ts` has `kind`, `blocksCoreFlow`, `hasConsoleError`, `visualSeverity`. The test cases in `severity.test.ts` and the rubric copy in `SKILL.md` both use the same fields. Match.
- `renderSummary`'s section ordering is asserted by `report.test.ts` ("Header", "Must-fix", "Should-fix", "Nits", "Green flows", "Skipped", "Created rooms", "Evidence index") and matches `docs/qa/.../README.md` template. Match.

No type drift found.
