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
    it('accepts an all-numeric runId (digits are valid base36)', () => {
      expect(isValidSessionId('qa-2026-06-07-1234')).toBe(true)
    })
    it('rejects an uppercase runId', () => {
      expect(isValidSessionId('qa-2026-06-07-ABCD')).toBe(false)
    })
    it('rejects a 5-char runId', () => {
      expect(isValidSessionId('qa-2026-06-07-abcde')).toBe(false)
    })
    it('rejects a 3-char runId', () => {
      expect(isValidSessionId('qa-2026-06-07-abc')).toBe(false)
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
