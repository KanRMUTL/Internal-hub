import { useState } from 'react'
import { motion } from 'framer-motion'
import styled, { keyframes } from 'styled-components'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { Box, Button, Typography, Alert, ScreenReaderOnly } from 'shared/ui'
import { RoomMember } from 'entities/room'

interface LuckyModalProps {
  winner: RoomMember
  onAccept: () => void
  onDiscard: () => void
  onSaveFortuneHistory?: (winnerId: string, winnerName: string) => Promise<void>
}

const LuckyModal = ({ winner, onAccept, onDiscard, onSaveFortuneHistory }: LuckyModalProps) => {
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const handleAccept = async () => {
    setSaving(true)
    setSaveError(null)

    try {
      // Save fortune history if function is provided
      if (onSaveFortuneHistory) {
        await onSaveFortuneHistory(winner.id, winner.name)
      }
      // Call the original onAccept handler
      onAccept()
    } catch (error) {
      console.error('Failed to save fortune history:', error)
      const errorMessage = getErrorMessage(error as Error)
      setSaveError(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  const handleRetry = () => {
    setSaveError(null)
    handleAccept()
  }

  const getErrorMessage = (error: Error): string => {
    const message = error.message.toLowerCase()

    if (message.includes('network') || message.includes('offline')) {
      return 'Network connection failed. Please check your internet connection and try again.'
    }

    if (message.includes('permission') || message.includes('unauthorized')) {
      return 'You do not have permission to save fortune history.'
    }

    return 'Failed to save fortune history. Please try again.'
  }

  return (
    <Box
      $position="fixed"
      style={{
        inset: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
        padding: '16px',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="winner-title"
      aria-describedby="winner-description"
    >
      <motion.div
        initial={{
          scale: 0.8,
          opacity: 0,
          y: 50,
          rotateX: -15,
        }}
        animate={{
          scale: 1,
          opacity: 1,
          y: 0,
          rotateX: 0,
        }}
        exit={{
          scale: 0.9,
          opacity: 0,
          y: 20,
          transition: { duration: 0.2, ease: 'easeIn' },
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 25,
          duration: 0.4,
        }}
      >
        <Box
          $flex
          $direction="column"
          $align="center"
          $gap="lg"
          $bg="surface"
          $radius="xl"
          $shadow="xl"
          $position="relative"
          style={{ background: 'rgba(0,0,0,0)' }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ scale: 0.9, rotateY: -10 }}
            animate={{
              scale: 1,
              rotateY: 0,
              transition: { delay: 0.2, duration: 0.3 },
            }}
          >
            <RainbowBorder>
              <Box $flex $justify="center" $align="center" $p="lg" $pointer>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: 0.4, duration: 0.3 },
                  }}
                >
                  <Typography
                    id="winner-title"
                    $size="xl"
                    $weight="bold"
                    $color="white"
                    $pointer
                    role="heading"
                    aria-level={1}
                    $noWrap
                  >
                    <ScreenReaderOnly>Winner: </ScreenReaderOnly>
                    <span aria-hidden="true">🎆</span> {winner.name} <span aria-hidden="true">🎉</span>
                  </Typography>
                </motion.div>
              </Box>
            </RainbowBorder>
          </motion.div>

          {saveError && (
            <Box $width="100%" $maxWidth="350px">
              <Alert $type="danger">
                <Box $flex $direction="column" $gap="sm" $align="center">
                  <Box $flex $align="center" $gap="sm">
                    <AlertTriangle size={16} />
                    <Typography $size="sm" $weight="medium">
                      {saveError}
                    </Typography>
                  </Box>
                  <Button $variant="info" $size="sm" onClick={handleRetry} disabled={saving}>
                    Try Again
                  </Button>
                </Box>
              </Alert>
            </Box>
          )}

          <Box
            $flex
            $gap="md"
            $width="100%"
            $justify="center"
            style={{
              flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
            }}
          >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.8 }}>
              <Button
                onClick={handleAccept}
                disabled={saving}
                aria-label={
                  saving ? `Saving ${winner.name} as winner` : `Accept ${winner.name} as winner and save to history`
                }
                $loadingText={`Saving ${winner.name} as winner`}
              >
                <Box $flex $align="center" $gap="sm">
                  {saving && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: 'linear',
                      }}
                      aria-hidden="true"
                    >
                      <Loader2 size={16} />
                    </motion.div>
                  )}
                  {saving ? (
                    'Saving...'
                  ) : (
                    <>
                      <span aria-hidden="true">✅</span> Accept
                    </>
                  )}
                </Box>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.8 }}>
              <Button
                onClick={onDiscard}
                $variant="danger"
                disabled={saving}
                aria-label={`Discard ${winner.name} as winner and spin again`}
              >
                <span aria-hidden="true">🔄</span> Discard
              </Button>
            </motion.div>
          </Box>
        </Box>
      </motion.div>
    </Box>
  )
}

export default LuckyModal

const rainbow = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`

const RainbowBorder = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background: linear-gradient(270deg, red, orange, yellow, green, blue, indigo, violet, red);
  background-size: 1400% 1400%;
  animation: ${rainbow} 5s linear infinite;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow:
    ${({ theme }) => theme.shadow.lg},
    0 0 20px rgba(255, 255, 255, 0.3);
  position: relative;

  /* Enhanced winner display */
  & > div {
    background: rgba(0, 0, 0, 0.8);
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);

    /* Better typography hierarchy */
    span {
      font-size: ${({ theme }) => theme.fontSizes.xxl};
      font-weight: ${({ theme }) => theme.fontWeight.bold};
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
      letter-spacing: 0.5px;

      /* Responsive text sizing */
      @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
        font-size: ${({ theme }) => theme.fontSizes.xl};
      }
    }
  }

  /* Celebration effect */
  &::before {
    content: '';
    position: absolute;
    inset: -4px;
    background: inherit;
    border-radius: inherit;
    z-index: -1;
    filter: blur(8px);
    opacity: 0.7;
  }

  /* Mobile adjustments */
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`
