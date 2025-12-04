import { useState, useEffect } from 'react'
import { QuizService } from '../services/quizService'
import { QuizPlayer } from '../models/types'

export const useQuizPlayer = (roomId: string | undefined, playerId: string | null) => {
  const [player, setPlayer] = useState<QuizPlayer | null>(null)

  useEffect(() => {
    if (!roomId || !playerId) return

    const unsubscribe = QuizService.subscribeToPlayer(roomId, playerId, (playerData) => {
      setPlayer(playerData)
    })

    return () => unsubscribe()
  }, [roomId, playerId])

  return { player }
}
