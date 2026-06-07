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
  const filesYaml = input.files.length ? input.files.map((f) => `  - ${f}`).join('\n') : '  []'
  return [
    '---',
    'type: qa-task',
    `feature: ${input.feature}`,
    `severity: ${input.severity}`,
    'status: todo',
    'direction: Manual QA Sweep',
    `discovered: ${input.discovered}`,
    'files:',
    filesYaml,
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
