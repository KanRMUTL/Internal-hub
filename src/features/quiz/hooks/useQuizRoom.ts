import { useState, useEffect } from 'react'
import { QuizService } from '../services/quizService'
import { QuizRoom } from '../models/types'

export const useQuizRoom = (roomId: string | undefined) => {
  const [room, setRoom] = useState<QuizRoom | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!roomId) {
      setIsLoading(false)
      return
    }

    const unsubscribe = QuizService.subscribeToRoom(roomId, (roomData) => {
      setRoom(roomData)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [roomId])

  return { room, isLoading }
}
