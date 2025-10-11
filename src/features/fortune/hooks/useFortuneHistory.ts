import { useCallback, useMemo, useState } from 'react'
import useFirestoreCollectionWithRetry from 'shared/hooks/useFirestoreCollectionWithRetry'
import {
  getFortuneHistoryQuery,
  createFortuneHistoryEntry,
  clearFortuneHistory,
} from 'features/fortune/services/fortuneHistoryServices'
import { FortuneHistoryEntry, CreateFortuneHistoryEntryData } from 'features/fortune/model/fortuneHistoryTypes'

interface UseFortuneHistoryReturn {
  history: FortuneHistoryEntry[]
  loading: boolean
  error: Error | null
  saveEntry: (entryData: CreateFortuneHistoryEntryData) => Promise<void>
  clearHistory: () => Promise<void>
  retry: () => void
  retryCount: number
  saveError: Error | null
  saving: boolean
}

/**
 * Custom hook for managing fortune history state and operations
 * Provides real-time data subscription, CRUD operations, and enhanced error handling
 */
export const useFortuneHistory = (roomId: string): UseFortuneHistoryReturn => {
  // Create the Firestore query for this room
  const query = useMemo(() => getFortuneHistoryQuery(roomId), [roomId])

  // Use the enhanced Firestore collection hook with retry functionality
  const {
    data: history,
    loading,
    error,
    retry,
    retryCount,
  } = useFirestoreCollectionWithRetry<FortuneHistoryEntry>(query, {
    maxRetries: 3,
    retryDelay: 1000,
  })

  // State for save operations
  const [saveError, setSaveError] = useState<Error | null>(null)
  const [saving, setSaving] = useState(false)

  // Function to save a new fortune history entry with enhanced error handling
  const saveEntry = useCallback(async (entryData: CreateFortuneHistoryEntryData): Promise<void> => {
    setSaving(true)
    setSaveError(null)

    let retryAttempts = 0
    const maxSaveRetries = 3

    while (retryAttempts < maxSaveRetries) {
      try {
        await createFortuneHistoryEntry(entryData)
        setSaving(false)
        return
      } catch (err) {
        retryAttempts++
        const error = err as Error

        // Check if this is a retriable error
        if (retryAttempts < maxSaveRetries && isRetriableError(error)) {
          // Wait with exponential backoff before retrying
          await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, retryAttempts - 1)))
          continue
        }

        // Set error state and re-throw
        setSaveError(error)
        setSaving(false)
        throw error
      }
    }
  }, [])

  // Function to clear all fortune history for the room
  const clearHistory = useCallback(async (): Promise<void> => {
    await clearFortuneHistory(roomId)
  }, [roomId])

  return {
    history,
    loading,
    error,
    saveEntry,
    clearHistory,
    retry,
    retryCount,
    saveError,
    saving,
  }
}

// Helper function to determine if an error is retriable
const isRetriableError = (error: Error): boolean => {
  const message = error.message.toLowerCase()
  return (
    message.includes('network') ||
    message.includes('offline') ||
    message.includes('timeout') ||
    message.includes('unavailable') ||
    message.includes('internal') ||
    message.includes('deadline-exceeded')
  )
}
