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
