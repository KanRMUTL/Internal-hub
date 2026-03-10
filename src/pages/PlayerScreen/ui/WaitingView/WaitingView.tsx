import { Container, Typography, Box } from 'shared/ui'
import { motion } from 'framer-motion'
import { QuizPlayer } from 'features/quiz'
import { cva } from 'class-variance-authority'

interface WaitingViewProps {
  player: QuizPlayer
}

const pageWrapperVariants = cva('min-h-screen bg-primary flex items-center justify-center p-4')

const statusCardVariants = cva('bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl text-center w-full max-w-sm')

export const WaitingView = ({ player }: WaitingViewProps) => {
  return (
    <div className={pageWrapperVariants()}>
      <Container $maxWidth="sm">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className={statusCardVariants()}>
            <Typography as="h2" $size="xl" $weight="bold">
              You're in!
            </Typography>
            <Typography>See your nickname on screen?</Typography>
            <div className="bg-primary px-4 py-2 rounded-lg text-white mt-4">
              <Typography $weight="bold">{player.nickname}</Typography>
            </div>
          </div>
        </motion.div>
      </Container>
    </div>
  )
}
