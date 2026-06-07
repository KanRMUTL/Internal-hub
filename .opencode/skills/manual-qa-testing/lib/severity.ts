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
