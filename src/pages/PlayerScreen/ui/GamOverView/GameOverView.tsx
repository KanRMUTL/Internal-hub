import { Container, Typography, Box } from 'shared/ui'
import { motion } from 'motion/react'
import { StatusCard, PageWrapper } from './styled'
import { QuizPlayer } from 'features/quiz'

interface GameOverViewProps {
  player: QuizPlayer
  allPlayers: QuizPlayer[]
}

export const GameOverView = ({ player, allPlayers }: GameOverViewProps) => {
  const sortedPlayers = [...allPlayers].sort((a, b) => b.score - a.score)
  const rank = sortedPlayers.findIndex((p) => p.id === player.id) + 1

  return (
    <PageWrapper>
      <Container $maxWidth="sm">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <StatusCard $padding="lg">
            <Typography as="h2" $size="2xl" $weight="bold">
              Game Over
            </Typography>
            <Typography $size="lg">You placed</Typography>
            <Typography $size="3xl" $weight="bold" $color="primary">
              #{rank}
            </Typography>
            <Box $mt="lg">
              <Typography $weight="bold">Score: {player.score}</Typography>
            </Box>
          </StatusCard>
        </motion.div>
      </Container>
    </PageWrapper>
  )
}
