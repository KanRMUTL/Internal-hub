import { useState } from 'react'
import { Room } from 'entities/room'
import { useModal } from 'shared/hooks'
import { removeRoom } from 'features/room-management/services'

const useRemoveRoom = () => {
  const modalRemoveRoom = useModal()
  const [selectedRoom, setSelectedRoom] = useState<Room>()
  const [removedIds, setRemovedIds] = useState<string[]>([])

  const handleConfirmRemoveRoom = async () => {
    if (!selectedRoom) return

    try {
      modalRemoveRoom.close()
      setRemovedIds((prev) => [...prev, selectedRoom.id])
      await removeRoom(selectedRoom.id)
      setSelectedRoom(undefined)
    } catch (error) {
      console.error('Failed to remove room:', error)
    }
  }

  return {
    selectedRoom,
    setSelectedRoom,
    modalRemoveRoom,
    removedIds,
    handleConfirmRemoveRoom,
  }
}

export default useRemoveRoom
