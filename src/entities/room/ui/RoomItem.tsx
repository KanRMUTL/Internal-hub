import { motion } from 'motion/react'
import { Box, Card, Typography } from 'shared/ui'
import Button from 'shared/ui/Button'

interface RoomItemProps {
  id: string
  title: string
  description: string
  onClickAdd: (id: string) => void
  onClickRemove: (id: string) => void
}

const RoomItem = ({ id, title, description, onClickAdd, onClickRemove }: RoomItemProps) => {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.01 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 1.08 }}
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
      >
        <Box $flex $direction="column" $align="center" $gap="sm">
          <Typography $size="lg">{title}</Typography>
          <Typography $color="grey" $size="sm">
            {description}
          </Typography>
        </Box>
        <Box $flex $justify="flex-start" $gap="lg">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 1 }}>
            <Button $variant="info" onClick={() => onClickAdd(id)}>
              <Typography $color="white" $size="sm">
                Add
              </Typography>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 1 }}>
            <Button $variant="danger" onClick={() => onClickRemove(id)}>
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

export default RoomItem
