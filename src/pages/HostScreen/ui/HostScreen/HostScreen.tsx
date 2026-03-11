import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { QuizService, QuizRoom, QuizPlayer } from 'features/quiz'
import { Container, Typography, Box, Card, Button, Grid } from 'shared/ui'
import { SkipForward, BarChart2, Trophy, Crown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva } from 'class-variance-authority'
import { cn } from 'shared/lib/utils'

const COLORS = ['#ef4444', '#3b82f6', '#eab308', '#22c55e']

const pageWrapperVariants = cva('min-h-screen bg-primary text-white py-8 overflow-x-hidden')

const questionCardVariants = cva(
  'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-center min-h-[300px] flex flex-col justify-center shadow-xl p-8 rounded-lg'
)

const optionCardVariants = cva(
  'p-8 text-center font-bold text-2xl rounded-2xl transition-all duration-200 border-none',
  {
    variants: {
      showResult: {
        true: '',
        false: 'bg-white text-gray-900 shadow-md',
      },
      isCorrect: {
        true: 'bg-success text-white border-4 border-success',
        false: '',
      },
    },
    compoundVariants: [
      {
        showResult: true,
        isCorrect: false,
        className: 'bg-gray-200 text-gray-900 opacity-40 shadow-none',
      },
    ],
  }
)

const podiumContainerVariants = cva('flex items-end justify-center gap-4 h-[300px] mb-8')

const podiumStepVariants = cva(
  'w-[100px] rounded-t-xl flex flex-col items-center justify-start pt-4 text-white shadow-lg relative'
)

const avatarCircleVariants = cva(
  'w-[60px] h-[60px] rounded-full bg-white text-gray-800 flex items-center justify-center font-bold text-2xl mb-2 border-4 border-white/30 absolute top-[-30px]'
)

const rankBadgeVariants = cva('bg-black/20 px-3 py-1 rounded-xl text-sm font-bold mt-8')

export const HostScreen = () => {
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

  useEffect(() => {
    if (!room || room.currentQuestionState !== 'question') return

    const currentQuestionId = room.questions[room.currentQuestionIndex].id
    const answeredCount = players.filter((p) => p.answers[currentQuestionId]).length

    if (players.length > 0 && answeredCount === players.length) {
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
  const circumference = 2 * Math.PI * 24
  const strokeDashoffset = circumference - (progress / 100) * circumference

  if (room.status === 'finished') {
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score)
    const top3 = sortedPlayers.slice(0, 3)
    const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean)

    return (
      <div className={pageWrapperVariants()}>
        <Container $maxWidth="md">
          <Card $padding="lg">
            <div className="mb-8 flex flex-col items-center">
              <Trophy size={64} className="text-yellow-400 mb-4" />
              <Typography as="h1" $size="3xl" $weight="bold">
                Game Over!
              </Typography>
            </div>

            <div className={podiumContainerVariants()}>
              <AnimatePresence>
                {podiumOrder.map((player, index) => {
                  let rank = 0
                  let height = '0px'
                  let color = '#ccc'

                  if (top3.length === 1) {
                    rank = 1
                    height = '200px'
                    color = '#fbbf24'
                  } else if (top3.length === 2) {
                    if (index === 0) {
                      rank = 2
                      height = '140px'
                      color = '#9ca3af'
                    }
                    if (index === 1) {
                      rank = 1
                      height = '200px'
                      color = '#fbbf24'
                    }
                  } else {
                    if (index === 0) {
                      rank = 2
                      height = '140px'
                      color = '#9ca3af'
                    }
                    if (index === 1) {
                      rank = 1
                      height = '200px'
                      color = '#fbbf24'
                    }
                    if (index === 2) {
                      rank = 3
                      height = '100px'
                      color = '#b45309'
                    }
                  }

                  if (!player) return null

                  return (
                    <motion.div
                      key={player.id}
                      className={podiumStepVariants()}
                      style={{ backgroundColor: color }}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height, opacity: 1 }}
                      transition={{ delay: 0.2 + index * 0.1, type: 'spring' }}
                    >
                      <div className={avatarCircleVariants()}>
                        {rank === 1 && <Crown size={24} className="text-yellow-400 absolute top-[-30px]" />}
                        {player.nickname.substring(0, 2).toUpperCase()}
                      </div>
                      <div className={rankBadgeVariants()}>#{rank}</div>
                      <Typography $weight="bold" $size="lg" className="mt-2">
                        {player.nickname}
                      </Typography>
                      <Typography $size="sm" className="opacity-90">
                        {player.score} pts
                      </Typography>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            <div className="mt-12">
              <Typography as="h2" $size="xl" $align="center" $weight="bold" className="mb-4">
                Full Leaderboard
              </Typography>
              {sortedPlayers.slice(3).map((player, index) => (
                <div key={player.id} className="flex justify-between p-4 bg-gray-100 dark:bg-gray-700 rounded-lg mb-2">
                  <Typography $weight="bold">
                    #{index + 4} {player.nickname}
                  </Typography>
                  <Typography $weight="bold">{player.score} pts</Typography>
                </div>
              ))}
            </div>
          </Card>
        </Container>
      </div>
    )
  }

  return (
    <div className={pageWrapperVariants()}>
      <Container $maxWidth="lg">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Typography $size="xl" $weight="bold" $color="white">
              Question {room.currentQuestionIndex + 1} / {room.questions.length}
            </Typography>
          </div>

          <div className="relative w-[60px] h-[60px] flex items-center justify-center">
            <svg className="transform rotate-[-90deg] w-[60px] h-[60px]" viewBox="0 0 60 60">
              <circle className="fill-none stroke-gray-200 stroke-[6]" cx="30" cy="30" r="24" />
              <motion.circle
                className="fill-none stroke-amber-500 stroke-[6] stroke-linecap-round"
                cx="30"
                cy="30"
                r="24"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <Typography $weight="bold" $color="white" className="absolute text-[1.2rem]">
              {Math.ceil(timeLeft)}
            </Typography>
          </div>

          <div className="text-right">
            <Typography $color="white" $weight="medium">
              {players.length} Players
            </Typography>
            <Typography $color="white" $size="sm" $align="center" className="opacity-80">
              {players.filter((p) => p.answers[currentQuestion.id]).length} Answered
            </Typography>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={isResultState ? 'result' : 'question'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {isResultState ? (
              <div>
                <div className="mb-12 flex justify-center">
                  <Typography as="h2" $size="3xl" $weight="bold" $color="white">
                    Round Results
                  </Typography>
                </div>

                <Grid $gap="lg" $columns="1fr 1fr">
                  <Box>
                    <Typography $size="xl" $weight="bold" $color="white" className="mb-4">
                      Correct Answer
                    </Typography>
                    {currentQuestion.options.map(
                      (opt, idx) =>
                        opt.isCorrect && (
                          <div key={idx} className={optionCardVariants({ showResult: true, isCorrect: true })}>
                            {opt.text}
                          </div>
                        )
                    )}
                  </Box>
                  <Box>
                    <Typography $size="xl" $weight="bold" $color="white" className="mb-4">
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
                          className="flex justify-between p-4 bg-white/10 rounded-lg mb-2 text-white font-bold"
                        >
                          <div className="flex items-center gap-4">
                            <span>#{index + 1}</span>
                            <span>{player.nickname}</span>
                          </div>
                          <span>{player.score}</span>
                        </motion.div>
                      ))}
                  </Box>
                </Grid>

                <div className="mt-12 flex justify-center">
                  <Button $variant="primary" onClick={handleNextQuestion} $size="lg">
                    <SkipForward size={20} className="mr-2" />
                    Next Question
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-12">
                  <div className={questionCardVariants()}>
                    <Typography as="h2" $size="3xl" $weight="bold">
                      {currentQuestion?.text}
                    </Typography>
                  </div>
                </div>

                <Grid $gap="lg" $columns="1fr 1fr">
                  {currentQuestion?.options.map((option, index) => (
                    <motion.div
                      key={index}
                      className={cn(optionCardVariants({ showResult: false }), 'border-l-[8px]')}
                      style={{ borderLeftColor: COLORS[index % COLORS.length] }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Typography $size="xl">{option.text}</Typography>
                    </motion.div>
                  ))}
                </Grid>

                <div className="mt-12 flex justify-center">
                  <Button $variant="secondary" onClick={handleShowResults} $size="lg">
                    <BarChart2 size={20} className="mr-2" />
                    Show Results Early
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </Container>
    </div>
  )
}
