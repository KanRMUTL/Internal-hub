import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Box, CircularButton, withMotion, DataBoundary } from 'shared/ui'
import { useActiveRooms, useRoomManagement, useRemoveRoom } from 'features/room-management/hooks'
import { ModalConfirmRemoveRoom, RoomList, RoomModal } from 'features/room-management/ui'

interface RoomManagementProps {
  onClickAddItem: (id: string) => void
}

const RoomManagement = ({ onClickAddItem }: RoomManagementProps) => {
  const { data: rooms, loading, error } = useActiveRooms()
  const navigate = useNavigate()
  const { roomModal, handleCreateRoom } = useRoomManagement()
  const { selectedRoom, setSelectedRoom, modalRemoveRoom, removedIds, handleConfirmRemoveRoom } = useRemoveRoom()

  const handleOpenModal = (id: string) => {
    const findRoom = rooms.find((room) => room.id === id)
    if (!findRoom) return

    setSelectedRoom(findRoom)
    modalRemoveRoom.open()
  }

  return (
    <DataBoundary loading={loading} error={error} loadingMessage="Loading rooms..." errorMessage="Failed to load rooms">
      <Box $flex $justify="center" $align="center" $gap="lg" $p="lg">
        <RoomList
          rooms={rooms}
          removedIds={removedIds}
          onClickRoom={(id) => navigate(`/room/${id}`)}
          onClickAdd={onClickAddItem}
          onClickRemove={handleOpenModal}
        />
        <Box>
          {withMotion(
            <CircularButton $size={54} $variant="info" onClick={roomModal.open}>
              <Plus size={30} />
            </CircularButton>
          )}
        </Box>
        <RoomModal isOpen={roomModal.isOpen} onClose={roomModal.close} onSubmit={handleCreateRoom} />
        {selectedRoom && (
          <ModalConfirmRemoveRoom
            room={selectedRoom}
            isOpen={modalRemoveRoom.isOpen}
            onConfirm={handleConfirmRemoveRoom}
            onCancel={modalRemoveRoom.close}
          />
        )}
      </Box>
    </DataBoundary>
  )
}

export default RoomManagement
