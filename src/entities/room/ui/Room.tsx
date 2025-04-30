import { Box, Card, Typography } from 'shared/ui'
import Button from 'shared/ui/Button'
import * as motion from 'motion/react-client'

interface RoomProps {
  id: number
  title: string
  description: string
  onAdd: (id: number) => void
  onRemove: (id: number) => void
}

const Room = ({ id, title, description, onAdd, onRemove }: RoomProps) => {
  return (
    <motion.div whileHover={{ scale: 1.06 }}>
      <Card
        $pointer
        $flex
        $direction="column"
        $justify="space-between"
        $align="center"
        $p="lg"
        $shadow="md"
        $radius="lg"
        $gap="lg"
        $bg="secondary"
      >
        <Box $flex $direction="column" $align="center" $gap="sm">
          <Typography $size="lg">{title}</Typography>
          <Typography $color="grey" $size="sm">
            {description}
          </Typography>
        </Box>
        <Box $flex $justify="flex-start" $gap="lg">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 1 }}>
            <Button $variant="info" onClick={() => onAdd(id)}>
              <Typography $color="white" $size="sm">
                Add
              </Typography>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 1 }}>
            <Button $variant="danger" onClick={() => onRemove(id)}>
              <Typography $color="white" $size="sm">
                Remove
              </Typography>
            </Button>
          </motion.div>
        </Box>
      </Card>
    </motion.div>
  )
}

export default Room
