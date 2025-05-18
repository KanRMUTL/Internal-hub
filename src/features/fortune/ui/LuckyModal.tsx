import { motion } from 'framer-motion'
import styled, { keyframes } from 'styled-components'
import { Box, Button, Typography } from 'shared/ui'
import { RoomMember } from 'entities/room'

interface LuckyModalProps {
  winner: RoomMember
  onAccept: () => void
  onDiscard: () => void
}

const LuckyModal = ({ winner, onAccept, onDiscard }: LuckyModalProps) => {
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

          <ButtonRow>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.8 }}>
              <Button onClick={onDiscard} $variant="grey">
                🔄 Discard
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.8 }}>
              <Button onClick={onAccept}>✅ Accept</Button>
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
