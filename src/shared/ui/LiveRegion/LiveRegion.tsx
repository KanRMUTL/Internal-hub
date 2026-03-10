import { useEffect, useRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const liveRegionVariants = cva('sr-only')

interface LiveRegionProps extends VariantProps<typeof liveRegionVariants> {
  message: string
  politeness?: 'polite' | 'assertive' | 'off'
  clearAfter?: number
}

const LiveRegion = ({ message, politeness = 'polite', clearAfter = 5000 }: LiveRegionProps) => {
  const regionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!message || !regionRef.current) return

    regionRef.current.textContent = message

    if (clearAfter > 0) {
      const timeoutId = setTimeout(() => {
        if (regionRef.current) {
          regionRef.current.textContent = ''
        }
      }, clearAfter)

      return () => clearTimeout(timeoutId)
    }
  }, [message, clearAfter])

  return (
    <div className={liveRegionVariants()} ref={regionRef} aria-live={politeness} aria-atomic="true" role="status" />
  )
}

export default LiveRegion
