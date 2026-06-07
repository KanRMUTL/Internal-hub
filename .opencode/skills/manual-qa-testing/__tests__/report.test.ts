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

  it('omits the Console section when no excerpt is provided', () => {
    const body = renderTaskBody({
      title: 'X',
      repro: 'r',
      expected: 'e',
      actual: 'a',
      screenshot: 's',
    })
    expect(body).not.toContain('## Console')
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
    const headings = ['Must-fix', 'Should-fix', 'Nits', 'Green flows', 'Skipped', 'Created rooms', 'Evidence index']
    let prev = -1
    for (const h of headings) {
      const idx = md.indexOf(`## ${h}`)
      expect(idx).toBeGreaterThan(prev)
      prev = idx
    }
  })
})
