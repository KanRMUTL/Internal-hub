import { useEffect, useMemo, useRef, useState } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import styled from 'styled-components'
import { motion } from 'motion/react'
import HistoryListModern, { HistoryRow } from './HistoryListModern'
import FortuneHistoryDataBoundary from './FortuneHistoryDataBoundary'
import { useFortuneHistory } from 'features/fortune/hooks'
import { FortuneHistoryEntry } from 'features/fortune/model/fortuneHistoryTypes'

dayjs.extend(relativeTime)

interface FortuneHistoryListModernProps {
  roomId: string
  membersById: Record<string, { name: string; hue: number }>
  className?: string
}

const Container = styled.div`
  width: 100%;
  max-height: 400px;
  overflow-y: auto;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.grey[200]};
  background: ${({ theme }) => theme.background.surface};
  scroll-behavior: smooth;
  padding: ${({ theme }) => theme.spacing.md};

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
    background: ${({ theme }) => theme.background.elevated};
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.grey[400]};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }
`

const EmptyState = styled(motion.div)`
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
  text-align: center;
  color: ${({ theme }) => theme.colors.grey[600]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`

const FortuneHistoryListModern = ({ roomId, membersById, className }: FortuneHistoryListModernProps) => {
  const { history, loading, error, retry } = useFortuneHistory(roomId)
  const previousHistoryIdsRef = useRef<Set<string>>(new Set())
  const [highlightId, setHighlightId] = useState<string | undefined>(undefined)

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
      setHighlightId(newIds[0])
      const timer = window.setTimeout(() => setHighlightId(undefined), 2000)
      previousHistoryIdsRef.current = currentIds
      return () => window.clearTimeout(timer)
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
        winnerHue: member?.hue ?? 200,
        spunAt: dayjs(entry.createdAt).format('MMM D · h:mm A'),
        timeAgo: dayjs(entry.createdAt).fromNow(),
      }
    })
  }, [history, membersById])

  if (!loading && !error && history.length === 0) {
    return (
      <Container className={className}>
        <FortuneHistoryDataBoundary loading={loading} error={error} onRetry={retry} showSkeleton={true}>
          <EmptyState
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            No spins yet. Press the wheel to get started.
          </EmptyState>
        </FortuneHistoryDataBoundary>
      </Container>
    )
  }

  return (
    <Container className={className}>
      <FortuneHistoryDataBoundary loading={loading} error={error} onRetry={retry} showSkeleton={true}>
        <HistoryListModern entries={rows} highlightId={highlightId} />
      </FortuneHistoryDataBoundary>
    </Container>
  )
}

export default FortuneHistoryListModern
