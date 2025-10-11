export interface FortuneHistoryEntry {
  id: string
  winnerId: string
  winnerName: string
  roomId: string
  createdAt: string
}

export interface FortuneHistoryTableProps {
  roomId: string
  className?: string
}

export interface CreateFortuneHistoryEntryData {
  winnerId: string
  winnerName: string
  roomId: string
}
