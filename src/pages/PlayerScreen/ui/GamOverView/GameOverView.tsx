import { Container, Typography, Box } from 'shared/ui'
import { motion } from 'framer-motion'
import { QuizPlayer } from 'features/quiz'
import { cva } from 'class-variance-authority'

interface GameOverViewProps {
  player: QuizPlayer
  allPlayers: QuizPlayer[]
}

const pageWrapperVariants = cva('min-h-screen bg-primary flex items-center justify-center p-4')

const statusCardVariants = cva('bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl text-center w-full max-w-sm')

export const GameOverView = ({ player, allPlayers }: GameOverViewProps) => {
  const sortedPlayers = [...allPlayers].sort((a, b) => b.score - a.score)
  const rank = sortedPlayers.findIndex((p) => p.id === player.id) + 1

  return (
    <div className={pageWrapperVariants()}>
      <Container $maxWidth="sm">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className={statusCardVariants()}>
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
          </div>
        </motion.div>
      </Container>
    </div>
  )
}
