import { useState, useEffect } from 'react'
import { QuizService } from '../services/quizService'
import { QuizPlayer } from '../models/types'

export const useQuizPlayers = (roomId: string | undefined) => {
  const [players, setPlayers] = useState<QuizPlayer[]>([])

  useEffect(() => {
    if (!roomId) return

    const unsubscribe = QuizService.subscribeToPlayers(roomId, (playersData) => {
      setPlayers(playersData)
    })

    return () => unsubscribe()
  }, [roomId])

  return { players }
}
