import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { QuizService, useQuizRoom, useQuizPlayers } from 'features/quiz'

export const useLobby = () => {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate = useNavigate()

  const { room, isLoading: isRoomLoading } = useQuizRoom(roomId)
  const { players } = useQuizPlayers(roomId)

  useEffect(() => {
    if (room?.status === 'playing' && roomId) {
      navigate(`/quiz/host/${roomId}/game`)
    }
  }, [room?.status, roomId, navigate])

  const handleStartGame = async () => {
    if (!roomId) return
    await QuizService.updateRoomStatus(roomId, 'playing')
  }

  const copyLink = () => {
    const url = `${window.location.origin}/quiz/join?room=${roomId}`
    navigator.clipboard.writeText(url)
    alert('Link copied!')
  }

  return {
    room,
    players,
    isLoading: isRoomLoading,
    handleStartGame,
    copyLink,
    roomId,
  }
}
