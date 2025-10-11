import { CreateFortuneHistoryEntryData, FortuneHistoryEntry } from 'features/fortune/model/fortuneHistoryTypes'

/**
 * Test utilities for fortune history testing
 */

export const createMockFortuneHistoryEntry = (overrides: Partial<FortuneHistoryEntry> = {}): FortuneHistoryEntry => ({
  id: 'test-entry-123',
  winnerId: 'test-winner-456',
  winnerName: 'Test Winner',
  roomId: 'test-room-789',
  createdAt: '2024-01-15T10:30:00.000Z',
  ...overrides,
})

export const createMockCreateFortuneHistoryEntryData = (
  overrides: Partial<CreateFortuneHistoryEntryData> = {}
): CreateFortuneHistoryEntryData => ({
  winnerId: 'test-winner-456',
  winnerName: 'Test Winner',
  roomId: 'test-room-789',
  ...overrides,
})

export const createMockFirestoreSnapshot = (size: number, docs: unknown[] = []) => ({
  size,
  docs,
})

export const createMockFirestoreDoc = (id: string) => ({
  ref: { id },
})

/**
 * Common test data for fortune history tests
 */
export const TEST_ROOM_ID = 'test-room-123'
export const TEST_WINNER_ID = 'test-winner-456'
export const TEST_WINNER_NAME = 'John Doe'
export const TEST_TIMESTAMP = '2024-01-15T10:30:00.000Z'

/**
 * Test data with special characters and edge cases
 */
export const EDGE_CASE_TEST_DATA = {
  EMPTY_NAME: '',
  LONG_NAME: 'A'.repeat(1000),
  UNICODE_NAME: '🎉 José María 中文 العربية 🏆',
  SPECIAL_CHARS_NAME: "O'Connor-Smith & Associates, Inc.",
  NULL_VALUES: {
    winnerId: null as unknown as string,
    winnerName: null as unknown as string,
    roomId: null as unknown as string,
  },
}
