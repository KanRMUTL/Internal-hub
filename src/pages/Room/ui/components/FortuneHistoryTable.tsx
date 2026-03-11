import { useContext, useMemo } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { AnimatePresence, motion } from 'motion/react'
import { Typography, Box, Card } from 'shared/ui'
import { useFortuneHistory } from 'features/fortune'
import { Clock, PartyPopper } from 'lucide-react'
import { ThemeContext } from 'features/toggle-theme/providers/context'

// Extend dayjs with relative time plugin
dayjs.extend(relativeTime)

interface FortuneHistoryTableProps {
  roomId: string
}

const FortuneHistoryTable = ({ roomId }: FortuneHistoryTableProps) => {
  const { history, loading, error } = useFortuneHistory(roomId)
  const { mode } = useContext(ThemeContext)
  const enhancedHistory = useMemo(() => {
    return history.map((entry, index) => ({
      ...entry,
      spinNumber: history.length - index,
      relativeTime: dayjs(entry.createdAt).fromNow(),
      formattedDate: dayjs(entry.createdAt).format('MMM D, YYYY'),
      formattedTime: dayjs(entry.createdAt).format('h:mm A'),
    }))
  }, [history])

  if (loading) {
    return (
      <Box p="md" style={{ maxHeight: window.innerWidth >= 1024 ? 'calc(100vh - 200px)' : '60vh' }}>
        <Box flex justify="center" direction="column" gap="sm">
          <Typography size="lg" color="muted" align="center" weight="medium">
            Loading History...
          </Typography>
        </Box>
      </Box>
    )
  }

  if (error) {
    return (
      <Box p="md" style={{ maxHeight: window.innerWidth >= 1024 ? 'calc(100vh - 200px)' : '60vh' }}>
        <Box flex justify="center" direction="column" gap="sm">
          <Typography size="lg" color="muted" align="center" weight="medium">
            Failed to load history
          </Typography>
        </Box>
      </Box>
    )
  }

  if (enhancedHistory.length === 0) {
    return (
      <Box p="md" style={{ maxHeight: window.innerWidth >= 1024 ? 'calc(100vh - 200px)' : '60vh' }}>
        <Box flex justify="center" direction="column" gap="sm">
          <Typography size="lg" color="muted" align="center" weight="medium">
            🎲 No Fortune History yet
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box p="md" style={{ maxHeight: window.innerWidth >= 1024 ? 'calc(100vh - 200px)' : '60vh' }}>
      <Box flex direction="column" gap="md">
        <AnimatePresence mode="popLayout">
          {enhancedHistory.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{
                duration: 0.5,
                delay: index === 0 ? 0.1 : 0, // Slight delay for the newest entry
                ease: [0.4, 0.0, 0.2, 1],
              }}
              layout
            >
              <Card padding="md" interactive rounded="md" shadow="sm">
                <Box flex align="center" gap="md">
                  <PartyPopper width={48} height={48} color="#FFC600" />

                  <Box flex direction="column" gap="xs" style={{ flex: 1 }}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: index === 0 ? 0.3 : 0.2,
                      }}
                    >
                      <Typography size="lg" color="success" weight="semibold" pointer>
                        {entry.winnerName}
                      </Typography>
                    </motion.div>
                    <Box flex direction="column" style={{ gap: '2px' }}>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: index === 0 ? 0.4 : 0.3,
                        }}
                      >
                        <Box flex align="center" gap="xs">
                          <Clock
                            width={16}
                            height={16}
                            color={mode === 'LIGHT' ? 'rgba(0, 0, 0, 0.3) ' : 'rgba(255, 255, 255, 0.3)'}
                          />
                          <Typography size="base" color="muted" pointer>
                            {entry.relativeTime}
                          </Typography>
                        </Box>
                      </motion.div>
                    </Box>
                  </Box>
                </Box>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>
    </Box>
  )
}

export default FortuneHistoryTable
