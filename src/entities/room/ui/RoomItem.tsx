import { Box, Card, Typography } from 'shared/ui'
import Button from 'shared/ui/Button'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'

interface RoomItemProps {
  id: string
  title: string
  description: string
  onAdd: (id: string) => void
  onRemove: (id: string) => void
}

const RoomItem = ({ id, title, description, onAdd, onRemove }: RoomItemProps) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true)
    }, 100)
  }, [])

  return (
    <AnimatePresence initial={false}>
      {isVisible && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.06 }}
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
                <Button
                  $variant="info"
                  onClick={() => {
                    onAdd(id)
                  }}
                >
                  <Typography $color="white" $size="sm">
                    Add
                  </Typography>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 1 }}>
                <Button
                  $variant="danger"
                  onClick={() => {
                    setIsVisible(false)
                    setTimeout(() => {
                      onRemove(id)
                    }, 500)
                  }}
                >
                  <Typography $color="white" $size="sm">
                    Remove
                  </Typography>
                </Button>
              </motion.div>
            </Box>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default RoomItem
