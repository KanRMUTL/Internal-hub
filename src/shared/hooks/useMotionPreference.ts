import { useState, useEffect } from 'react'

/**
 * Hook to detect and track user's motion preference
 * @returns boolean indicating if user prefers reduced motion
 */
export const useMotionPreference = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    // Add listener for changes
    mediaQuery.addEventListener('change', handleChange)

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return prefersReducedMotion
}

/**
 * Hook that returns motion-aware values
 * @param normalValue - Value to use when motion is preferred
 * @param reducedValue - Value to use when reduced motion is preferred
 * @returns The appropriate value based on user preference
 */
export const useMotionValue = <T>(normalValue: T, reducedValue: T): T => {
  const prefersReduced = useMotionPreference()
  return prefersReduced ? reducedValue : normalValue
}
