import dayjs from 'dayjs'
import { useModal } from 'shared/hooks'
import { createRoom } from 'features/room-management/services'
import { RoomForm } from 'features/room-management/ui'

const useRoomManagement = () => {
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

  return {
    roomModal,
    handleCreateRoom,
  }
}

export default useRoomManagement
