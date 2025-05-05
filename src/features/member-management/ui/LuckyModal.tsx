import { motion } from 'framer-motion'
import styled, { keyframes } from 'styled-components'
import { Button, Typography } from 'shared/ui'
import { MemberItem } from 'features/member-management/ui'
import { RoomMember } from 'entities/room'

interface LuckyModalProps {
  winner: RoomMember
  onAccept: () => void
  onDiscard: () => void
  onClickMember: (id: string) => void
}

const LuckyModal = ({ winner, onAccept, onDiscard, onClickMember }: LuckyModalProps) => {
  return (
    <Backdrop>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <WinnerWrapper>
          <RainbowBorder>
            <MemberItem id={winner.id} name={winner.name} onClick={onClickMember} />
          </RainbowBorder>
          <FireworksText>🎆 {winner.name} 🎉</FireworksText>

          <ButtonRow>
            <Button $size="lg" onClick={onDiscard} $variant="grey">
              🔄 Discard
            </Button>
            <Button $size="lg" onClick={onAccept}>
              ✅ Accept
            </Button>
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
  padding: 10px;
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

const FireworksText = styled(Typography)`
  color: white;
  font-size: 2rem;
  text-align: center;
  margin-top: 1rem;
`

const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  justify-content: center;
`
