import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { QuizService, QuizRoom, QuizPlayer } from 'features/quiz'
import { Container, Typography, Box, Card, Grid } from 'shared/ui'
import styled, { css } from 'styled-components'
import { CheckCircle, XCircle } from 'lucide-react'
import { motion } from 'motion/react'

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`

const QuestionText = styled(Typography)`
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
  line-height: 1.4;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (min-width: 768px) {
    font-size: 2rem;
  }
`

const OptionButton = styled(motion.button)<{ $color: string; $selected?: boolean; $disabled?: boolean }>`
  width: 100%;
  padding: 1.5rem;
  border: none;
  border-radius: 16px;
  background-color: ${({ $color }) => $color};
  color: white;
  font-size: 1.25rem;
  font-weight: bold;
  cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};
  opacity: ${({ $disabled, $selected }) => ($disabled && !$selected ? 0.3 : 1)};
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  &:active {
    transform: ${({ $disabled }) => ($disabled ? 'none' : 'translateY(4px)')};
    box-shadow: ${({ $disabled }) => ($disabled ? '0 4px 0 rgba(0, 0, 0, 0.2)' : 'none')};
  }

  ${({ $selected }) =>
    $selected &&
    css`
      transform: translateY(4px);
      box-shadow: none;
      ring: 4px solid white;
    `}
`

const StatusCard = styled(Card)<{ $isCorrect?: boolean }>`
  text-align: center;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  background-color: white;
  border-radius: 24px;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
`

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

const COLORS = ['#ef4444', '#3b82f6', '#eab308', '#22c55e'] // Red, Blue, Yellow, Green

export const PlayerScreen = () => {
  const { roomId } = useParams<{ roomId: string }>()
  const [room, setRoom] = useState<QuizRoom | null>(null)
  const [player, setPlayer] = useState<QuizPlayer | null>(null)
  const [allPlayers, setAllPlayers] = useState<QuizPlayer[]>([])
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)

  const playerId = localStorage.getItem(`quiz_player_${roomId}`)
  const navigate = useNavigate()

  useEffect(() => {
    if (!playerId) {
      navigate('/quiz/join')
      return
    }
  }, [playerId, navigate])

  useEffect(() => {
    if (!roomId || !playerId) return

    const unsubscribeRoom = QuizService.subscribeToRoom(roomId, (roomData) => {
      setRoom(roomData)
      if (
        roomData?.currentQuestionState === 'question' &&
        roomData.currentQuestionIndex !== room?.currentQuestionIndex
      ) {
        setSelectedOption(null)
        setHasAnswered(false)
      }
    })

    const unsubscribePlayer = QuizService.subscribeToPlayer(roomId, playerId, (playerData) => {
      setPlayer(playerData)
    })

    const unsubscribeAllPlayers = QuizService.subscribeToPlayers(roomId, (playersData) => {
      setAllPlayers(playersData)
    })

    return () => {
      unsubscribeRoom()
      unsubscribePlayer()
      unsubscribeAllPlayers()
    }
  }, [roomId, playerId, room?.currentQuestionIndex])

  // Timer logic
  useEffect(() => {
    if (room?.currentQuestionState === 'question' && room.questions[room.currentQuestionIndex]) {
      const timeLimit = room.questions[room.currentQuestionIndex].timeLimit

      // Calculate remaining time based on start time if available, otherwise just use local countdown (less accurate but fine for UI)
      // Ideally we sync with server start time.
      if (room.startTime) {
        const startTimeMillis = room.startTime.toMillis()
        const updateTimer = () => {
          const now = Date.now()
          const elapsed = (now - startTimeMillis) / 1000
          const remaining = Math.max(0, timeLimit - elapsed)
          setTimeLeft(remaining)
          if (remaining > 0) {
            requestAnimationFrame(updateTimer)
          }
        }
        updateTimer()
      } else {
        setTimeLeft(timeLimit)
      }
    }
  }, [room?.currentQuestionIndex, room?.currentQuestionState, room?.startTime])

  const handleAnswer = async (optionIndex: number) => {
    if (hasAnswered || !roomId || !playerId || !room) return

    setSelectedOption(optionIndex)
    setHasAnswered(true)

    const currentQuestion = room.questions[room.currentQuestionIndex]
    const isCorrect = currentQuestion.options[optionIndex].isCorrect
    const timeLimit = currentQuestion.timeLimit

    let elapsedTime = 0
    if (room.startTime) {
      const startTimeMillis = room.startTime.toMillis()
      const nowMillis = Date.now()
      elapsedTime = (nowMillis - startTimeMillis) / 1000
    }
    elapsedTime = Math.max(0, Math.min(elapsedTime, timeLimit))

    let points = 0
    if (isCorrect) {
      const timeLeft = Math.max(0, timeLimit - elapsedTime)
      points = Math.ceil(1000 * (timeLeft / timeLimit))
    }

    await QuizService.submitAnswer(roomId, playerId, room.questions[room.currentQuestionIndex].id, {
      optionIndex: optionIndex,
      time: elapsedTime,
      correct: isCorrect,
    })

    if (isCorrect) {
      await QuizService.updatePlayerScore(roomId, playerId, points, true)
    } else {
      await QuizService.updatePlayerScore(roomId, playerId, 0, false)
    }
  }

  if (!room || !player)
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    )

  if (room.status === 'waiting') {
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

  if (room.status === 'finished') {
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

  const currentQuestion = room.questions[room.currentQuestionIndex]
  const isResultState = room.currentQuestionState === 'result'

  if (isResultState) {
    const lastAnswer = player.answers[currentQuestion.id]
    const isCorrect = lastAnswer?.correct
    const correctOption = currentQuestion.options.find((opt) => opt.isCorrect)

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
                      ? Math.ceil(
                          1000 *
                            (Math.max(0, currentQuestion.timeLimit - (lastAnswer.time || 0)) /
                              currentQuestion.timeLimit)
                        )
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

        <TimerBarContainer>
          <TimerFill
            initial={{ width: '100%' }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'linear', duration: 0.1 }}
          />
        </TimerBarContainer>

        <Box $mb="xl">
          <QuestionText>{currentQuestion.text}</QuestionText>
        </Box>

        <Grid $gap="md" $columns="1fr 1fr">
          {currentQuestion.options.map((option, index) => (
            <OptionButton
              key={index}
              $color={COLORS[index % COLORS.length]}
              onClick={() => handleAnswer(index)}
              $disabled={hasAnswered}
              $selected={selectedOption === index}
              whileHover={{ scale: hasAnswered ? 1 : 1.02 }}
              whileTap={{ scale: 0.95 }}
            >
              {option.text}
            </OptionButton>
          ))}
        </Grid>
      </Container>
    </PageWrapper>
  )
}
