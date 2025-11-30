import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { QuizService } from 'features/quiz'
import { Container, Typography, Box, Card, Button, Input } from 'shared/ui'
import styled from 'styled-components'
import { LogIn } from 'lucide-react'

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 1rem;
`

const JoinCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  background: white;
`

interface JoinForm {
  pin: string
  nickname: string
}

export const JoinQuizeGame = () => {
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

  return (
    <PageWrapper>
      <Container $maxWidth="sm">
        <Box $display="flex" $justify="center" $mb="xl">
          <Typography as="h1" $size="3xl" $weight="bold" $color="white">
            Quiz Game
          </Typography>
        </Box>

        <JoinCard $padding="lg" $rounded="xl" $shadow="lg">
          <Box $mb="lg" $display="flex" $justify="center">
            <Typography as="h2" $size="xl" $weight="bold">
              Join the Fun!
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box $mb="md">
              <Input
                label="Room PIN"
                placeholder="Enter 4-digit PIN"
                {...register('pin', { required: 'Room PIN is required' })}
                error={errors.pin?.message}
                $variant="filled"
              />
            </Box>

            <Box $mb="xl">
              <Input
                label="Nickname"
                placeholder="Enter your nickname"
                {...register('nickname', { required: 'Nickname is required', maxLength: 15 })}
                error={errors.nickname?.message}
                $variant="filled"
              />
            </Box>

            {error && (
              <Box $mb="md">
                <Typography $color="danger" $size="sm" $align="center">
                  {error}
                </Typography>
              </Box>
            )}

            <Button type="submit" $fullWidth $size="lg" disabled={isLoading}>
              {isLoading ? 'Joining...' : 'Join Game'}
              {!isLoading && <LogIn size={20} style={{ marginLeft: '8px' }} />}
            </Button>
          </form>
        </JoinCard>
      </Container>
    </PageWrapper>
  )
}
