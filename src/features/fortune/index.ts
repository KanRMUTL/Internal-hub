// Modern (Direction 7) replacements for the old WheelOfFortune and
// LuckyModal. The old names are kept as re-exports for backward compatibility.
export {
  WheelOfFortuneModern,
  WheelOfFortune,
  pickWinnerIndex,
  computeNextRotation,
  MODERN_SPIN_DURATION_MS,
  type ModernWheelMember,
} from './ui'
export { WinnerModalModern } from './ui'
export { HistoryListModern, FortuneHistoryListModern, type HistoryRow } from './ui'
export { LuckyModal } from './ui'
export { useFortuneHistory } from './hooks'
export { getFortuneHistoryQuery, createFortuneHistoryEntry, clearFortuneHistory, getNextSpinNumber } from './services'
export {
  WHEEL_COLORS,
  SPIN_DURATION,
  RADIUS,
  CENTER,
  FORTUNE_HISTORY_COLLECTION,
  FORTUNE_HISTORY_QUERY_LIMIT,
  FORTUNE_HISTORY_ORDER_BY,
  FORTUNE_HISTORY_ORDER_DIRECTION,
  FORTUNE_HISTORY_TABLE_PAGE_SIZE,
  FORTUNE_HISTORY_ANIMATION_DURATION,
  FORTUNE_HISTORY_ERROR_MESSAGES,
} from './config'
export type { FortuneHistoryEntry, FortuneHistoryTableProps, CreateFortuneHistoryEntryData } from './model'
