import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { QuizService } from 'features/quiz'

interface JoinForm {
  pin: string
  nickname: string
}

export const useJoinGame = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JoinForm>({
    defaultValues: {
      pin: searchParams.get('room') || '',
      nickname: '',
    },
  })

  const onSubmit = async (data: JoinForm) => {
    setIsLoading(true)
    setError(null)
    try {
      let roomId = searchParams.get('room')

      // If no room ID in URL, try to find by PIN
      if (!roomId) {
        roomId = await QuizService.findRoomByPin(data.pin)
        if (!roomId) {
          throw new Error('Room not found. Please check the PIN.')
        }
      }

      // Join the room
      const playerId = crypto.randomUUID() // Generate a client-side ID for the player
      await QuizService.joinRoom(roomId, {
        id: playerId,
        nickname: data.nickname,
      })

      // Save player ID to local storage for persistence
      localStorage.setItem(`quiz_player_${roomId}`, playerId)

      navigate(`/quiz/play/${roomId}`)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to join room. Please check the PIN and try again.')
      setIsLoading(false)
    }
  }

  return {
    register,
    errors,
    isLoading,
    error,
    submit: handleSubmit(onSubmit),
  }
}
