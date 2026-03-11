import { Box, Card, Typography } from 'shared/ui'
import { Users } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { QuizPlayer } from 'features/quiz'
import { cva } from 'class-variance-authority'

interface PlayerGridProps {
  players: QuizPlayer[]
}

const playerGridContainerVariants = cva('grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4')

const playerCardVariants = cva(
  'flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm'
)

const avatarVariants = cva(
  'w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm'
)

export const PlayerGrid = ({ players }: PlayerGridProps) => {
  return (
    <Box style={{ minHeight: '400px' }}>
      <Card padding="lg">
        <div className="flex justify-between items-center mb-6">
          <Typography size="xl" weight="bold">
            Players ({players.length})
          </Typography>
          <Users size={24} className="text-gray-500" />
        </div>

        {players.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-[300px] gap-4">
            <Users size={64} className="text-gray-200" />
            <Typography color="secondary" size="lg" className="animate-pulse">
              Waiting for players...
            </Typography>
          </div>
        ) : (
          <div className={playerGridContainerVariants()}>
            <AnimatePresence>
              {players.map((player) => (
                <motion.div
                  key={player.id}
                  className={playerCardVariants()}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  layout
                >
                  <div className={avatarVariants()}>{player.nickname.substring(0, 2).toUpperCase()}</div>
                  <Typography size="sm" className="truncate">
                    {player.nickname}
                  </Typography>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </Card>
    </Box>
  )
}
