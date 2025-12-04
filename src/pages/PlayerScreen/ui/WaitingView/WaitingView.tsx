import { Container, Typography, Box } from 'shared/ui'
import { motion } from 'motion/react'
import { StatusCard, PageWrapper } from './styled'
import { QuizPlayer } from 'features/quiz'

interface WaitingViewProps {
  player: QuizPlayer
}

export const WaitingView = ({ player }: WaitingViewProps) => {
  return (
    <PageWrapper>
      <Container $maxWidth="sm">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <StatusCard $padding="lg">
            <Typography as="h2" $size="xl" $weight="bold">
              You're in!
            </Typography>
            <Typography>See your nickname on screen?</Typography>
            <Box
              $bg="primary"
              style={{ padding: '0.5rem 1rem', borderRadius: '8px', color: 'white', marginTop: '1rem' }}
            >
              <Typography $weight="bold">{player.nickname}</Typography>
            </Box>
          </StatusCard>
        </motion.div>
      </Container>
    </PageWrapper>
  )
}
