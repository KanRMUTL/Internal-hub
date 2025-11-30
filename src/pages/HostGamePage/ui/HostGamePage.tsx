import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { QuizService, QuizRoom, QuizPlayer } from 'features/quiz'
import { Container, Typography, Box, Card, Button, Grid } from 'shared/ui'
import styled, { css } from 'styled-components'
import { SkipForward, BarChart2, Trophy, Crown } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 2rem 0;
  overflow-x: hidden;
`

const QuestionCard = styled(Card)`
  background: white;
  color: ${({ theme }) => theme.text};
  text-align: center;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
`

const OptionCard = styled(motion.div)<{ $isCorrect?: boolean; $showResult?: boolean; $color?: string }>`
  padding: 2rem;
  text-align: center;
  font-weight: bold;
  font-size: 1.5rem;
  border-radius: 16px;
  background-color: ${({ theme, $isCorrect, $showResult }) =>
    $showResult ? ($isCorrect ? theme.colors.success : theme.colors.grey[200]) : 'white'};
  border: ${({ theme, $showResult, $isCorrect }) =>
    $showResult ? ($isCorrect ? `4px solid ${theme.colors.success}` : 'none') : `none`};
  box-shadow: ${({ $showResult }) => ($showResult ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)')};
  color: ${({ theme, $showResult, $isCorrect }) => ($showResult && $isCorrect ? theme.colors.white : theme.text)};
  opacity: ${({ $showResult, $isCorrect }) => ($showResult && !$isCorrect ? 0.4 : 1)};

  ${({ $showResult, $color }) =>
    !$showResult &&
    $color &&
    css`
      border-left: 8px solid ${$color};
    `}
`

const PodiumContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 1rem;
  height: 300px;
  margin-bottom: 2rem;
`

const PodiumStep = styled(motion.div)<{ $rank: number; $height: string; $color: string }>`
  width: 100px;
  height: ${({ $height }) => $height};
  background: ${({ $color }) => $color};
  border-radius: 12px 12px 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 1rem;
  color: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  position: relative;
`

const AvatarCircle = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: white;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  border: 4px solid rgba(255, 255, 255, 0.3);
  position: absolute;
  top: -30px;
`

const RankBadge = styled.div`
  background: rgba(0, 0, 0, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: bold;
  margin-top: 2rem;
`

const TimerCircle = styled.svg`
  transform: rotate(-90deg);
  width: 60px;
  height: 60px;
`

const TimerCircleBackground = styled.circle`
  fill: none;
  stroke: #e5e7eb;
  stroke-width: 6;
`

const TimerCircleProgress = styled(motion.circle)`
  fill: none;
  stroke: #f59e0b;
  stroke-width: 6;
  stroke-linecap: round;
`

const COLORS = ['#ef4444', '#3b82f6', '#eab308', '#22c55e']

export const HostGamePage = () => {
  const { roomId } = useParams<{ roomId: string }>()
  const [room, setRoom] = useState<QuizRoom | null>(null)
  const [players, setPlayers] = useState<QuizPlayer[]>([])
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    if (!roomId) return

    const unsubscribeRoom = QuizService.subscribeToRoom(roomId, (roomData) => {
      setRoom(roomData)
    })

    const unsubscribePlayers = QuizService.subscribeToPlayers(roomId, (playersData) => {
      setPlayers(playersData)
    })

    return () => {
      unsubscribeRoom()
      unsubscribePlayers()
    }
  }, [roomId])

  useEffect(() => {
    if (room?.currentQuestionState === 'question' && room.questions[room.currentQuestionIndex]) {
      const timeLimit = room.questions[room.currentQuestionIndex].timeLimit

      if (room.startTime) {
        const startTimeMillis = room.startTime.toMillis()
        const updateTimer = () => {
          const now = Date.now()
          const elapsed = (now - startTimeMillis) / 1000
          const remaining = Math.max(0, timeLimit - elapsed)
          setTimeLeft(remaining)

          if (remaining <= 0) {
            if (remaining <= 0.1) {
              handleShowResults()
            }
          } else {
            requestAnimationFrame(updateTimer)
          }
        }
        updateTimer()
      } else {
        setTimeLeft(timeLimit)
        const timer = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(timer)
              handleShowResults()
              return 0
            }
            return prev - 1
          })
        }, 1000)
        return () => clearInterval(timer)
      }
    }
  }, [room?.currentQuestionIndex, room?.currentQuestionState, room?.startTime])

  const handleShowResults = async () => {
    if (!roomId) return
    await QuizService.showQuestionResults(roomId)
  }

  // Auto-show results when everyone has answered
  useEffect(() => {
    if (!room || room.currentQuestionState !== 'question') return

    const currentQuestionId = room.questions[room.currentQuestionIndex].id
    const answeredCount = players.filter((p) => p.answers[currentQuestionId]).length

    if (players.length > 0 && answeredCount === players.length) {
      // Small delay to let the last animation finish/user see they clicked
      const timer = setTimeout(() => {
        handleShowResults()
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [players, room?.currentQuestionState, room?.currentQuestionIndex])

  const handleNextQuestion = async () => {
    if (!roomId || !room) return
    const nextIndex = room.currentQuestionIndex + 1
    if (nextIndex < room.questions.length) {
      await QuizService.nextQuestion(roomId, nextIndex)
    } else {
      await QuizService.updateRoomStatus(roomId, 'finished')
    }
  }

  if (!room)
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    )

  const currentQuestion = room.questions[room.currentQuestionIndex]
  const isResultState = room.currentQuestionState === 'result'
  const timeLimit = currentQuestion?.timeLimit || 20
  const progress = (timeLeft / timeLimit) * 100
  const circumference = 2 * Math.PI * 24 // r=24
  const strokeDashoffset = circumference - (progress / 100) * circumference

  if (room.status === 'finished') {
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score)
    const top3 = sortedPlayers.slice(0, 3)
    // Reorder for podium: 2nd, 1st, 3rd
    const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean)

    return (
      <PageWrapper>
        <Container $maxWidth="md">
          <Card $padding="lg">
            <Box $mb="lg" $display="flex" $justify="center" $direction="column" $align="center">
              <Trophy size={64} color="#FFD700" style={{ marginBottom: '1rem' }} />
              <Typography as="h1" $size="3xl" $weight="bold">
                Game Over!
              </Typography>
            </Box>

            <PodiumContainer>
              <AnimatePresence>
                {podiumOrder.map((player, index) => {
                  // Adjust index logic because we reordered:
                  // If 3 players: index 0 is rank 2, index 1 is rank 1, index 2 is rank 3
                  let rank = 0
                  let height = '0px'
                  let color = '#ccc'

                  if (top3.length === 1) {
                    rank = 1
                    height = '200px'
                    color = '#fbbf24' // Gold
                  } else if (top3.length === 2) {
                    if (index === 0) {
                      rank = 2
                      height = '140px'
                      color = '#9ca3af'
                    } // Silver
                    if (index === 1) {
                      rank = 1
                      height = '200px'
                      color = '#fbbf24'
                    } // Gold
                  } else {
                    if (index === 0) {
                      rank = 2
                      height = '140px'
                      color = '#9ca3af'
                    } // Silver
                    if (index === 1) {
                      rank = 1
                      height = '200px'
                      color = '#fbbf24'
                    } // Gold
                    if (index === 2) {
                      rank = 3
                      height = '100px'
                      color = '#b45309'
                    } // Bronze
                  }

                  if (!player) return null

                  return (
                    <PodiumStep
                      key={player.id}
                      $rank={rank}
                      $height={height}
                      $color={color}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height, opacity: 1 }}
                      transition={{ delay: 0.2 + index * 0.1, type: 'spring' }}
                    >
                      <AvatarCircle>
                        {rank === 1 && (
                          <Crown size={24} color="#fbbf24" style={{ position: 'absolute', top: '-30px' }} />
                        )}
                        {player.nickname.substring(0, 2).toUpperCase()}
                      </AvatarCircle>
                      <RankBadge>#{rank}</RankBadge>
                      <Typography $weight="bold" $size="lg" style={{ marginTop: '0.5rem' }}>
                        {player.nickname}
                      </Typography>
                      <Typography $size="sm" style={{ opacity: 0.9 }}>
                        {player.score} pts
                      </Typography>
                    </PodiumStep>
                  )
                })}
              </AnimatePresence>
            </PodiumContainer>

            <Box $mt="xl">
              <Typography as="h2" $size="xl" $align="center" $weight="bold" style={{ marginBottom: '1rem' }}>
                Full Leaderboard
              </Typography>
              {sortedPlayers.slice(3).map((player, index) => (
                <Box
                  key={player.id}
                  $display="flex"
                  $justify="space-between"
                  $mb="sm"
                  style={{ padding: '1rem', background: '#f3f4f6', borderRadius: '8px' }}
                >
                  <Typography $weight="bold">
                    #{index + 4} {player.nickname}
                  </Typography>
                  <Typography $weight="bold">{player.score} pts</Typography>
                </Box>
              ))}
            </Box>
          </Card>
        </Container>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <Container $maxWidth="lg">
        <Box $display="flex" $justify="space-between" $align="center" $mb="lg">
          <Box>
            <Typography $size="xl" $weight="bold" $color="white">
              Question {room.currentQuestionIndex + 1} / {room.questions.length}
            </Typography>
          </Box>

          <Box
            style={{
              position: 'relative',
              width: '60px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TimerCircle viewBox="0 0 60 60">
              <TimerCircleBackground cx="30" cy="30" r="24" />
              <TimerCircleProgress
                cx="30"
                cy="30"
                r="24"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </TimerCircle>
            <Typography $weight="bold" $color="white" style={{ position: 'absolute', fontSize: '1.2rem' }}>
              {Math.ceil(timeLeft)}
            </Typography>
          </Box>

          <Box>
            <Typography $color="white" $weight="medium">
              {players.length} Players
            </Typography>
            <Typography $color="white" $size="sm" $align="center" style={{ opacity: 0.8 }}>
              {players.filter((p) => p.answers[currentQuestion.id]).length} Answered
            </Typography>
          </Box>
        </Box>

        <AnimatePresence mode="wait">
          <motion.div
            key={isResultState ? 'result' : 'question'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {isResultState ? (
              <Box>
                <Box $mb="xl" $display="flex" $justify="center">
                  <Typography as="h2" $size="3xl" $weight="bold" $color="white">
                    Round Results
                  </Typography>
                </Box>

                <Grid $gap="lg" $columns="1fr 1fr">
                  <Box>
                    <Typography $size="xl" $weight="bold" $color="white" style={{ marginBottom: '1rem' }}>
                      Correct Answer
                    </Typography>
                    {currentQuestion.options.map(
                      (opt, idx) =>
                        opt.isCorrect && (
                          <OptionCard key={idx} $isCorrect={true} $showResult={true}>
                            {opt.text}
                          </OptionCard>
                        )
                    )}
                  </Box>
                  <Box>
                    <Typography $size="xl" $weight="bold" $color="white" style={{ marginBottom: '1rem' }}>
                      Top Players
                    </Typography>
                    {players
                      .sort((a, b) => b.score - a.score)
                      .slice(0, 3)
                      .map((player, index) => (
                        <motion.div
                          key={player.id}
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '1rem',
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            marginBottom: '0.5rem',
                            color: 'white',
                            fontWeight: 'bold',
                          }}
                        >
                          <Box $display="flex" $align="center" $gap="md">
                            <span>#{index + 1}</span>
                            <span>{player.nickname}</span>
                          </Box>
                          <span>{player.score}</span>
                        </motion.div>
                      ))}
                  </Box>
                </Grid>

                <Box $mt="xl" $display="flex" $justify="center">
                  <Button $variant="primary" onClick={handleNextQuestion} $size="lg">
                    <SkipForward size={20} style={{ marginRight: '8px' }} />
                    Next Question
                  </Button>
                </Box>
              </Box>
            ) : (
              <>
                <Box $mb="xl">
                  <QuestionCard $padding="lg">
                    <Typography as="h2" $size="3xl" $weight="bold">
                      {currentQuestion?.text}
                    </Typography>
                  </QuestionCard>
                </Box>

                <Grid $gap="lg" $columns="1fr 1fr">
                  {currentQuestion?.options.map((option, index) => (
                    <OptionCard
                      key={index}
                      $color={COLORS[index % COLORS.length]}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Typography $size="xl">{option.text}</Typography>
                    </OptionCard>
                  ))}
                </Grid>

                <Box $mt="xl" $display="flex" $justify="center">
                  <Button $variant="secondary" onClick={handleShowResults} $size="lg">
                    <BarChart2 size={20} style={{ marginRight: '8px' }} />
                    Show Results Early
                  </Button>
                </Box>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </Container>
    </PageWrapper>
  )
}
