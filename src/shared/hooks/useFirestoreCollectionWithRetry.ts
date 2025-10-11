import { useEffect, useState, useCallback } from 'react'
import { onSnapshot, Query, DocumentData } from 'firebase/firestore'

interface UseFirestoreCollectionWithRetryOptions {
  maxRetries?: number
  retryDelay?: number
}

interface UseFirestoreCollectionWithRetryReturn<T> {
  data: T[]
  loading: boolean
  error: Error | null
  retry: () => void
  retryCount: number
}

const useFirestoreCollectionWithRetry = <T>(
  query: Query<DocumentData>,
  options: UseFirestoreCollectionWithRetryOptions = {}
): UseFirestoreCollectionWithRetryReturn<T> => {
  const { maxRetries = 3, retryDelay = 1000 } = options

  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [shouldRetry, setShouldRetry] = useState(0)

  const retry = useCallback(() => {
    if (retryCount < maxRetries) {
      setRetryCount((prev) => prev + 1)
      setShouldRetry((prev) => prev + 1)
      setError(null)
      setLoading(true)
    }
  }, [retryCount, maxRetries])

  useEffect(() => {
    let unsubscribe: (() => void) | null = null
    let timeoutId: NodeJS.Timeout | null = null

    const setupListener = () => {
      unsubscribe = onSnapshot(
        query,
        (snapshot) => {
          const result = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T)
          setData(result)
          setLoading(false)
          setError(null)
          // Reset retry count on successful connection
          setRetryCount(0)
        },
        (err) => {
          console.error('Firestore error:', err)
          setError(err)
          setLoading(false)

          // Auto-retry for network errors
          if (retryCount < maxRetries && isRetriableError(err)) {
            timeoutId = setTimeout(
              () => {
                retry()
              },
              retryDelay * Math.pow(2, retryCount)
            ) // Exponential backoff
          }
        }
      )
    }

    setupListener()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [query, shouldRetry, retryCount, maxRetries, retryDelay, retry])

  return { data, loading, error, retry, retryCount }
}

const isRetriableError = (error: Error): boolean => {
  const message = error.message.toLowerCase()
  return (
    message.includes('network') ||
    message.includes('offline') ||
    message.includes('timeout') ||
    message.includes('unavailable') ||
    message.includes('internal')
  )
}

export default useFirestoreCollectionWithRetry
