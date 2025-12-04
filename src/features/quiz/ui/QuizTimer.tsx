import styled from 'styled-components'
import { motion } from 'motion/react'

interface QuizTimerProps {
  progress: number
}

export const QuizTimer = ({ progress }: QuizTimerProps) => {
  return (
    <TimerBarContainer>
      <TimerFill
        initial={{ width: '100%' }}
        animate={{ width: `${progress}%` }}
        transition={{ ease: 'linear', duration: 0.1 }}
      />
    </TimerBarContainer>
  )
}

const TimerBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  margin-bottom: 2rem;
  overflow: hidden;
`

const TimerFill = styled(motion.div)`
  height: 100%;
  background: #fbbf24; // Amber 400
  border-radius: 4px;
`
