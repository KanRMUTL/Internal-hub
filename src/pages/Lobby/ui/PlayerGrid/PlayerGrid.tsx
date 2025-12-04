import { Box, Card, Typography } from 'shared/ui'
import { Users } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import { PlayerGridContainer, PlayerCard, Avatar, WaitingText } from './styled'
import { QuizPlayer } from 'features/quiz'

interface PlayerGridProps {
  players: QuizPlayer[]
}

export const PlayerGrid = ({ players }: PlayerGridProps) => {
  return (
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
          <PlayerGridContainer>
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
          </PlayerGridContainer>
        )}
      </Card>
    </Box>
  )
}
