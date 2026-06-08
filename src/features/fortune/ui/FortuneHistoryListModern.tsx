import { useEffect, useMemo, useRef, useState } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import styled from 'styled-components'
import { MotionWrapper } from 'shared/ui/MotionWrapper'
import { LiveRegion } from 'shared/ui'
import HistoryListModern, { HistoryRow } from './HistoryListModern'
import FortuneHistoryDataBoundary from './FortuneHistoryDataBoundary'
import { useFortuneHistory } from 'features/fortune/hooks'
import { FortuneHistoryEntry } from 'features/fortune/model/fortuneHistoryTypes'

dayjs.extend(relativeTime)

interface FortuneHistoryListModernProps {
  roomId: string
  membersById: Record<string, { name: string; color: string }>
  className?: string
}

/**
 * Scroll-only wrapper. The visual boundary (border, background, border-radius,
 * padding) is owned by the parent `SideCard` in `RoomPage` — rendering it here
 * caused a nested-card anti-pattern that overflowed the SideCard's right edge
 * under the project's default `box-sizing: content-box`.
 */
const ScrollArea = styled.div`
  max-height: 400px;
  overflow-y: auto;
  scroll-behavior: smooth;
  box-sizing: border-box;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    max-height: 350px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    max-height: 300px;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.grey[300]};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }
`

const EmptyState = styled(MotionWrapper).attrs({ as: 'div' })`
  padding: ${({ theme }) => theme.spacing.lg} 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.grey[600]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`

const FortuneHistoryListModern = ({ roomId, membersById, className }: FortuneHistoryListModernProps) => {
  const { history, loading, error, retry } = useFortuneHistory(roomId)
  const previousHistoryIdsRef = useRef<Set<string>>(new Set())
  const [highlightId, setHighlightId] = useState<string | undefined>(undefined)
  const [liveMessage, setLiveMessage] = useState('')

  useEffect(() => {
    if (loading || history.length === 0) return

    const currentIds = new Set(history.map((entry) => entry.id))
    const newIds: string[] = []
    currentIds.forEach((id) => {
      if (!previousHistoryIdsRef.current.has(id)) {
        newIds.push(id)
      }
    })

    if (newIds.length > 0) {
      const newEntry = history.find((e) => e.id === newIds[0])
      setHighlightId(newIds[0])
      setLiveMessage(newEntry ? `${newEntry.winnerName} just won` : 'New spin recorded')
      const timer = window.setTimeout(() => setHighlightId(undefined), 2000)
      const msgTimer = window.setTimeout(() => setLiveMessage(''), 5000)
      previousHistoryIdsRef.current = currentIds
      return () => {
        window.clearTimeout(timer)
        window.clearTimeout(msgTimer)
      }
    }
    previousHistoryIdsRef.current = currentIds
    return undefined
  }, [history, loading])

  const rows = useMemo<HistoryRow[]>(() => {
    return history.map((entry: FortuneHistoryEntry) => {
      const member = membersById[entry.winnerId]
      return {
        id: entry.id,
        winnerName: entry.winnerName,
        winnerColor: member?.color ?? 'oklch(78% 0.10 200)',
        spunAt: dayjs(entry.createdAt).format('MMM D · h:mm A'),
        timeAgo: dayjs(entry.createdAt).fromNow(),
      }
    })
  }, [history, membersById])

  if (!loading && !error && history.length === 0) {
    return (
      <ScrollArea className={className}>
        <FortuneHistoryDataBoundary loading={loading} error={error} onRetry={retry} showSkeleton={true}>
          <EmptyState
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            No spins yet. Spin the wheel to record your first result.
          </EmptyState>
        </FortuneHistoryDataBoundary>
      </ScrollArea>
    )
  }

  return (
    <ScrollArea className={className}>
      <FortuneHistoryDataBoundary loading={loading} error={error} onRetry={retry} showSkeleton={true}>
        <HistoryListModern entries={rows} highlightId={highlightId} />
      </FortuneHistoryDataBoundary>
      <LiveRegion message={liveMessage} politeness="polite" />
    </ScrollArea>
  )
}

export default FortuneHistoryListModern
