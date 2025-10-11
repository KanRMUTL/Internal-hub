import { describe, it, expect, vi, beforeEach, Mock } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFortuneHistory } from '../useFortuneHistory'
import * as fortuneHistoryServices from '../../services/fortuneHistoryServices'
import useFirestoreCollectionWithRetry from 'shared/hooks/useFirestoreCollectionWithRetry'
import { FortuneHistoryEntry } from '../../model/fortuneHistoryTypes'
import { TEST_ROOM_ID } from '../../../../test/fortuneHistoryTestUtils'

// Mock the Firestore hook
vi.mock('shared/hooks/useFirestoreCollectionWithRetry')

// Mock the fortune history services
vi.mock('../../services/fortuneHistoryServices')

describe('useFortuneHistory - Core Functionality', () => {
  const mockQuery = { id: 'mock-query' }
  const mockHistory: FortuneHistoryEntry[] = [
    {
      id: 'entry-1',
      winnerId: 'winner-1',
      winnerName: 'John Doe',
      roomId: TEST_ROOM_ID,
      createdAt: '2024-01-15T10:30:00.000Z',
    },
  ]

  const mockFirestoreReturn = {
    data: mockHistory,
    loading: false,
    error: null,
    retry: vi.fn(),
    retryCount: 0,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(fortuneHistoryServices.getFortuneHistoryQuery as Mock).mockReturnValue(mockQuery)
    ;(useFirestoreCollectionWithRetry as Mock).mockReturnValue(mockFirestoreReturn)
    ;(fortuneHistoryServices.createFortuneHistoryEntry as Mock).mockResolvedValue(undefined)
    ;(fortuneHistoryServices.clearFortuneHistory as Mock).mockResolvedValue(undefined)
  })

  it('should initialize correctly and return data from Firestore hook', () => {
    // Act
    const { result } = renderHook(() => useFortuneHistory(TEST_ROOM_ID))

    // Assert
    expect(fortuneHistoryServices.getFortuneHistoryQuery).toHaveBeenCalledWith(TEST_ROOM_ID)
    expect(useFirestoreCollectionWithRetry).toHaveBeenCalledWith(mockQuery, {
      maxRetries: 3,
      retryDelay: 1000,
    })
    expect(result.current.history).toEqual(mockHistory)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('should handle loading state', () => {
    // Arrange
    ;(useFirestoreCollectionWithRetry as Mock).mockReturnValue({
      ...mockFirestoreReturn,
      loading: true,
    })

    // Act
    const { result } = renderHook(() => useFortuneHistory(TEST_ROOM_ID))

    // Assert
    expect(result.current.loading).toBe(true)
  })

  it('should handle error state', () => {
    // Arrange
    const mockError = new Error('Firestore error')
    ;(useFirestoreCollectionWithRetry as Mock).mockReturnValue({
      ...mockFirestoreReturn,
      error: mockError,
    })

    // Act
    const { result } = renderHook(() => useFortuneHistory(TEST_ROOM_ID))

    // Assert
    expect(result.current.error).toBe(mockError)
  })

  it('should save entry successfully', async () => {
    // Arrange
    const entryData = {
      winnerId: 'winner-123',
      winnerName: 'Test Winner',
      roomId: TEST_ROOM_ID,
    }

    // Act
    const { result } = renderHook(() => useFortuneHistory(TEST_ROOM_ID))

    await act(async () => {
      await result.current.saveEntry(entryData)
    })

    // Assert
    expect(fortuneHistoryServices.createFortuneHistoryEntry).toHaveBeenCalledWith(entryData)
    expect(result.current.saveError).toBe(null)
  })

  it('should handle save errors', async () => {
    // Arrange
    const entryData = {
      winnerId: 'winner-123',
      winnerName: 'Test Winner',
      roomId: TEST_ROOM_ID,
    }
    const saveError = new Error('Save failed')
    ;(fortuneHistoryServices.createFortuneHistoryEntry as Mock).mockRejectedValue(saveError)

    // Act
    const { result } = renderHook(() => useFortuneHistory(TEST_ROOM_ID))

    await act(async () => {
      try {
        await result.current.saveEntry(entryData)
      } catch {
        // Expected to throw
      }
    })

    // Assert
    expect(result.current.saveError).toBe(saveError)
  })

  it('should clear history successfully', async () => {
    // Act
    const { result } = renderHook(() => useFortuneHistory(TEST_ROOM_ID))

    await act(async () => {
      await result.current.clearHistory()
    })

    // Assert
    expect(fortuneHistoryServices.clearFortuneHistory).toHaveBeenCalledWith(TEST_ROOM_ID)
  })

  it('should provide retry function from Firestore hook', () => {
    // Arrange
    const mockRetry = vi.fn()
    ;(useFirestoreCollectionWithRetry as Mock).mockReturnValue({
      ...mockFirestoreReturn,
      retry: mockRetry,
    })

    // Act
    const { result } = renderHook(() => useFortuneHistory(TEST_ROOM_ID))

    // Assert
    expect(result.current.retry).toBe(mockRetry)
  })

  it('should handle different room IDs', () => {
    // Arrange
    const differentRoomId = 'different-room-456'

    // Act
    renderHook(() => useFortuneHistory(differentRoomId))

    // Assert
    expect(fortuneHistoryServices.getFortuneHistoryQuery).toHaveBeenCalledWith(differentRoomId)
  })

  it('should handle empty history data', () => {
    // Arrange
    ;(useFirestoreCollectionWithRetry as Mock).mockReturnValue({
      ...mockFirestoreReturn,
      data: [],
    })

    // Act
    const { result } = renderHook(() => useFortuneHistory(TEST_ROOM_ID))

    // Assert
    expect(result.current.history).toEqual([])
  })
})
