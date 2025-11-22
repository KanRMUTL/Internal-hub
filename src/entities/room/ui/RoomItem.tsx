import { Box, Card, Typography, Button, MotionDiv } from 'shared/ui'
import { UserPlus, Trash2, ArrowRight } from 'lucide-react'
import { createPerformantMotionProps, createInteractionProps } from 'shared/styles/utils'

interface RoomItemProps {
  id: string
  title: string
  description: string
  onClick: (id: string) => void
  onClickAdd: (id: string, name: string) => void
  onClickRemove: (id: string) => void
}

const RoomItem = ({ id, title, description, onClick, onClickAdd, onClickRemove }: RoomItemProps) => {
  const motionProps = createPerformantMotionProps({
    initial: { scale: 0.95, opacity: 0, y: 20 },
    animate: { scale: 1, opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: -10 },
    transition: { duration: 0.25, ease: [0.4, 0.0, 0.2, 1], delay: 0.05 },
  })

  const buttonInteractionProps = createInteractionProps({
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
  })

  return (
    <MotionDiv {...motionProps}>
      <Card $interactive $padding="lg" $shadow="md" $rounded="lg" onClick={() => onClick(id)}>
        <Box $flex $direction="column" $justify="space-between" $gap="lg" $minHeight="200px" $touchTargets>
          {/* Header section with better visual hierarchy */}
          <Box $flex $direction="column" $gap="sm" $p="sm">
            <Box $flex $align="center" $justify="space-between">
              <Typography $size="xl" $weight="semibold" $pointer>
                {title}
              </Typography>
              <ArrowRight size={20} color="currentColor" opacity={0.6} />
            </Box>

            <Typography
              $color="disabled"
              $size="sm"
              $pointer
              style={{
                lineHeight: '1.5',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {description || 'No description'}
            </Typography>
          </Box>

          {/* Action buttons with improved responsive styling */}
          <Box
            $flex
            $direction="row"
            $tabletDirection="row"
            $justify="space-between"
            $gap="sm"
            $pt="sm"
            style={{
              borderTop: '1px solid var(--border-color, #e5e7eb)',
            }}
          >
            <MotionDiv {...buttonInteractionProps} style={{ flex: 1 }}>
              <Button
                $variant="info"
                $size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onClickAdd(id, title)
                }}
                style={{
                  width: '100%',
                  minHeight: '44px', // Ensure touch-friendly size
                }}
              >
                <Box $flex $align="center" $justify="center" $gap="xs">
                  <UserPlus size={16} />
                  <Typography $color="white" $size="sm">
                    Add Member
                  </Typography>
                </Box>
              </Button>
            </MotionDiv>

            <MotionDiv {...buttonInteractionProps}>
              <Button
                $variant="danger"
                $size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onClickRemove(id)
                }}
                style={{
                  minWidth: '44px',
                  minHeight: '44px', // Ensure touch-friendly size
                  padding: '8px',
                }}
              >
                <Trash2 size={16} />
              </Button>
            </MotionDiv>
          </Box>
        </Box>
      </Card>
    </MotionDiv>
  )
}

export default RoomItem
