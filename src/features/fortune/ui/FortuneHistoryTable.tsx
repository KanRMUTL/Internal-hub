import { useMemo, useRef, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { Typography, Box } from 'shared/ui'
import { useFortuneHistory } from 'features/fortune/hooks'
import { FortuneHistoryEntry, FortuneHistoryTableProps } from 'features/fortune/model/fortuneHistoryTypes'
import FortuneHistoryDataBoundary from './FortuneHistoryDataBoundary'

const StyledTableContainer = styled.div`
  width: 100%;
  max-height: 400px;
  overflow-y: auto;
  overflow-x: auto;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.grey};
  background: ${({ theme }) => theme.background.surface};
  scroll-behavior: smooth;

  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.background.elevated};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.grey};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.primary};
  }
`

const AnimatedTable = styled(motion.table)`
  width: 100%;
  border-collapse: collapse;

  th {
    background: ${({ theme }) => theme.background.elevated};
    font-weight: ${({ theme }) => theme.fontWeight.semibold};
    color: ${({ theme }) => theme.text};
    border-bottom: 1px solid ${({ theme }) => theme.colors.grey};
    position: sticky;
    top: 0;
    z-index: 1;
  }

  td {
    border-bottom: 1px solid ${({ theme }) => theme.colors.grey};
    color: ${({ theme }) => theme.text};
    transition: background-color 0.2s ease;
  }

  tr:last-child td {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    th,
    td {
      padding: 8px 12px !important;
      font-size: ${({ theme }) => theme.fontSizes.sm};
    }
  }
`

const AnimatedTableRow = styled(motion.tr)<{ $isNew?: boolean }>`
  background: ${({ theme, $isNew }) =>
    $isNew
      ? `linear-gradient(90deg, ${theme.colors.success}20, ${theme.background.surface})`
      : theme.background.surface};

  &:hover {
    background: ${({ theme, $isNew }) =>
      $isNew
        ? `linear-gradient(90deg, ${theme.colors.success}30, ${theme.background.elevated})`
        : theme.background.elevated};
  }

  ${({ $isNew, theme }) =>
    $isNew &&
    `
    box-shadow: 0 0 0 2px ${theme.colors.success}40;
    animation: highlightPulse 2s ease-out;
  `}

  @keyframes highlightPulse {
    0% {
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.success}60;
      background: linear-gradient(
        90deg,
        ${({ theme }) => theme.colors.success}40,
        ${({ theme }) => theme.background.surface}
      );
    }
    50% {
      box-shadow: 0 0 0 4px ${({ theme }) => theme.colors.success}30;
    }
    100% {
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.success}20;
      background: linear-gradient(
        90deg,
        ${({ theme }) => theme.colors.success}20,
        ${({ theme }) => theme.background.surface}
      );
    }
  }
`

const EmptyStateContainer = styled(Box)`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  color: ${({ theme }) => theme.colors.grey};
`

const FortuneHistoryTable = ({ roomId, className }: FortuneHistoryTableProps) => {
  const { history, loading, error, retry } = useFortuneHistory(roomId)
  const containerRef = useRef<HTMLDivElement>(null)
  const previousHistoryIdsRef = useRef<Set<string>>(new Set())
  const [newEntryIds, setNewEntryIds] = useState<Set<string>>(new Set())
  const [scrollPosition, setScrollPosition] = useState(0)

  // Track scroll position to maintain it during updates
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      setScrollPosition(container.scrollTop)
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  // Detect new entries and highlight them
  useEffect(() => {
    if (loading || history.length === 0) return

    const currentIds = new Set(history.map((entry) => entry.id))
    const newIds = new Set<string>()

    // Find entries that weren't in the previous history
    currentIds.forEach((id) => {
      if (!previousHistoryIdsRef.current.has(id)) {
        newIds.add(id)
      }
    })

    if (newIds.size > 0) {
      setNewEntryIds(newIds)

      // Clear highlights after animation duration
      setTimeout(() => {
        setNewEntryIds(new Set())
      }, 2000)
    }

    // Update the ref without causing re-renders
    previousHistoryIdsRef.current = currentIds
  }, [history, loading])

  // Restore scroll position after updates
  useEffect(() => {
    const container = containerRef.current
    if (!container || loading) return

    // Small delay to ensure DOM has updated
    setTimeout(() => {
      container.scrollTop = scrollPosition
    }, 50)
  }, [history.length, scrollPosition, loading])

  const columns = useMemo(
    () => [
      {
        id: 'spinNumber',
        key: 'id' as keyof FortuneHistoryEntry,
        label: 'Spin #',
        align: 'center' as const,
        width: '80px',
      },
      {
        id: 'winnerName',
        key: 'winnerName' as keyof FortuneHistoryEntry,
        label: 'Winner',
        align: 'left' as const,
      },
      {
        id: 'createdAt',
        key: 'createdAt' as keyof FortuneHistoryEntry,
        label: 'Date & Time',
        align: 'left' as const,
        width: '200px',
      },
    ],
    []
  )

  const renderAnimatedTable = () => (
    <AnimatedTable initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.id}
              style={{
                textAlign: col.align || 'left',
                width: col.width,
                padding: 16,
              }}
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <AnimatePresence mode="popLayout">
          {history.map((row, index) => {
            const isNew = newEntryIds.has(row.id)
            const spinNumber = history.length - index
            const formattedDate = dayjs(row.createdAt).format('MMM D, YYYY h:mm A')

            return (
              <AnimatedTableRow
                key={row.id}
                $isNew={isNew}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                    delay: isNew ? 0.1 : 0,
                  },
                }}
                exit={{
                  opacity: 0,
                  y: -20,
                  scale: 0.95,
                  transition: { duration: 0.2 },
                }}
                layout
                layoutId={row.id}
              >
                <td style={{ textAlign: 'center', padding: '12px 24px' }}>
                  <motion.div
                    initial={isNew ? { scale: 1.2 } : false}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Typography $weight="medium" $size="sm">
                      {spinNumber}
                    </Typography>
                  </motion.div>
                </td>
                <td style={{ textAlign: 'left', padding: '12px 24px' }}>
                  <motion.div
                    initial={isNew ? { scale: 1.1, x: 10 } : false}
                    animate={{ scale: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <Typography $weight="medium" $size="sm">
                      {row.winnerName}
                    </Typography>
                  </motion.div>
                </td>
                <td style={{ textAlign: 'left', padding: '12px 24px' }}>
                  <motion.div
                    initial={isNew ? { opacity: 0.5 } : false}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Typography $size="sm" $color="grey">
                      {formattedDate}
                    </Typography>
                  </motion.div>
                </td>
              </AnimatedTableRow>
            )
          })}
        </AnimatePresence>
      </tbody>
    </AnimatedTable>
  )

  // Don't render anything if there's no history and not loading
  if (!loading && !error && history.length === 0) {
    return null
  }

  return (
    <StyledTableContainer ref={containerRef} className={className}>
      <FortuneHistoryDataBoundary loading={loading} error={error} onRetry={retry} showSkeleton={true}>
        {history.length === 0 ? (
          <EmptyStateContainer>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <Typography $size="base" $color="grey">
                No fortune history yet. Spin the wheel to get started!
              </Typography>
            </motion.div>
          </EmptyStateContainer>
        ) : (
          renderAnimatedTable()
        )}
      </FortuneHistoryDataBoundary>
    </StyledTableContainer>
  )
}

export default FortuneHistoryTable
