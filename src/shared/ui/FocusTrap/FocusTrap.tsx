import { ReactNode, useEffect, useRef } from 'react'

interface FocusTrapProps {
  children: ReactNode
  isActive: boolean
  restoreFocus?: boolean
  initialFocus?: string // CSS selector for initial focus element
}

const FocusTrap = ({ children, isActive, restoreFocus = true, initialFocus }: FocusTrapProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isActive) return

    // Store the currently focused element
    previousActiveElement.current = document.activeElement as HTMLElement

    const container = containerRef.current
    if (!container) return

    // Get all focusable elements within the container
    const getFocusableElements = () => {
      const focusableSelectors = [
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        'a[href]',
        '[tabindex]:not([tabindex="-1"])',
        '[role="button"]:not([disabled])',
        '[role="link"]:not([disabled])',
        '[role="menuitem"]:not([disabled])',
        '[role="tab"]:not([disabled])',
      ].join(', ')

      return Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[]
    }

    // Set initial focus
    const setInitialFocus = () => {
      if (initialFocus) {
        const initialElement = container.querySelector(initialFocus) as HTMLElement
        if (initialElement) {
          initialElement.focus()
          return
        }
      }

      // Fallback to first focusable element
      const focusableElements = getFocusableElements()
      if (focusableElements.length > 0) {
        focusableElements[0].focus()
      }
    }

    // Handle tab key navigation
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      const focusableElements = getFocusableElements()
      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey) {
        // Shift + Tab: move to previous element
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      } else {
        // Tab: move to next element
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }

    // Set initial focus after a brief delay to ensure DOM is ready
    const timeoutId = setTimeout(setInitialFocus, 10)

    // Add event listener
    document.addEventListener('keydown', handleKeyDown)

    // Cleanup function
    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('keydown', handleKeyDown)

      // Restore focus to previously focused element
      if (restoreFocus && previousActiveElement.current) {
        previousActiveElement.current.focus()
      }
    }
  }, [isActive, initialFocus, restoreFocus])

  return <div ref={containerRef}>{children}</div>
}

export default FocusTrap
