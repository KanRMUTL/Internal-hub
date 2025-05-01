import { useEffect, useState } from 'react'
import { onSnapshot, Query, DocumentData } from 'firebase/firestore'

const useFirestoreCollection = <T>(query: Query<DocumentData>) => {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query,
      (snapshot) => {
        const result = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T)
        setData(result)
        setLoading(false)
      },
      (err) => {
        setError(err)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [query])

  return { data, loading, error }
}

export default useFirestoreCollection
