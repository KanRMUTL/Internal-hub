import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { QuizService } from '../api/quiz-service'
import { QuizPlayer, QuizRoom } from '../models/types'
import { Container, Typography, Box, Card, Button, Grid } from 'shared/ui'
import { Users, Play, Copy, QrCode } from 'lucide-react'
import styled, { keyframes } from 'styled-components'
import { motion, AnimatePresence } from 'motion/react'

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 2rem 0;
`

const LobbyCard = styled(Card)`
  background: white;
  color: ${({ theme }) => theme.text};
  text-align: center;
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 8px 10px -6px rgba(0, 0, 0, 0.1);
`

const PinDisplay = styled.div`
  background: #f3f4f6;
  padding: 1.5rem;
  border-radius: 12px;
  margin: 1rem 0;
  border: 2px dashed #d1d5db;
`

const PlayerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
`

const PlayerCard = styled(motion.div)`
  background: white;
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
  font-weight: bold;
  color: #1f2937;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: bold;
`

const Pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`

const WaitingText = styled(Typography)`
  animation: ${Pulse} 2s infinite ease-in-out;
`

export const HostLobbyPage = () => {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate = useNavigate()
  const [room, setRoom] = useState<QuizRoom | null>(null)
  const [players, setPlayers] = useState<QuizPlayer[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!roomId) return

    const unsubscribeRoom = QuizService.subscribeToRoom(roomId, (roomData) => {
      setRoom(roomData)
      setIsLoading(false)
      if (roomData?.status === 'playing') {
        navigate(`/quiz/host/${roomId}/game`)
      }
    })

    const unsubscribePlayers = QuizService.subscribeToPlayers(roomId, (playersData) => {
      setPlayers(playersData)
    })

    return () => {
      unsubscribeRoom()
      unsubscribePlayers()
    }
  }, [roomId])

  const handleStartGame = async () => {
    if (!roomId) return
    await QuizService.updateRoomStatus(roomId, 'playing')
  }

  const copyLink = () => {
    const url = `${window.location.origin}/quiz/join?room=${roomId}`
    navigator.clipboard.writeText(url)
    // Could add a toast here
    alert('Link copied!')
  }

  if (isLoading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    )
  }

  if (!room) {
    return (
      <Container>
        <Typography>Room not found</Typography>
      </Container>
    )
  }

  return (
    <PageWrapper>
      <Container $maxWidth="lg">
        <Box $display="flex" $justify="space-between" $align="center" $mb="xl">
          <Box>
            <Typography as="h1" $size="3xl" $weight="bold" $color="white">
              Quiz Lobby
            </Typography>
            <Typography $color="white" style={{ opacity: 0.8 }}>
              Waiting for players to join...
            </Typography>
          </Box>
          <Button
            $variant="secondary"
            onClick={handleStartGame}
            disabled={players.length === 0}
            $size="lg"
            style={{ paddingLeft: '2rem', paddingRight: '2rem' }}
          >
            <Play size={24} style={{ marginRight: '8px' }} />
            Start Game
          </Button>
        </Box>

        <Grid $gap="lg" $columns="1fr 350px">
          <Box>
            <Box style={{ minHeight: '400px' }}>
              <Card $padding="lg">
                <Box $display="flex" $justify="space-between" $align="center" $mb="lg">
                  <Typography as="h2" $size="xl" $weight="bold">
                    Players ({players.length})
                  </Typography>
                  <Users size={24} color="#6b7280" />
                </Box>

                {players.length === 0 ? (
                  <Box
                    $display="flex"
                    $justify="center"
                    $align="center"
                    style={{ height: '300px', flexDirection: 'column', gap: '1rem' }}
                  >
                    <Users size={64} color="#e5e7eb" />
                    <WaitingText $color="secondary" $size="lg">
                      Waiting for players...
                    </WaitingText>
                  </Box>
                ) : (
                  <PlayerGrid>
                    <AnimatePresence>
                      {players.map((player) => (
                        <PlayerCard
                          key={player.id}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          layout
                        >
                          <Avatar>{player.nickname.substring(0, 2).toUpperCase()}</Avatar>
                          <Typography $size="sm">{player.nickname}</Typography>
                        </PlayerCard>
                      ))}
                    </AnimatePresence>
                  </PlayerGrid>
                )}
              </Card>
            </Box>
          </Box>

          <Box>
            <Box $mb="lg">
              <LobbyCard $padding="lg">
                <Box $mb="sm">
                  <Typography $size="sm" $color="secondary" $weight="bold">
                    JOIN AT
                  </Typography>
                  <Typography $size="lg" $weight="bold" $color="primary">
                    {window.location.host}/quiz/join
                  </Typography>
                </Box>

                <PinDisplay>
                  <Typography
                    $size="sm"
                    $color="secondary"
                    $weight="bold"
                    style={{ marginBottom: '0.5rem', display: 'block' }}
                  >
                    GAME PIN
                  </Typography>
                  <Typography
                    $size="3xl"
                    $weight="extrabold"
                    style={{ letterSpacing: '8px', fontFamily: 'monospace', fontSize: '3rem' }}
                  >
                    {room.password}
                  </Typography>
                </PinDisplay>

                <Button $variant="secondary" $fullWidth onClick={copyLink}>
                  <Copy size={16} style={{ marginRight: '8px' }} />
                  Copy Link
                </Button>
              </LobbyCard>
            </Box>

            <LobbyCard $padding="lg">
              <Box
                style={{
                  height: '200px',
                  backgroundColor: '#f9fafb',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                }}
              >
                <Box $display="flex" $direction="column" $align="center" $gap="sm">
                  <QrCode size={48} color="#9ca3af" />
                  <Typography $color="secondary" $size="sm">
                    QR Code Placeholder
                  </Typography>
                </Box>
              </Box>
              <Typography $size="sm" $color="secondary" $align="center">
                Scan to join directly
              </Typography>
            </LobbyCard>
          </Box>
        </Grid>
      </Container>
    </PageWrapper>
  )
}
