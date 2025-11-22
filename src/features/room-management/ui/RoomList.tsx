import { EmptyState } from 'shared/ui'
import { Room, RoomItem } from 'entities/room'
import { AnimatePresence } from 'motion/react'
import { Home } from 'lucide-react'
import RoomGrid from './RoomGrid'
import RoomCardSkeleton from './RoomCardSkeleton'

interface RoomListProps {
  rooms: Room[]
  removedIds: string[]
  loading?: boolean
  onClickAdd: (id: string, name: string) => void
  onClickRoom: (id: string) => void
  onClickRemove: (id: string) => void
  onCreateRoom?: () => void
}

const RoomList = ({
  rooms,
  removedIds,
  loading = false,
  onClickRoom,
  onClickAdd,
  onClickRemove,
  onCreateRoom,
}: RoomListProps) => {
  const visibleRooms = rooms.filter((room) => !removedIds.includes(room.id))

  // Show loading skeletons
  if (loading) {
    return (
      <RoomGrid>
        {Array.from({ length: 3 }).map((_, index) => (
          <RoomCardSkeleton key={index} />
        ))}
      </RoomGrid>
    )
  }

  // Show empty state when no rooms
  if (visibleRooms.length === 0) {
    return (
      <EmptyState
        title="No rooms yet"
        description="Create your first room to get started with managing members and using the fortune wheel."
        actionLabel="Create Room"
        onAction={onCreateRoom}
        icon={<Home size={48} color="currentColor" opacity={0.5} />}
      />
    )
  }

  return (
    <RoomGrid>
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
    </RoomGrid>
  )
}

export default RoomList
