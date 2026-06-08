import { useEffect, useState } from 'react'
import { onSnapshot, DocumentReference, DocumentData } from 'firebase/firestore'

/**
 * Subscribe to a single Firestore document. Mirrors the shape of
 * `useFirestoreCollection` but for one document:
 *   - `data` is the document (id + fields) or null if it doesn't exist
 *   - `loading` flips to false on first snapshot
 *   - `error` surfaces permission / network errors
 *
 * Pass `null` to skip the subscription entirely (e.g. when the caller
 * doesn't have an id yet). Loading stays true in that case.
 */
const useFirestoreDocument = <T>(reference: DocumentReference<DocumentData> | null) => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!reference) {
      setData(null)
      setLoading(false)
      setError(null)
      return undefined
    }

    const unsubscribe = onSnapshot(
      reference,
      (snapshot) => {
        setData(snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as T) : null)
        setLoading(false)
      },
      (err) => {
        setError(err)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [reference])

  return { data, loading, error }
}

export default useFirestoreDocument

