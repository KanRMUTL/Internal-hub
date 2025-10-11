import { collection, query, orderBy, limit, addDoc, deleteDoc, getDocs, Query, DocumentData } from 'firebase/firestore'
import { db } from 'shared/config/firebase'
import {
  FORTUNE_HISTORY_COLLECTION,
  FORTUNE_HISTORY_QUERY_LIMIT,
  FORTUNE_HISTORY_ORDER_BY,
  FORTUNE_HISTORY_ORDER_DIRECTION,
} from 'features/fortune/config/fortuneHistoryConstant'
import { CreateFortuneHistoryEntryData } from 'features/fortune/model/fortuneHistoryTypes'

/**
 * Gets a Firestore query for fortune history entries for a specific room
 * Returns entries in descending chronological order (newest first)
 */
export const getFortuneHistoryQuery = (roomId: string): Query<DocumentData> => {
  const fortuneHistoryCollection = collection(db, 'room', roomId, FORTUNE_HISTORY_COLLECTION)
  return query(
    fortuneHistoryCollection,
    orderBy(FORTUNE_HISTORY_ORDER_BY, FORTUNE_HISTORY_ORDER_DIRECTION),
    limit(FORTUNE_HISTORY_QUERY_LIMIT)
  )
}

/**
 * Creates a new fortune history entry in Firestore
 * Automatically adds timestamp and generates unique ID
 */
export const createFortuneHistoryEntry = async (entryData: CreateFortuneHistoryEntryData): Promise<void> => {
  const { roomId, winnerId, winnerName } = entryData

  const fortuneHistoryCollection = collection(db, 'room', roomId, FORTUNE_HISTORY_COLLECTION)

  const newEntry = {
    winnerId,
    winnerName,
    roomId,
    createdAt: new Date().toISOString(),
  }

  await addDoc(fortuneHistoryCollection, newEntry)
}

/**
 * Clears all fortune history entries for a specific room
 * Performs bulk deletion of all documents in the collection
 */
export const clearFortuneHistory = async (roomId: string): Promise<void> => {
  const fortuneHistoryCollection = collection(db, 'room', roomId, FORTUNE_HISTORY_COLLECTION)

  // Get all documents in the collection
  const snapshot = await getDocs(fortuneHistoryCollection)

  // Delete each document
  const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref))
  await Promise.all(deletePromises)
}

/**
 * Gets the next spin number for a room by counting existing entries
 * Returns the count + 1 to provide sequential numbering
 */
export const getNextSpinNumber = async (roomId: string): Promise<number> => {
  const fortuneHistoryCollection = collection(db, 'room', roomId, FORTUNE_HISTORY_COLLECTION)

  // Get all documents to count them
  const snapshot = await getDocs(fortuneHistoryCollection)

  // Return count + 1 for next spin number
  return snapshot.size + 1
}
