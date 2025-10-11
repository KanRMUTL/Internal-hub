import { useState } from 'react'
import { motion } from 'framer-motion'
import styled, { keyframes } from 'styled-components'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { Box, Button, Typography, Alert } from 'shared/ui'
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
    <Backdrop>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <WinnerWrapper>
          <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>
            <RainbowBorder>
              <Box $flex $justify="center" $align="center" $p="lg" $pointer>
                <Typography $size="xl" $weight="bold" $color="white" $pointer>
                  🎆 {winner.name} 🎉
                </Typography>
              </Box>
            </RainbowBorder>
          </motion.div>

          {saveError && (
            <ErrorContainer>
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
            </ErrorContainer>
          )}

          <ButtonRow>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.8 }}>
              <Button onClick={onDiscard} $variant="grey" disabled={saving}>
                🔄 Discard
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.8 }}>
              <Button onClick={handleAccept} disabled={saving}>
                <Box $flex $align="center" $gap="sm">
                  {saving && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: 'linear',
                      }}
                    >
                      <Loader2 size={16} />
                    </motion.div>
                  )}
                  {saving ? 'Saving...' : '✅ Accept'}
                </Box>
              </Button>
            </motion.div>
          </ButtonRow>
        </WinnerWrapper>
      </motion.div>
    </Backdrop>
  )
}

export default LuckyModal

const rainbow = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`

const RainbowBorder = styled.div`
  padding: 16px;
  background: linear-gradient(270deg, red, orange, yellow, green, blue, indigo, violet, red);
  background-size: 1400% 1400%;
  animation: ${rainbow} 5s linear infinite;
  border-radius: 1rem;
`

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`

const WinnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`

const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  justify-content: center;
`

const ErrorContainer = styled.div`
  margin-top: 1rem;
  max-width: 300px;
`
