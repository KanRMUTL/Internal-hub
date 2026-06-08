import { ReactNode, useState } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import { Box, Button, Typography, Spinner, Alert } from 'shared/ui'

interface FortuneHistoryDataBoundaryProps {
  loading: boolean
  error: Error | null
  onRetry?: () => void
  children: ReactNode
  showSkeleton?: boolean
}

const FortuneHistoryDataBoundary = ({
  loading,
  error,
  onRetry,
  children,
  showSkeleton = false,
}: FortuneHistoryDataBoundaryProps) => {
  const [retrying, setRetrying] = useState(false)

  const handleRetry = async () => {
    if (!onRetry) return

    setRetrying(true)
    try {
      await onRetry()
    } finally {
      setRetrying(false)
    }
  }

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        showSkeleton ? (
          <FortuneHistorySkeleton />
        ) : (
          <LoadingState />
        )
      ) : error ? (
        <motion.div
          key="error"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <ErrorState>
            <Alert $type="danger">
              <Box $flex $direction="column" $gap="md" $align="center">
                <Typography $size="sm" $weight="medium">
                  {getErrorMessage(error)}
                </Typography>
                {onRetry && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button $variant="info" $size="sm" onClick={handleRetry} disabled={retrying}>
                      <Box $flex $align="center" $gap="sm">
                        <motion.div
                          animate={retrying ? { rotate: 360 } : {}}
                          transition={{
                            repeat: retrying ? Infinity : 0,
                            duration: 1,
                            ease: 'linear',
                          }}
                        >
                          <RefreshCw size={16} />
                        </motion.div>
                        {retrying ? 'Retrying...' : 'Try Again'}
                      </Box>
                    </Button>
                  </motion.div>
                )}
              </Box>
            </Alert>
          </ErrorState>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const LoadingState = () => (
  <motion.div
    key="loading"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.3 }}
  >
    <LoadingContainer>
      <Spinner size={32} label="Loading fortune history..." />
    </LoadingContainer>
  </motion.div>
)

const FortuneHistorySkeleton = () => (
  <motion.div
    key="skeleton"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    <SkeletonContainer>
      {Array.from({ length: 5 }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <SkeletonRow>
            <SkeletonAvatar />
            <SkeletonBody>
              <SkeletonBar $width="55%" $height="13px" />
              <SkeletonBar $width="35%" $height="11px" />
            </SkeletonBody>
          </SkeletonRow>
        </motion.div>
      ))}
    </SkeletonContainer>
  </motion.div>
)

const getErrorMessage = (error: Error): string => {
  // Network-related errors
  if (error.message.includes('network') || error.message.includes('offline')) {
    return 'Network connection failed. Please check your internet connection and try again.'
  }

  // Permission errors
  if (error.message.includes('permission') || error.message.includes('unauthorized')) {
    return 'You do not have permission to access fortune history. Please contact an administrator.'
  }

  // Firestore-specific errors
  if (error.message.includes('firestore') || error.message.includes('firebase')) {
    return 'Database connection failed. Please try again in a moment.'
  }

  // Generic fallback
  return 'Failed to load fortune history. Please try again.'
}

export default FortuneHistoryDataBoundary

// Styled Components
const LoadingContainer = styled(Box)`
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 120px;
`

const ErrorState = styled(Box)`
  padding: ${({ theme }) => theme.spacing.lg};
`

/**
 * Visual boundary (border, background, border-radius) is owned by the
 * parent SideCard — drawing it here produced a 3-deep nested card stack
 * (SideCard → ScrollArea → SkeletonContainer) during loading.
 */
const SkeletonContainer = styled.div`
  width: 100%;
  overflow: hidden;
`

const SkeletonRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grey[100]};

  &:last-child {
    border-bottom: 0;
  }
`

const SkeletonAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.grey[200]};
  flex-shrink: 0;
`

const SkeletonBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
`

const SkeletonBar = styled.div<{ $width: string; $height: string }>`
  width: ${({ $width }) => $width};
  height: ${({ $height }) => $height};
  background: ${({ theme }) => theme.colors.grey[200]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  animation: shimmer 1.5s ease-in-out infinite;

  @keyframes shimmer {
    0%,
    100% {
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
  }
`
