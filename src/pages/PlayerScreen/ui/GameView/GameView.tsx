import { Container, Typography, Box, Grid } from 'shared/ui'
import { PageWrapper, Header, QuestionText } from './styled'
import { QuizRoom, QuizPlayer, QuizTimer, OptionButton, useQuizGameTimer } from 'features/quiz'

interface GameViewProps {
  room: QuizRoom
  player: QuizPlayer
  handleAnswer: (index: number) => void
  selectedOption: number | null
  hasAnswered: boolean
}

const COLORS = ['#ef4444', '#3b82f6', '#eab308', '#22c55e'] // Red, Blue, Yellow, Green

export const GameView = ({ room, player, handleAnswer, selectedOption, hasAnswered }: GameViewProps) => {
  const currentQuestion = room.questions[room.currentQuestionIndex]
  const timeLeft = useQuizGameTimer(room)
  const totalTime = currentQuestion.timeLimit
  const progress = (timeLeft / totalTime) * 100

  return (
    <PageWrapper>
      <Container $maxWidth="sm">
        <Header>
          <Box>
            <Typography $size="xs" $weight="bold" style={{ opacity: 0.8 }}>
              QUESTION
            </Typography>
            <Typography $weight="bold" $size="lg">
              {room.currentQuestionIndex + 1} / {room.questions.length}
            </Typography>
          </Box>
          <Box style={{ textAlign: 'right' }}>
            <Typography $size="xs" $weight="bold" style={{ opacity: 0.8 }}>
              SCORE
            </Typography>
            <Typography $weight="bold" $size="lg">
              {player.score}
            </Typography>
          </Box>
        </Header>

        <QuizTimer progress={progress} />

        <Box $mb="xl">
          <QuestionText>{currentQuestion.text}</QuestionText>
        </Box>

        <Grid $gap="md" $columns="1fr 1fr">
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
    </PageWrapper>
  )
}
