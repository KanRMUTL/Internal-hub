import { useEffect } from 'react'

/**
 * Module-level ref counter so multiple modals can lock body scroll without
 * stepping on each other. The first lock captures whatever overflow value
 * the body had and the last release restores it.
 *
 *   modal A open  -> counter 1, body overflow = 'hidden'
 *   modal B open  -> counter 2, body overflow = 'hidden' (still)
 *   modal A close -> counter 1, body overflow = 'hidden' (still locked by B)
 *   modal B close -> counter 0, body overflow = previousValue
 *
 * This matters because the modern UI is growing — multiple modals can stack
 * (e.g., the winner modal opening while the member-management modal is
 * still resolving). Naive per-modal lock/unset pairs would release the
 * body when the inner one closes.
 */
let activeLocks = 0
let previousOverflow: string | null = null

const useBodyScrollLock = (isActive: boolean) => {
  useEffect(() => {
    if (!isActive) return undefined

    if (activeLocks === 0) {
      // First lock — capture the value to restore when everything releases.
      previousOverflow = document.body.style.overflow
    }
    activeLocks += 1
    document.body.style.overflow = 'hidden'

    return () => {
      activeLocks = Math.max(0, activeLocks - 1)
      if (activeLocks === 0) {
        // Last lock released — restore the value that was on the body before
        // the first lock. Empty string clears the inline style (the browser
        // default then takes over).
        document.body.style.overflow = previousOverflow ?? ''
        previousOverflow = null
      }
    }
  }, [isActive])
}

export default useBodyScrollLock
