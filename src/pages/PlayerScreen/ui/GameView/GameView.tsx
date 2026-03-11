import { Container, Typography, Box, Grid } from 'shared/ui'
import { QuizRoom, QuizPlayer, QuizTimer, OptionButton, useQuizGameTimer } from 'features/quiz'
import { cva } from 'class-variance-authority'

interface GameViewProps {
  room: QuizRoom
  player: QuizPlayer
  handleAnswer: (index: number) => void
  selectedOption: number | null
  hasAnswered: boolean
}

const COLORS = ['#ef4444', '#3b82f6', '#eab308', '#22c55e']

const pageWrapperVariants = cva('min-h-screen bg-primary text-white p-4')

const headerVariants = cva('flex justify-between items-center mb-8')

const questionTextVariants = cva('text-2xl font-bold text-center mb-8')

export const GameView = ({ room, player, handleAnswer, selectedOption, hasAnswered }: GameViewProps) => {
  const currentQuestion = room.questions[room.currentQuestionIndex]
  const timeLeft = useQuizGameTimer(room)
  const totalTime = currentQuestion.timeLimit
  const progress = (timeLeft / totalTime) * 100

  return (
    <div className={pageWrapperVariants()}>
      <Container maxWidth="sm">
        <div className={headerVariants()}>
          <Box>
            <Typography size="xs" weight="bold" className="opacity-80">
              QUESTION
            </Typography>
            <Typography weight="bold" size="lg">
              {room.currentQuestionIndex + 1} / {room.questions.length}
            </Typography>
          </Box>
          <Box className="text-right">
            <Typography size="xs" weight="bold" className="opacity-80">
              SCORE
            </Typography>
            <Typography weight="bold" size="lg">
              {player.score}
            </Typography>
          </Box>
        </div>

        <QuizTimer progress={progress} />

        <div className="mb-12">
          <div className={questionTextVariants()}>{currentQuestion.text}</div>
        </div>

        <Grid gap="md" columns="1fr 1fr">
          {currentQuestion.options.map((option, index) => (
            <OptionButton
              key={index}
              text={option.text}
              color={COLORS[index % COLORS.length]}
              onClick={() => handleAnswer(index)}
              disabled={hasAnswered}
              selected={selectedOption === index}
            />
          ))}
        </Grid>
      </Container>
    </div>
  )
}
