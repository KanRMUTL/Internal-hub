import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'

// Mock the firebase/firestore module so the hook's onSnapshot call lands in
// a callback we control. The hook itself is the unit under test — the
// underlying Firestore SDK is irrelevant.
const unsubscribe = vi.fn()
let snapshotHandler: ((snap: { exists: () => boolean; id: string; data: () => unknown }) => void) | null = null
let errorHandler: ((err: Error) => void) | null = null

vi.mock('firebase/firestore', () => ({
  onSnapshot: (
    _ref: unknown,
    onNext: (snap: { exists: () => boolean; id: string; data: () => unknown }) => void,
    onError: (err: Error) => void
  ) => {
    snapshotHandler = onNext
    errorHandler = onError
    return unsubscribe
  },
  doc: vi.fn((_db: unknown, _collection: string, id: string) => ({ id })),
}))

import useFirestoreDocument from '../useFirestoreDocument'

// Minimal doc shape — the hook is generic over T, the test only cares about
// the { id, ...fields } merge.
interface Room {
  id: string
  name: string
}

const fakeRef = { id: 'r-1' } as unknown as Parameters<typeof useFirestoreDocument<Room>>[0]

beforeEach(() => {
  snapshotHandler = null
  errorHandler = null
  unsubscribe.mockClear()
})

describe('useFirestoreDocument', () => {
  it('starts in loading state', () => {
    const { result } = renderHook(() => useFirestoreDocument<Room>(fakeRef))
    expect(result.current.loading).toBe(true)
    expect(result.current.data).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('returns the document (id + data) when the snapshot exists', async () => {
    const { result } = renderHook(() => useFirestoreDocument<Room>(fakeRef))
    act(() => {
      snapshotHandler?.({ exists: () => true, id: 'r-1', data: () => ({ name: 'Standup' }) })
    })
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    expect(result.current.data).toEqual({ id: 'r-1', name: 'Standup' })
    expect(result.current.error).toBeNull()
  })

  it('returns null when the document does not exist', async () => {
    const { result } = renderHook(() => useFirestoreDocument<Room>(fakeRef))
    act(() => {
      snapshotHandler?.({ exists: () => false, id: 'r-1', data: () => undefined })
    })
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    expect(result.current.data).toBeNull()
  })

  it('surfaces errors and stops loading', async () => {
    const { result } = renderHook(() => useFirestoreDocument<Room>(fakeRef))
    act(() => {
      errorHandler?.(new Error('permission-denied'))
    })
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    expect(result.current.error).toMatchObject({ message: 'permission-denied' })
    expect(result.current.data).toBeNull()
  })

  it('unsubscribes on unmount', () => {
    const { unmount } = renderHook(() => useFirestoreDocument<Room>(fakeRef))
    unmount()
    expect(unsubscribe).toHaveBeenCalledTimes(1)
  })
})
