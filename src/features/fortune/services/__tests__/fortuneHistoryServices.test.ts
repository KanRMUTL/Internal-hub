import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest'
import { collection, query, orderBy, limit, addDoc, deleteDoc, getDocs } from 'firebase/firestore'
import {
  getFortuneHistoryQuery,
  createFortuneHistoryEntry,
  clearFortuneHistory,
  getNextSpinNumber,
} from '../fortuneHistoryServices'
import { CreateFortuneHistoryEntryData } from '../../model/fortuneHistoryTypes'

// Mock Firebase SDK
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  addDoc: vi.fn(),
  deleteDoc: vi.fn(),
  getDocs: vi.fn(),
}))

// Mock Firebase config
vi.mock('shared/config/firebase', () => ({
  db: {},
}))

// Mock constants
vi.mock('../../config/fortuneHistoryConstant', () => ({
  FORTUNE_HISTORY_COLLECTION: 'fortune-history',
  FORTUNE_HISTORY_QUERY_LIMIT: 50,
  FORTUNE_HISTORY_ORDER_BY: 'createdAt',
  FORTUNE_HISTORY_ORDER_DIRECTION: 'desc',
}))

describe('fortuneHistoryServices', () => {
  const mockRoomId = 'test-room-123'
  const mockCollection = { id: 'mock-collection' }
  const mockQuery = { id: 'mock-query' }

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset Date.now to a fixed timestamp for consistent testing
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T10:30:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('getFortuneHistoryQuery', () => {
    it('should create a properly configured Firestore query', () => {
      // Arrange
      ;(collection as Mock).mockReturnValue(mockCollection)
      ;(query as Mock).mockReturnValue(mockQuery)
      ;(orderBy as Mock).mockReturnValue('mock-orderBy')
      ;(limit as Mock).mockReturnValue('mock-limit')

      // Act
      const result = getFortuneHistoryQuery(mockRoomId)

      // Assert
      expect(collection).toHaveBeenCalledWith({}, 'room', mockRoomId, 'fortune-history')
      expect(query).toHaveBeenCalledWith(mockCollection, 'mock-orderBy', 'mock-limit')
      expect(orderBy).toHaveBeenCalledWith('createdAt', 'desc')
      expect(limit).toHaveBeenCalledWith(50)
      expect(result).toBe(mockQuery)
    })

    it('should handle different room IDs correctly', () => {
      // Arrange
      const differentRoomId = 'different-room-456'
      ;(collection as Mock).mockReturnValue(mockCollection)
      ;(query as Mock).mockReturnValue(mockQuery)

      // Act
      getFortuneHistoryQuery(differentRoomId)

      // Assert
      expect(collection).toHaveBeenCalledWith({}, 'room', differentRoomId, 'fortune-history')
    })
  })

  describe('createFortuneHistoryEntry', () => {
    const validEntryData: CreateFortuneHistoryEntryData = {
      roomId: mockRoomId,
      winnerId: 'winner-123',
      winnerName: 'John Doe',
    }

    it('should create fortune history entry with valid data', async () => {
      // Arrange
      ;(collection as Mock).mockReturnValue(mockCollection)
      ;(addDoc as Mock).mockResolvedValue({ id: 'new-doc-id' })

      // Act
      await createFortuneHistoryEntry(validEntryData)

      // Assert
      expect(collection).toHaveBeenCalledWith({}, 'room', mockRoomId, 'fortune-history')
      expect(addDoc).toHaveBeenCalledWith(mockCollection, {
        winnerId: 'winner-123',
        winnerName: 'John Doe',
        roomId: mockRoomId,
        createdAt: '2024-01-15T10:30:00.000Z',
      })
    })

    it('should handle special characters in winner name', async () => {
      // Arrange
      const entryWithSpecialChars = {
        ...validEntryData,
        winnerName: "José María O'Connor-Smith",
      }
      ;(collection as Mock).mockReturnValue(mockCollection)
      ;(addDoc as Mock).mockResolvedValue({ id: 'new-doc-id' })

      // Act
      await createFortuneHistoryEntry(entryWithSpecialChars)

      // Assert
      expect(addDoc).toHaveBeenCalledWith(mockCollection, {
        winnerId: 'winner-123',
        winnerName: "José María O'Connor-Smith",
        roomId: mockRoomId,
        createdAt: '2024-01-15T10:30:00.000Z',
      })
    })

    it('should handle empty winner name', async () => {
      // Arrange
      const entryWithEmptyName = {
        ...validEntryData,
        winnerName: '',
      }
      ;(collection as Mock).mockReturnValue(mockCollection)
      ;(addDoc as Mock).mockResolvedValue({ id: 'new-doc-id' })

      // Act
      await createFortuneHistoryEntry(entryWithEmptyName)

      // Assert
      expect(addDoc).toHaveBeenCalledWith(mockCollection, {
        winnerId: 'winner-123',
        winnerName: '',
        roomId: mockRoomId,
        createdAt: '2024-01-15T10:30:00.000Z',
      })
    })

    it('should propagate Firebase errors', async () => {
      // Arrange
      const firebaseError = new Error('Firebase: Permission denied')
      ;(collection as Mock).mockReturnValue(mockCollection)
      ;(addDoc as Mock).mockRejectedValue(firebaseError)

      // Act & Assert
      await expect(createFortuneHistoryEntry(validEntryData)).rejects.toThrow('Firebase: Permission denied')
    })

    it('should handle network errors', async () => {
      // Arrange
      const networkError = new Error('Network request failed')
      ;(collection as Mock).mockReturnValue(mockCollection)
      ;(addDoc as Mock).mockRejectedValue(networkError)

      // Act & Assert
      await expect(createFortuneHistoryEntry(validEntryData)).rejects.toThrow('Network request failed')
    })

    it('should generate ISO timestamp correctly', async () => {
      // Arrange
      ;(collection as Mock).mockReturnValue(mockCollection)
      ;(addDoc as Mock).mockResolvedValue({ id: 'new-doc-id' })

      // Act
      await createFortuneHistoryEntry(validEntryData)

      // Assert
      const addDocCall = (addDoc as Mock).mock.calls[0][1]
      expect(addDocCall.createdAt).toBe('2024-01-15T10:30:00.000Z')
      expect(new Date(addDocCall.createdAt).toISOString()).toBe(addDocCall.createdAt)
    })
  })

  describe('clearFortuneHistory', () => {
    it('should clear all fortune history entries for a room', async () => {
      // Arrange
      const mockDoc1 = { ref: { id: 'doc1' } }
      const mockDoc2 = { ref: { id: 'doc2' } }
      const mockSnapshot = {
        docs: [mockDoc1, mockDoc2],
      }

      ;(collection as Mock).mockReturnValue(mockCollection)
      ;(getDocs as Mock).mockResolvedValue(mockSnapshot)
      ;(deleteDoc as Mock).mockResolvedValue(undefined)

      // Act
      await clearFortuneHistory(mockRoomId)

      // Assert
      expect(collection).toHaveBeenCalledWith({}, 'room', mockRoomId, 'fortune-history')
      expect(getDocs).toHaveBeenCalledWith(mockCollection)
      expect(deleteDoc).toHaveBeenCalledTimes(2)
      expect(deleteDoc).toHaveBeenCalledWith(mockDoc1.ref)
      expect(deleteDoc).toHaveBeenCalledWith(mockDoc2.ref)
    })

    it('should handle empty collection gracefully', async () => {
      // Arrange
      const emptySnapshot = { docs: [] }
      ;(collection as Mock).mockReturnValue(mockCollection)
      ;(getDocs as Mock).mockResolvedValue(emptySnapshot)

      // Act
      await clearFortuneHistory(mockRoomId)

      // Assert
      expect(getDocs).toHaveBeenCalledWith(mockCollection)
      expect(deleteDoc).not.toHaveBeenCalled()
    })

    it('should handle partial deletion failures', async () => {
      // Arrange
      const mockDoc1 = { ref: { id: 'doc1' } }
      const mockDoc2 = { ref: { id: 'doc2' } }
      const mockSnapshot = { docs: [mockDoc1, mockDoc2] }

      ;(collection as Mock).mockReturnValue(mockCollection)
      ;(getDocs as Mock).mockResolvedValue(mockSnapshot)
      ;(deleteDoc as Mock)
        .mockResolvedValueOnce(undefined) // First delete succeeds
        .mockRejectedValueOnce(new Error('Delete failed')) // Second delete fails

      // Act & Assert
      await expect(clearFortuneHistory(mockRoomId)).rejects.toThrow('Delete failed')
    })

    it('should propagate getDocs errors', async () => {
      // Arrange
      const getDocsError = new Error('Failed to fetch documents')
      ;(collection as Mock).mockReturnValue(mockCollection)
      ;(getDocs as Mock).mockRejectedValue(getDocsError)

      // Act & Assert
      await expect(clearFortuneHistory(mockRoomId)).rejects.toThrow('Failed to fetch documents')
    })
  })

  describe('getNextSpinNumber', () => {
    it('should return 1 for empty collection', async () => {
      // Arrange
      const emptySnapshot = { size: 0 }
      ;(collection as Mock).mockReturnValue(mockCollection)
      ;(getDocs as Mock).mockResolvedValue(emptySnapshot)

      // Act
      const result = await getNextSpinNumber(mockRoomId)

      // Assert
      expect(collection).toHaveBeenCalledWith({}, 'room', mockRoomId, 'fortune-history')
      expect(getDocs).toHaveBeenCalledWith(mockCollection)
      expect(result).toBe(1)
    })

    it('should return correct next number for existing entries', async () => {
      // Arrange
      const snapshotWithEntries = { size: 5 }
      ;(collection as Mock).mockReturnValue(mockCollection)
      ;(getDocs as Mock).mockResolvedValue(snapshotWithEntries)

      // Act
      const result = await getNextSpinNumber(mockRoomId)

      // Assert
      expect(result).toBe(6)
    })

    it('should handle large numbers correctly', async () => {
      // Arrange
      const largeSnapshot = { size: 999 }
      ;(collection as Mock).mockReturnValue(mockCollection)
      ;(getDocs as Mock).mockResolvedValue(largeSnapshot)

      // Act
      const result = await getNextSpinNumber(mockRoomId)

      // Assert
      expect(result).toBe(1000)
    })

    it('should propagate Firebase errors', async () => {
      // Arrange
      const firebaseError = new Error('Firebase: Collection not found')
      ;(collection as Mock).mockReturnValue(mockCollection)
      ;(getDocs as Mock).mockRejectedValue(firebaseError)

      // Act & Assert
      await expect(getNextSpinNumber(mockRoomId)).rejects.toThrow('Firebase: Collection not found')
    })

    it('should handle different room IDs correctly', async () => {
      // Arrange
      const differentRoomId = 'room-456'
      const snapshot = { size: 3 }
      ;(collection as Mock).mockReturnValue(mockCollection)
      ;(getDocs as Mock).mockResolvedValue(snapshot)

      // Act
      const result = await getNextSpinNumber(differentRoomId)

      // Assert
      expect(collection).toHaveBeenCalledWith({}, 'room', differentRoomId, 'fortune-history')
      expect(result).toBe(4)
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('should handle undefined roomId gracefully', async () => {
      // Arrange
      ;(collection as Mock).mockReturnValue(mockCollection)

      // Act & Assert - These should not throw but pass undefined to Firebase
      expect(() => getFortuneHistoryQuery(undefined as unknown as string)).not.toThrow()
      expect(collection).toHaveBeenCalledWith({}, 'room', undefined, 'fortune-history')
    })

    it('should handle null values in entry data', async () => {
      // Arrange
      const entryWithNulls = {
        roomId: mockRoomId,
        winnerId: null as unknown as string,
        winnerName: null as unknown as string,
      }
      ;(collection as Mock).mockReturnValue(mockCollection)
      ;(addDoc as Mock).mockResolvedValue({ id: 'new-doc-id' })

      // Act
      await createFortuneHistoryEntry(entryWithNulls)

      // Assert
      expect(addDoc).toHaveBeenCalledWith(mockCollection, {
        winnerId: null,
        winnerName: null,
        roomId: mockRoomId,
        createdAt: '2024-01-15T10:30:00.000Z',
      })
    })

    it('should handle very long winner names', async () => {
      // Arrange
      const longName = 'A'.repeat(1000) // Very long name
      const entryWithLongName = {
        roomId: mockRoomId,
        winnerId: 'winner-123',
        winnerName: longName,
      }
      ;(collection as Mock).mockReturnValue(mockCollection)
      ;(addDoc as Mock).mockResolvedValue({ id: 'new-doc-id' })

      // Act
      await createFortuneHistoryEntry(entryWithLongName)

      // Assert
      expect(addDoc).toHaveBeenCalledWith(mockCollection, {
        winnerId: 'winner-123',
        winnerName: longName,
        roomId: mockRoomId,
        createdAt: '2024-01-15T10:30:00.000Z',
      })
    })

    it('should handle concurrent operations correctly', async () => {
      // Arrange
      const entryData1 = { roomId: mockRoomId, winnerId: 'winner-1', winnerName: 'Winner 1' }
      const entryData2 = { roomId: mockRoomId, winnerId: 'winner-2', winnerName: 'Winner 2' }

      ;(collection as Mock).mockReturnValue(mockCollection)
      ;(addDoc as Mock).mockResolvedValue({ id: 'new-doc-id' })

      // Act - Simulate concurrent saves
      const promises = [createFortuneHistoryEntry(entryData1), createFortuneHistoryEntry(entryData2)]

      await Promise.all(promises)

      // Assert
      expect(addDoc).toHaveBeenCalledTimes(2)
    })

    it('should handle Unicode characters in winner names', async () => {
      // Arrange
      const unicodeEntry = {
        roomId: mockRoomId,
        winnerId: 'winner-123',
        winnerName: '🎉 José María 中文 العربية 🏆',
      }
      ;(collection as Mock).mockReturnValue(mockCollection)
      ;(addDoc as Mock).mockResolvedValue({ id: 'new-doc-id' })

      // Act
      await createFortuneHistoryEntry(unicodeEntry)

      // Assert
      expect(addDoc).toHaveBeenCalledWith(mockCollection, {
        winnerId: 'winner-123',
        winnerName: '🎉 José María 中文 العربية 🏆',
        roomId: mockRoomId,
        createdAt: '2024-01-15T10:30:00.000Z',
      })
    })
  })

  describe('Integration Scenarios', () => {
    it('should handle complete fortune wheel flow simulation', async () => {
      // Arrange - Simulate a complete flow: get next number, create entry, verify count
      const initialSnapshot = { size: 5 }
      const finalSnapshot = { size: 6 }

      ;(collection as Mock).mockReturnValue(mockCollection)
      ;(getDocs as Mock)
        .mockResolvedValueOnce(initialSnapshot) // For getNextSpinNumber
        .mockResolvedValueOnce(finalSnapshot) // For verification
      ;(addDoc as Mock).mockResolvedValue({ id: 'new-entry-id' })

      // Act
      const nextSpinNumber = await getNextSpinNumber(mockRoomId)
      await createFortuneHistoryEntry({
        roomId: mockRoomId,
        winnerId: 'winner-123',
        winnerName: 'John Doe',
      })
      const finalSpinNumber = await getNextSpinNumber(mockRoomId)

      // Assert
      expect(nextSpinNumber).toBe(6)
      expect(finalSpinNumber).toBe(7)
      expect(addDoc).toHaveBeenCalledTimes(1)
    })

    it('should handle clear and recreate scenario', async () => {
      // Arrange - Simulate clearing history and then adding new entries
      const mockDoc = { ref: { id: 'doc1' } }
      const populatedSnapshot = { docs: [mockDoc] }
      const emptySnapshot = { size: 0 }

      ;(collection as Mock).mockReturnValue(mockCollection)
      ;(getDocs as Mock)
        .mockResolvedValueOnce(populatedSnapshot) // For clearFortuneHistory
        .mockResolvedValueOnce(emptySnapshot) // For getNextSpinNumber after clear
      ;(deleteDoc as Mock).mockResolvedValue(undefined)
      ;(addDoc as Mock).mockResolvedValue({ id: 'new-entry-id' })

      // Act
      await clearFortuneHistory(mockRoomId)
      const nextSpinNumber = await getNextSpinNumber(mockRoomId)
      await createFortuneHistoryEntry({
        roomId: mockRoomId,
        winnerId: 'winner-123',
        winnerName: 'First After Clear',
      })

      // Assert
      expect(deleteDoc).toHaveBeenCalledWith(mockDoc.ref)
      expect(nextSpinNumber).toBe(1)
      expect(addDoc).toHaveBeenCalledWith(mockCollection, {
        winnerId: 'winner-123',
        winnerName: 'First After Clear',
        roomId: mockRoomId,
        createdAt: '2024-01-15T10:30:00.000Z',
      })
    })
  })
})
