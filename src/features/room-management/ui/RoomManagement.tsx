import { useNavigate } from 'react-router-dom'
import { removeRoom } from 'features/room-management/services'
import { useActiveRooms, useRoomManagement } from 'features/room-management/hooks'
import { RoomList, RoomModal } from 'features/room-management/ui'
import { Box, Spinner, Alert, CircularButton, withMotion } from 'shared/ui'
import { Plus } from 'lucide-react'

const RoomManagement = () => {
  const { data: rooms, loading, error } = useActiveRooms()
  const navigate = useNavigate()
  const { roomModal, handleCreateRoom } = useRoomManagement()

  if (loading) renderLoading()

  if (error) renderError()

  return (
    <Box $flex $justify="center" $align="center" $gap="lg" $p="lg">
      <RoomList
        rooms={rooms}
        onClickRoom={(id) => navigate(`/room/${id}`)}
        onClickAdd={() => {
          // show modal contain input form to add new member inside the room
        }}
        onClickRemove={removeRoom}
      />
      <Box>
        {withMotion(
          <CircularButton $size={54} $variant="info" onClick={roomModal.open}>
            <Plus size={30} />
          </CircularButton>
        )}
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
