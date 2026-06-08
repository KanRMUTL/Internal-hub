import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Alert, FlashAlert, useFlashAlert } from 'shared/ui'
import { useActiveRooms, useRoomManagement, useRemoveRoom } from 'features/room-management/hooks'
import { ModalConfirmRemoveRoom, RoomList, RoomModal } from 'features/room-management/ui'
import { Room } from 'entities/room'

const RoomManagement = () => {
  const { data: rooms, loading, error } = useActiveRooms()
  const { roomModal, handleCreateRoom } = useRoomManagement()
  const { selectedRoom, setSelectedRoom, modalRemoveRoom, removedIds, handleConfirmRemoveRoom } = useRemoveRoom()

  const flashState = useFlashAlert()
  const [flashVisible, setFlashVisible] = useState(false)
  const gridRef = useRef<HTMLDivElement | null>(null)

  const visibleRooms = useMemo(() => rooms.filter((r) => !removedIds.includes(r.id)), [rooms, removedIds])

  const sortedRooms = useMemo<Room[]>(
    () => [...visibleRooms].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [visibleRooms]
  )

  const handleOpenRemove = (room: Room) => {
    setSelectedRoom(room)
    modalRemoveRoom.open()
  }

  const handleCreateRoomWithFeedback = async (data: { name: string; description: string }) => {
    try {
      await handleCreateRoom(data)
      flashState.set({ type: 'success', message: 'Room created.' })
      setFlashVisible(true)
    } catch (error) {
      console.log(`Error: handleCreateRoomWithFeedback => ${error}`)
      flashState.set({ type: 'danger', message: 'Failed to create room.' })
      setFlashVisible(true)
    }
  }

  const handleRemoveRoomWithFeedback = async () => {
    try {
      await handleConfirmRemoveRoom()
      flashState.set({ type: 'success', message: 'Room removed.' })
      setFlashVisible(true)
    } catch (error) {
      console.log(`Error: handleRemoveRoomWithFeedback => ${error}`)
      flashState.set({ type: 'danger', message: 'Failed to remove room.' })
      setFlashVisible(true)
    }
  }

  useEffect(() => {
    if (loading) return
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault()
        roomModal.open()
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        if (sortedRooms.length === 0) return
        e.preventDefault()
        const grid = gridRef.current
        if (!grid) return
        const buttons = Array.from(grid.querySelectorAll<HTMLButtonElement>('button'))
        const focused = document.activeElement as HTMLElement | null
        const currentIdx = focused ? buttons.indexOf(focused as HTMLButtonElement) : -1
        const next = e.key === 'ArrowDown' ? Math.min(currentIdx + 1, buttons.length - 1) : Math.max(currentIdx - 1, 0)
        buttons[next]?.focus()
      } else if (e.key === 'Enter') {
        const target = e.target as HTMLElement | null
        if (target && target.tagName === 'BUTTON' && target.closest('[data-room-grid]')) {
          target.click()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [loading, sortedRooms, roomModal])

  if (error) {
    return (
      <Box $flex $justify="center" $align="center" $p="xl">
        <Alert $type="danger">Failed to load rooms.</Alert>
      </Box>
    )
  }

  return (
    <>
      <FlashAlert
        type={flashState.state.type}
        message={flashState.state.message}
        visible={flashVisible}
        onClose={() => setFlashVisible(false)}
      />

      <div data-room-grid ref={gridRef}>
        <RoomList
          rooms={sortedRooms}
          removedIds={removedIds}
          loading={loading}
          onCreateRoom={roomModal.open}
          onRemove={handleOpenRemove}
        />
      </div>

      <RoomModal isOpen={roomModal.isOpen} onClose={roomModal.close} onSubmit={handleCreateRoomWithFeedback} />
      {selectedRoom && (
        <ModalConfirmRemoveRoom
          room={selectedRoom}
          isOpen={modalRemoveRoom.isOpen}
          onConfirm={handleRemoveRoomWithFeedback}
          onCancel={modalRemoveRoom.close}
        />
      )}
    </>
  )
}

export default RoomManagement
