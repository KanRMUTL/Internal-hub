import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { QuizService, useQuizRoom, useQuizPlayer, useQuizPlayers } from 'features/quiz'

export const usePlayerGame = () => {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate = useNavigate()
  const playerId = localStorage.getItem(`quiz_player_${roomId}`)

  const { room } = useQuizRoom(roomId)
  const { player } = useQuizPlayer(roomId, playerId)
  const { players: allPlayers } = useQuizPlayers(roomId)

  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [hasAnswered, setHasAnswered] = useState(false)
  const prevQuestionIndex = useRef<number | null>(null)

  useEffect(() => {
    if (!playerId) {
      navigate('/quiz/join')
    }
  }, [playerId, navigate])

  useEffect(() => {
    if (room) {
      if (room.currentQuestionState === 'question' && room.currentQuestionIndex !== prevQuestionIndex.current) {
        setSelectedOption(null)
        setHasAnswered(false)
        prevQuestionIndex.current = room.currentQuestionIndex
      }
    }
  }, [room?.currentQuestionIndex, room?.currentQuestionState])

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

  return {
    room,
    player,
    allPlayers,
    selectedOption,
    hasAnswered,
    handleAnswer,
    playerId,
  }
}
