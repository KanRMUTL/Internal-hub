import { useState, useEffect } from 'react'
import { QuizRoom } from '../models/types'

export const useQuizGameTimer = (room: QuizRoom | null) => {
  const [timeLeft, setTimeLeft] = useState(0)

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

  return timeLeft
}
