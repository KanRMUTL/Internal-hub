import { motion } from 'motion/react'
import { Box, Card, Typography } from 'shared/ui'
import Button from 'shared/ui/Button'

interface RoomItemProps {
  id: string
  title: string
  description: string
  onClick: (id: string) => void
  onClickAdd: (id: string, name: string) => void
  onClickRemove: (id: string) => void
}

const RoomItem = ({ id, title, description, onClick, onClickAdd, onClickRemove }: RoomItemProps) => {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.01 }}
      whileHover={{ scale: 1.08 }}
      exit={{ opacity: 0, scale: 0 }}
    >
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
        style={{ cursor: 'pointer' }}
        onClick={() => onClick(id)}
      >
        <Box $flex $direction="column" $align="center" $gap="sm" $p="md">
          <Typography $size="xl" $weight="semibold" $pointer>
            {title}
          </Typography>
          <Typography $color="grey" $size="sm" $pointer>
            {description}
          </Typography>
        </Box>
        <Box $flex $justify="flex-start" $gap="lg">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.8 }}>
            <Button
              $variant="info"
              onClick={(e) => {
                e.stopPropagation()
                onClickAdd(id, title)
              }}
            >
              <Typography $color="white" $size="sm" $pointer>
                Add Item
              </Typography>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.8 }}>
            <Button
              $variant="danger"
              onClick={(e) => {
                e.stopPropagation()
                onClickRemove(id)
              }}
            >
              <Typography $color="white" $size="sm" $pointer>
                Remove
              </Typography>
            </Button>
          </motion.div>
        </Box>
      </Card>
    </motion.div>
  )
}

export default RoomItem
