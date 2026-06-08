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
  const feature = 'fortune'
  const baseDir = sessionDir('2026-06-07', feature, 'abcd')

  it('sessionDir joins date-feature-runId under docs/qa/', () => {
    expect(baseDir).toBe('docs/qa/2026-06-07-fortune-abcd')
  })

  it('screenshotPath produces a stable name with step + state', () => {
    expect(screenshotPath(baseDir, 'open-wheel', 'spinning')).toBe(
      'docs/qa/2026-06-07-fortune-abcd/screenshots/open-wheel-spinning.png'
    )
  })

  it('snapshotPath produces a .txt file under snapshots/', () => {
    expect(snapshotPath(baseDir, 'before-spin')).toBe('docs/qa/2026-06-07-fortune-abcd/snapshots/before-spin.txt')
  })

  it('consoleLogPath, networkLogPath, probesPath are stable filenames', () => {
    expect(consoleLogPath(baseDir)).toBe('docs/qa/2026-06-07-fortune-abcd/console.log')
    expect(networkLogPath(baseDir)).toBe('docs/qa/2026-06-07-fortune-abcd/network.log')
    expect(probesPath(baseDir)).toBe('docs/qa/2026-06-07-fortune-abcd/probes.jsonl')
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

  it('returns the snapshot when prev is null', () => {
    expect(diffSnapshots(null, 'first snapshot')).toBe('first snapshot')
  })
})
