import { Container, Typography, Grid, Box } from 'shared/ui'
import { useLobby } from '../../hooks/useLobby'
import { LobbyHeader } from '../LobbyHeader'
import { PlayerGrid } from '../PlayerGrid'
import { QRCodeCard } from '../QRCodeCard/QRCodeCard'

const PageWrapper = (props: any) => <Box bg="surfaceLight" {...props} />

export const Lobby = () => {
  const { room, players, isLoading, handleStartGame, copyLink } = useLobby()

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
      <Container maxWidth="lg">
        <LobbyHeader onStartGame={handleStartGame} hasPlayers={players.length > 0} />

        <Grid gap="lg" columns="1fr 350px">
          <PlayerGrid players={players} />
          <QRCodeCard roomPassword={room.password} onCopyLink={copyLink} />
        </Grid>
      </Container>
    </PageWrapper>
  )
}
