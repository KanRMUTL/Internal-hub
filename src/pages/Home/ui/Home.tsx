import { motion } from 'motion/react'
import { Room } from 'entities/room'
import { Box, Button } from 'shared/ui'

const Home = () => {
  return (
    <Box $flex $justify="center" $align="center" $gap="xl" $p="lg">
      <Room
        id={1}
        title="Title"
        description="This is some description."
        onAdd={(id) => {
          console.log(id)
        }}
        onRemove={(id) => {
          console.log(id)
        }}
      />
      <Box>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 1 }}>
          <Button $variant="info" onClick={() => {}}>
            + new room
          </Button>
        </motion.div>
      </Box>
    </Box>
  )
}

export default Home
