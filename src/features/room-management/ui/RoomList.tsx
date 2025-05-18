import { Box } from 'shared/ui'
import { Room, RoomItem } from 'entities/room'
import { AnimatePresence } from 'motion/react'

interface RoomListProps {
  rooms: Room[]
  removedIds: string[]
  onClickAdd: (id: string, name: string) => void
  onClickRoom: (id: string) => void
  onClickRemove: (id: string) => void
}

const RoomList = ({ rooms, removedIds, onClickRoom, onClickAdd, onClickRemove }: RoomListProps) => {
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
            onClickRemove={onClickRemove}
          />
        ))}
      </AnimatePresence>
    </Box>
  )
}

export default RoomList
