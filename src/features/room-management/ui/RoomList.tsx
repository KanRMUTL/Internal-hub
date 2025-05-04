import { Box } from 'shared/ui'
import { Room, RoomItem } from 'entities/room'
import { useState } from 'react'
import { AnimatePresence } from 'motion/react'

interface RoomListProps {
  rooms: Room[]
  onClickAdd: (id: string) => void
  onClickRoom: (id: string) => void
  onClickRemove: (id: string) => void
}

const RoomList = ({ rooms, onClickRoom, onClickAdd, onClickRemove }: RoomListProps) => {
  const [removedIds, setRemovedIds] = useState<string[]>([])
  const visibleRooms = rooms.filter((room) => !removedIds.includes(room.id))

  return (
    <Box $flex $justify="center" $align="center" $gap="xl" $p="md">
      <AnimatePresence>
        {visibleRooms.map((room) => (
          <RoomItem
            key={room.id}
            id={room.id}
            title={room.name}
            description={room.description}
            onClick={onClickRoom}
            onClickAdd={onClickAdd}
            onClickRemove={(id) => {
              setRemovedIds((prev) => [...prev, id])
              onClickRemove(id)
            }}
          />
        ))}
      </AnimatePresence>
    </Box>
  )
}

export default RoomList
