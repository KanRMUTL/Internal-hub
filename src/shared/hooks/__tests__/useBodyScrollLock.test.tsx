import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import useBodyScrollLock from '../useBodyScrollLock'

// The hook shares module-level state across instances (ref-counted). The
// tests deliberately drive transitions to verify the lock holds across the
// whole stack — not just per-instance — because the modern UI is growing
// and nested modals are a real concern.
describe('useBodyScrollLock', () => {
  beforeEach(() => {
    // Reset the body's inline overflow before each test so we measure only
    // what the hook does.
    document.body.style.overflow = ''
  })

  afterEach(() => {
    document.body.style.overflow = ''
  })

  it('locks body scroll when isActive is true', () => {
    const { unmount } = renderHook(() => useBodyScrollLock(true))
    expect(document.body.style.overflow).toBe('hidden')
    unmount()
  })

  it('restores the previous overflow value on release', () => {
    // Simulate a page that already had a non-default overflow for some
    // reason (e.g., a stale inline style from a previous session).
    document.body.style.overflow = 'auto'
    const { unmount } = renderHook(() => useBodyScrollLock(true))
    expect(document.body.style.overflow).toBe('hidden')
    unmount()
    expect(document.body.style.overflow).toBe('auto')
  })

  it('does not change the body when isActive is false', () => {
    const { unmount } = renderHook(() => useBodyScrollLock(false))
    expect(document.body.style.overflow).toBe('')
    unmount()
  })

  it('keeps the body locked while any lock is active (nested modals)', () => {
    const a = renderHook(() => useBodyScrollLock(true))
    const b = renderHook(() => useBodyScrollLock(true))
    expect(document.body.style.overflow).toBe('hidden')

    // Close the first modal — body should STILL be hidden, because the
    // second one is still open.
    a.unmount()
    expect(document.body.style.overflow).toBe('hidden')

    // Close the second one — body unlocks.
    b.unmount()
    expect(document.body.style.overflow).toBe('')
  })

  it('releases the lock when isActive flips false', () => {
    const { rerender, unmount } = renderHook(({ active }) => useBodyScrollLock(active), {
      initialProps: { active: true },
    })
    expect(document.body.style.overflow).toBe('hidden')

    rerender({ active: false })
    expect(document.body.style.overflow).toBe('')

    // Re-arming locks again.
    rerender({ active: true })
    expect(document.body.style.overflow).toBe('hidden')

    unmount()
    expect(document.body.style.overflow).toBe('')
  })
})
