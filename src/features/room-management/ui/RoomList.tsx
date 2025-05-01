import { motion } from 'motion/react'
import { removeRoom } from 'features/room-management/services'
import { useActiveRooms } from 'features/room-management/hooks'
import { RoomItem } from 'entities/room'
import { Box, Button, Spinner } from 'shared/ui'
import Alert from 'shared/ui/Alert/Alert'

const RoomList = () => {
  const { data: rooms, loading, error } = useActiveRooms()

  if (loading)
    return (
      <Box $flex $justify="center" $align="center" $gap="xl" $p="lg">
        <Spinner label="Loading rooms..." />
      </Box>
    )
  if (error)
    return (
      <Box $flex $justify="center" $align="center" $gap="xl" $p="lg">
        <Alert $type="danger">Failed to load rooms</Alert>
      </Box>
    )

  return (
    <Box $flex $justify="center" $align="center" $gap="xl" $p="lg">
      {rooms.map((room) => (
        <RoomItem
          key={room.id}
          id={room.id}
          title={room.name}
          description="This is some description."
          onAdd={(id) => {
            // show modal contain input form to add new member inside the room
          }}
          onRemove={(id) => {
            removeRoom(id)
          }}
        />
      ))}
      <Box>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 1 }}>
          <Button
            $variant="info"
            onClick={() => {
              // show modal contain input form to add new room
            }}
          >
            + new room
          </Button>
        </motion.div>
      </Box>
    </Box>
  )
}

export default RoomList
