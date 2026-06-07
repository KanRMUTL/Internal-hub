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
