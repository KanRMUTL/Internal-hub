// Firestore collection names
export const FORTUNE_HISTORY_COLLECTION = 'fortune-history'

// Query configuration
export const FORTUNE_HISTORY_QUERY_LIMIT = 50
export const FORTUNE_HISTORY_ORDER_BY = 'createdAt'
export const FORTUNE_HISTORY_ORDER_DIRECTION = 'desc' as const

// UI configuration
export const FORTUNE_HISTORY_TABLE_PAGE_SIZE = 10
export const FORTUNE_HISTORY_ANIMATION_DURATION = 300

// Error messages
export const FORTUNE_HISTORY_ERROR_MESSAGES = {
  SAVE_FAILED: 'Failed to save fortune history entry',
  LOAD_FAILED: 'Failed to load fortune history',
  CLEAR_FAILED: 'Failed to clear fortune history',
  NETWORK_ERROR: 'Network error occurred. Please try again.',
} as const
