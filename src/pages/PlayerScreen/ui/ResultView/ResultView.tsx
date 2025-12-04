import { Container, Typography, Box } from 'shared/ui'
import { motion } from 'motion/react'
import { CheckCircle, XCircle } from 'lucide-react'
import { StatusCard, PageWrapper } from './styled'
import { QuizPlayer, QuizQuestion } from 'features/quiz'

interface ResultViewProps {
  player: QuizPlayer
  question: QuizQuestion
}

export const ResultView = ({ player, question }: ResultViewProps) => {
  const lastAnswer = player.answers[question.id]
  const isCorrect = lastAnswer?.correct
  const correctOption = question.options.find((opt) => opt.isCorrect)

  return (
    <PageWrapper>
      <Container $maxWidth="sm">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <StatusCard $padding="lg" $isCorrect={isCorrect}>
            {isCorrect ? (
              <>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                  <CheckCircle size={80} color="#059669" />
                </motion.div>
                <Typography as="h2" $size="2xl" $weight="bold" style={{ color: '#059669' }}>
                  Correct!
                </Typography>
                <Typography $weight="bold" $size="lg">
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
                  <XCircle size={80} color="#dc2626" />
                </motion.div>
                <Typography as="h2" $size="2xl" $weight="bold" style={{ color: '#dc2626' }}>
                  Incorrect
                </Typography>
                <Typography>Better luck next time!</Typography>
              </>
            )}

            {correctOption && (
              <Box
                $mt="lg"
                style={{ padding: '1rem', background: 'rgba(0,0,0,0.05)', borderRadius: '8px', width: '100%' }}
              >
                <Typography $size="sm" $color="secondary">
                  Correct Answer:
                </Typography>
                <Typography $weight="bold" $size="lg">
                  {correctOption.text}
                </Typography>
              </Box>
            )}

            <Box $mt="lg">
              <Typography $weight="bold">Total Score: {player.score}</Typography>
            </Box>
          </StatusCard>
        </motion.div>
      </Container>
    </PageWrapper>
  )
}
