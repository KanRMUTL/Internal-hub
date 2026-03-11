import { Box, Card, Typography, MotionDiv, Button } from 'shared/ui'
import { Plus, PlusCircle } from 'lucide-react'
import { createPerformantMotionProps, createInteractionProps } from 'shared/styles/utils'

interface AddRoomCardProps {
  onClick: () => void
}

const AddRoomCard = ({ onClick }: AddRoomCardProps) => {
  const motionProps = createPerformantMotionProps({
    initial: { scale: 0.95, opacity: 0, y: 20 },
    animate: { scale: 1, opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: -10 },
    transition: { duration: 0.25, ease: [0.4, 0.0, 0.2, 1], delay: 0 },
  })

  const buttonInteractionProps = createInteractionProps({
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
  })

  return (
    <MotionDiv {...motionProps}>
      <Card interactive padding="lg" shadow="md" rounded="lg" onClick={onClick}>
        <Box flex direction="column" justify="space-between" gap="lg" minHeight="200px">
          {/* Header section matching RoomItem */}
          <Box flex direction="column" gap="sm" p="sm">
            <Box flex align="center" justify="space-between">
              <Typography size="xl" weight="semibold" color="info" pointer>
                Create Room
              </Typography>
              <PlusCircle size={24} color="#209cee" opacity={0.6} />
            </Box>

            <Typography color="muted" size="sm" pointer>
              Click to create a new room for your fortune wheel
            </Typography>
          </Box>

          {/* Action button matching RoomItem */}
          <Box
            flex
            direction="row"
            justify="center"
            gap="sm"
            pt="sm"
            style={{
              borderTop: '1px dashed var(--border-color, #e5e7eb)',
            }}
          >
            <MotionDiv {...buttonInteractionProps} style={{ flex: 1 }}>
              <Button
                variant="info"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onClick()
                }}
                style={{
                  width: '100%',
                  minHeight: '44px',
                }}
              >
                <Box flex align="center" justify="center" gap="xs">
                  <Plus size={16} />
                  <Typography color="white" size="sm">
                    Create Room
                  </Typography>
                </Box>
              </Button>
            </MotionDiv>
          </Box>
        </Box>
      </Card>
    </MotionDiv>
  )
}

export default AddRoomCard
