export function roomNamespace(date: string, runId: string): string {
  return `qa-${date}-${runId}`
}

export function namespacedRoomName(sessionId: string, counter: number): string {
  return `${sessionId}-${counter}`
}

export function isQaRoom(roomName: string): boolean {
  return roomName.startsWith('qa-')
}
