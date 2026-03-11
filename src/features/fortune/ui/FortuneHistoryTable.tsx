import { useMemo, useRef, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { motion, AnimatePresence } from 'framer-motion'
import { Typography } from 'shared/ui'
import { useFortuneHistory } from 'features/fortune/hooks'
import { FortuneHistoryEntry, FortuneHistoryTableProps } from 'features/fortune/model/fortuneHistoryTypes'
import FortuneHistoryDataBoundary from './FortuneHistoryDataBoundary'
import { cva } from 'class-variance-authority'
import { cn } from 'shared/lib/utils'

const tableContainerVariants = cva(
  'w-full max-h-[400px] overflow-y-auto overflow-x-auto rounded-lg border border-gray-200 bg-surface-light dark:bg-surface-dark shadow-sm scroll-smooth md:max-h-[350px] md:rounded-md sm:max-h-[300px] sm:overflow-x-scroll scrollbar-thin scrollbar-track-surface-light scrollbar-thumb-gray-400 hover:scrollbar-thumb-primary transition-colors'
)

const tableVariants = cva('w-full border-collapse min-w-[400px] sm:min-w-[350px]')

const headerVariants = cva(
  'bg-surface-light dark:bg-surface-dark font-semibold text-gray-900 dark:text-gray-100 border-bottom-2 border-gray-300 sticky top-0 z-10 px-6 py-4 text-sm uppercase tracking-wider shadow-[0_1px_0_rgba(0,0,0,0.05)] md:px-4 md:py-3 md:text-xs sm:px-2 sm:py-1'
)

const cellVariants = cva(
  'border-b border-gray-200 text-gray-900 dark:text-gray-100 px-6 py-4 text-sm align-middle md:px-4 md:py-3 md:text-xs sm:px-2 sm:py-1'
)

const tableRowVariants = cva('cursor-pointer relative transition-all duration-200 group', {
  variants: {
    isNew: {
      true: 'bg-gradient-to-r from-success/15 to-surface-light dark:to-surface-dark shadow-[0_0_0_1px_rgba(30,138,66,0.3)] animate-[highlightPulse_2s_ease-out]',
      false: 'bg-surface-light dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-gray-800',
    },
  },
  defaultVariants: {
    isNew: false,
  },
})

const FortuneHistoryTable = ({ roomId, className }: FortuneHistoryTableProps) => {
  const { history, loading, error, retry } = useFortuneHistory(roomId)
  const containerRef = useRef<HTMLDivElement>(null)
  const previousHistoryIdsRef = useRef<Set<string>>(new Set())
  const [newEntryIds, setNewEntryIds] = useState<Set<string>>(new Set())
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      setScrollPosition(container.scrollTop)
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (loading || history.length === 0) return

    const currentIds = new Set(history.map((entry) => entry.id))
    const newIds = new Set<string>()

    currentIds.forEach((id) => {
      if (!previousHistoryIdsRef.current.has(id)) {
        newIds.add(id)
      }
    })

    if (newIds.size > 0) {
      setNewEntryIds(newIds)
      setTimeout(() => {
        setNewEntryIds(new Set())
      }, 2000)
    }

    previousHistoryIdsRef.current = currentIds
  }, [history, loading])

  useEffect(() => {
    const container = containerRef.current
    if (!container || loading) return

    setTimeout(() => {
      container.scrollTop = scrollPosition
    }, 50)
  }, [history.length, scrollPosition, loading])

  const columns = useMemo(
    () => [
      {
        id: 'spinNumber',
        key: 'id' as keyof FortuneHistoryEntry,
        label: '#',
        align: 'center' as const,
        width: '60px',
      },
      {
        id: 'winnerName',
        key: 'winnerName' as keyof FortuneHistoryEntry,
        label: 'Winner',
        align: 'left' as const,
        flex: 1,
      },
      {
        id: 'createdAt',
        key: 'createdAt' as keyof FortuneHistoryEntry,
        label: 'Date & Time',
        align: 'left' as const,
        width: '180px',
        mobileLabel: 'Date',
      },
    ],
    []
  )

  const renderAnimatedTable = () => (
    <motion.table
      className={tableVariants()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      role="table"
      aria-label="Fortune wheel spin history"
    >
      <caption className="sr-only">History of fortune wheel spins showing winner names and dates</caption>
      <thead>
        <tr role="row">
          {columns.map((col) => (
            <th
              key={col.id}
              role="columnheader"
              scope="col"
              className={headerVariants()}
              style={{
                textAlign: col.align || 'left',
                width: col.width,
              }}
            >
              <span className="inline sm:hidden">{col.label}</span>
              <span className="hidden sm:inline">{col.mobileLabel || col.label}</span>
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
              <motion.tr
                key={row.id}
                role="row"
                className={tableRowVariants({ isNew })}
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
                <td role="cell" className={cn(cellVariants(), 'text-center')}>
                  <motion.div
                    initial={isNew ? { scale: 1.2 } : false}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Typography weight="medium" size="sm">
                      {spinNumber}
                    </Typography>
                  </motion.div>
                </td>
                <td role="cell" className={cn(cellVariants(), 'text-left')}>
                  <motion.div
                    initial={isNew ? { scale: 1.1, x: 10 } : false}
                    animate={{ scale: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <Typography weight="medium" size="sm">
                      {row.winnerName}
                    </Typography>
                  </motion.div>
                </td>
                <td role="cell" className={cn(cellVariants(), 'text-left')}>
                  <motion.div
                    initial={isNew ? { opacity: 0.5 } : false}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Typography size="sm" color="muted">
                      <span className="inline sm:hidden">{formattedDate}</span>
                      <span className="hidden sm:inline">{dayjs(row.createdAt).format('MMM D')}</span>
                    </Typography>
                  </motion.div>
                </td>
              </motion.tr>
            )
          })}
        </AnimatePresence>
      </tbody>
    </motion.table>
  )

  if (!loading && !error && history.length === 0) {
    return null
  }

  return (
    <div ref={containerRef} className={cn(tableContainerVariants(), className)}>
      <FortuneHistoryDataBoundary loading={loading} error={error} onRetry={retry} showSkeleton={true}>
        {history.length === 0 ? (
          <div className="p-12 text-center text-gray-600 bg-surface-light dark:bg-surface-dark rounded-lg sm:p-8 before:content-['🎲'] before:block before:text-5xl before:mb-4 before:opacity-60 sm:before:text-4xl sm:before:mb-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <Typography size="base" color="muted">
                No fortune history yet. Spin the wheel to get started!
              </Typography>
            </motion.div>
          </div>
        ) : (
          renderAnimatedTable()
        )}
      </FortuneHistoryDataBoundary>
    </div>
  )
}

export default FortuneHistoryTable
