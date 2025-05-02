import { motion } from 'motion/react'
import dayjs from 'dayjs'
import { removeRoom, createRoom } from 'features/room-management/services'
import { useActiveRooms } from 'features/room-management/hooks'
import { RoomList, RoomModal, RoomForm } from 'features/room-management/ui'
import { Box, Button, Spinner, Alert } from 'shared/ui'
import { useModal } from 'shared/hooks'

const RoomManagement = () => {
  const { data: rooms, loading, error } = useActiveRooms()

  const roomModal = useModal()

  const handleCreateRoom = async ({ name, description }: RoomForm) => {
    const timestamp = dayjs().toString()
    await createRoom({
      name,
      description,
      createdAt: timestamp,
      updatedAt: timestamp,
      active: true,
      lastWinner: '',
      members: [],
    })
  }

  if (loading) renderLoading()

  if (error) renderError()

  return (
    <Box $flex $justify="center" $align="center" $gap="lg" $p="lg">
      <RoomList
        rooms={rooms}
        onClickAdd={(id) => {
          // show modal contain input form to add new member inside the room
        }}
        onClickRemove={removeRoom}
      />
      <Box>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 1 }}>
          <Button $variant="info" onClick={roomModal.open}>
            + new room
          </Button>
        </motion.div>
      </Box>
      <RoomModal isOpen={roomModal.isOpen} onClose={roomModal.close} onSubmit={handleCreateRoom} />
    </Box>
  )
}

export default RoomManagement

const renderLoading = () => (
  <Box $flex $justify="center" $align="center" $gap="xl" $p="lg">
    <Spinner label="Loading rooms..." />
  </Box>
)

const renderError = () => (
  <Box $flex $justify="center" $align="center" $gap="xl" $p="lg">
    <Alert $type="danger">Failed to load rooms</Alert>
  </Box>
)
