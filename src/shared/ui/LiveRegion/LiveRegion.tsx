import { useEffect, useRef } from 'react'
import styled from 'styled-components'

interface LiveRegionProps {
  message: string
  politeness?: 'polite' | 'assertive' | 'off'
  clearAfter?: number // Clear message after X milliseconds
}

const LiveRegion = ({ message, politeness = 'polite', clearAfter = 5000 }: LiveRegionProps) => {
  const regionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!message || !regionRef.current) return

    // Set the message
    regionRef.current.textContent = message

    // Clear the message after specified time
    if (clearAfter > 0) {
      const timeoutId = setTimeout(() => {
        if (regionRef.current) {
          regionRef.current.textContent = ''
        }
      }, clearAfter)

      return () => clearTimeout(timeoutId)
    }
  }, [message, clearAfter])

  return <StyledLiveRegion ref={regionRef} aria-live={politeness} aria-atomic="true" role="status" />
}

export default LiveRegion

const StyledLiveRegion = styled.div`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`
