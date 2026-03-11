import { Box, Typography, Button } from 'shared/ui'
import { Play } from 'lucide-react'

interface LobbyHeaderProps {
  onStartGame: () => void
  hasPlayers: boolean
}

export const LobbyHeader = ({ onStartGame, hasPlayers }: LobbyHeaderProps) => {
  return (
    <Box display="flex" justify="space-between" align="center" mb="xl">
      <Box>
        <Typography size="4xl" weight="bold" color="white">
          Quiz Lobby
        </Typography>
        <Typography color="white" style={{ opacity: 0.8 }}>
          Waiting for players to join...
        </Typography>
      </Box>
      <Button
        variant="secondary"
        onClick={onStartGame}
        disabled={!hasPlayers}
        size="lg"
        style={{ paddingLeft: '2rem', paddingRight: '2rem' }}
      >
        <Play size={24} style={{ marginRight: '8px' }} />
        Start Game
      </Button>
    </Box>
  )
}
