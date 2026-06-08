import { join } from 'path'

export function sessionDir(date: string, feature: string, runId: string): string {
  return join('docs', 'qa', `${date}-${feature}-${runId}`)
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
