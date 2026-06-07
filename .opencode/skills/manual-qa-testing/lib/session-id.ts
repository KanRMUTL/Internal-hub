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
