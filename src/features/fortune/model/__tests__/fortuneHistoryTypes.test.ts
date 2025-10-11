import { describe, it, expect } from 'vitest'
import type {
  FortuneHistoryEntry,
  CreateFortuneHistoryEntryData,
  FortuneHistoryTableProps,
} from '../fortuneHistoryTypes'

describe('fortuneHistoryTypes', () => {
  describe('FortuneHistoryEntry', () => {
    it('should have correct structure for complete entry', () => {
      const entry: FortuneHistoryEntry = {
        id: 'entry-123',
        winnerId: 'winner-456',
        winnerName: 'John Doe',
        roomId: 'room-789',
        createdAt: '2024-01-15T10:30:00.000Z',
      }

      expect(entry.id).toBe('entry-123')
      expect(entry.winnerId).toBe('winner-456')
      expect(entry.winnerName).toBe('John Doe')
      expect(entry.roomId).toBe('room-789')
      expect(entry.createdAt).toBe('2024-01-15T10:30:00.000Z')
    })

    it('should accept empty strings for optional fields', () => {
      const entry: FortuneHistoryEntry = {
        id: '',
        winnerId: '',
        winnerName: '',
        roomId: '',
        createdAt: '',
      }

      expect(typeof entry.id).toBe('string')
      expect(typeof entry.winnerId).toBe('string')
      expect(typeof entry.winnerName).toBe('string')
      expect(typeof entry.roomId).toBe('string')
      expect(typeof entry.createdAt).toBe('string')
    })
  })

  describe('CreateFortuneHistoryEntryData', () => {
    it('should have correct structure without id and createdAt', () => {
      const entryData: CreateFortuneHistoryEntryData = {
        winnerId: 'winner-456',
        winnerName: 'John Doe',
        roomId: 'room-789',
      }

      expect(entryData.winnerId).toBe('winner-456')
      expect(entryData.winnerName).toBe('John Doe')
      expect(entryData.roomId).toBe('room-789')

      // Should not have id or createdAt
      expect('id' in entryData).toBe(false)
      expect('createdAt' in entryData).toBe(false)
    })

    it('should accept special characters in winner name', () => {
      const entryData: CreateFortuneHistoryEntryData = {
        winnerId: 'winner-456',
        winnerName: "José María O'Connor-Smith 🎉",
        roomId: 'room-789',
      }

      expect(entryData.winnerName).toBe("José María O'Connor-Smith 🎉")
    })
  })

  describe('FortuneHistoryTableProps', () => {
    it('should have required roomId and optional className', () => {
      const props: FortuneHistoryTableProps = {
        roomId: 'room-123',
      }

      expect(props.roomId).toBe('room-123')
      expect(props.className).toBeUndefined()
    })

    it('should accept optional className', () => {
      const props: FortuneHistoryTableProps = {
        roomId: 'room-123',
        className: 'custom-table-class',
      }

      expect(props.roomId).toBe('room-123')
      expect(props.className).toBe('custom-table-class')
    })
  })

  describe('Type Compatibility', () => {
    it('should allow CreateFortuneHistoryEntryData to be used for FortuneHistoryEntry creation', () => {
      const createData: CreateFortuneHistoryEntryData = {
        winnerId: 'winner-456',
        winnerName: 'John Doe',
        roomId: 'room-789',
      }

      // Simulate what happens in the service
      const fullEntry: FortuneHistoryEntry = {
        id: 'generated-id',
        createdAt: new Date().toISOString(),
        ...createData,
      }

      expect(fullEntry.winnerId).toBe(createData.winnerId)
      expect(fullEntry.winnerName).toBe(createData.winnerName)
      expect(fullEntry.roomId).toBe(createData.roomId)
      expect(fullEntry.id).toBe('generated-id')
      expect(typeof fullEntry.createdAt).toBe('string')
    })
  })
})
