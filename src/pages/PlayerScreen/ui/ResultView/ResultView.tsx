import { Container, Typography } from 'shared/ui'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle } from 'lucide-react'
import { QuizPlayer, QuizQuestion } from 'features/quiz'
import { cva } from 'class-variance-authority'

interface ResultViewProps {
  player: QuizPlayer
  question: QuizQuestion
}

const pageWrapperVariants = cva('min-h-screen bg-primary flex items-center justify-center p-4')

const statusCardVariants = cva('p-8 rounded-2xl shadow-xl flex flex-col items-center gap-4 w-full max-w-sm', {
  variants: {
    isCorrect: {
      true: 'bg-green-50 border-4 border-green-500',
      false: 'bg-red-50 border-4 border-red-500',
    },
  },
  defaultVariants: {
    isCorrect: false,
  },
})

export const ResultView = ({ player, question }: ResultViewProps) => {
  const lastAnswer = player.answers[question.id]
  const isCorrect = lastAnswer?.correct
  const correctOption = question.options.find((opt) => opt.isCorrect)

  return (
    <div className={pageWrapperVariants()}>
      <Container maxWidth="sm">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className={statusCardVariants({ isCorrect })}>
            {isCorrect ? (
              <>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                  <CheckCircle size={80} className="text-green-600" />
                </motion.div>
                <Typography size="3xl" weight="bold" className="text-green-600">
                  Correct!
                </Typography>
                <Typography weight="bold" size="lg">
                  +{' '}
                  {lastAnswer
                    ? Math.ceil(1000 * (Math.max(0, question.timeLimit - (lastAnswer.time || 0)) / question.timeLimit))
                    : 0}{' '}
                  points
                </Typography>
              </>
            ) : (
              <>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                  <XCircle size={80} className="text-red-600" />
                </motion.div>
                <Typography size="3xl" weight="bold" className="text-red-600">
                  Incorrect
                </Typography>
                <Typography>Better luck next time!</Typography>
              </>
            )}

            {correctOption && (
              <div className="mt-4 p-4 bg-black/5 rounded-lg w-full">
                <Typography size="sm" color="secondary">
                  Correct Answer:
                </Typography>
                <Typography weight="bold" size="lg">
                  {correctOption.text}
                </Typography>
              </div>
            )}

            <div className="mt-4">
              <Typography weight="bold">Total Score: {player.score}</Typography>
            </div>
          </div>
        </motion.div>
      </Container>
    </div>
  )
}
