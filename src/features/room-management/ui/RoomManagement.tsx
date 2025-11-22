import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Box, Alert, FlashAlert, useFlashAlert } from 'shared/ui'
import { useActiveRooms, useRoomManagement, useRemoveRoom } from 'features/room-management/hooks'
import { ModalConfirmRemoveRoom, RoomList, RoomModal } from 'features/room-management/ui'

interface RoomManagementProps {
  onClickAddItem: (id: string, name: string) => void
}

const RoomManagement = ({ onClickAddItem }: RoomManagementProps) => {
  const { data: rooms, loading, error } = useActiveRooms()
  const navigate = useNavigate()
  const { roomModal, handleCreateRoom } = useRoomManagement()
  const { selectedRoom, setSelectedRoom, modalRemoveRoom, removedIds, handleConfirmRemoveRoom } = useRemoveRoom()

  // Flash alert state
  const flashState = useFlashAlert()
  const [flashVisible, setFlashVisible] = useState(false)

  const handleOpenModal = (id: string) => {
    const findRoom = rooms.find((room) => room.id === id)
    if (!findRoom) return

    setSelectedRoom(findRoom)
    modalRemoveRoom.open()
  }

  const handleCreateRoomWithFeedback = async (data: { name: string; description: string }) => {
    try {
      await handleCreateRoom(data)
      flashState.set({
        type: 'success',
        message: 'Room created successfully!',
      })
      setFlashVisible(true)
    } catch (error) {
      console.log(`Error: handleCreateRoomWithFeedback => ${error}`)
      flashState.set({
        type: 'danger',
        message: 'Failed to create room. Please try again.',
      })
      setFlashVisible(true)
    }
  }

  const handleRemoveRoomWithFeedback = async () => {
    try {
      await handleConfirmRemoveRoom()
      flashState.set({
        type: 'success',
        message: 'Room removed successfully!',
      })
      setFlashVisible(true)
    } catch (error) {
      console.log(`Error: handleRemoveRoomWithFeedback => ${error}`)
      flashState.set({
        type: 'danger',
        message: 'Failed to remove room. Please try again.',
      })
      setFlashVisible(true)
    }
  }

  if (error) {
    return (
      <Box $flex $justify="center" $align="center" $p="xl">
        <Alert $type="danger">Failed to load rooms. Please try again.</Alert>
      </Box>
    )
  }

  return (
    <Box $flex $direction="column" $align="center" $gap="xl" $p="lg" $minHeight="100vh">
      {/* Flash alert */}
      <FlashAlert
        type={flashState.state.type}
        message={flashState.state.message}
        visible={flashVisible}
        onClose={() => setFlashVisible(false)}
      />
      {/* Main content area */}
      <Box $flex $justify="center" $align="center" $gap="lg">
        <RoomList
          rooms={rooms}
          removedIds={removedIds}
          loading={loading}
          onClickRoom={(id) => navigate(`/room/${id}`)}
          onClickAdd={onClickAddItem}
          onClickRemove={handleOpenModal}
          onCreateRoom={roomModal.open}
        />
      </Box>

      {/* Floating action button - positioned better for mobile */}

      {/* Modals */}
      <RoomModal isOpen={roomModal.isOpen} onClose={roomModal.close} onSubmit={handleCreateRoomWithFeedback} />
      {selectedRoom && (
        <ModalConfirmRemoveRoom
          room={selectedRoom}
          isOpen={modalRemoveRoom.isOpen}
          onConfirm={handleRemoveRoomWithFeedback}
          onCancel={modalRemoveRoom.close}
        />
      )}
    </Box>
  )
}

export default RoomManagement
