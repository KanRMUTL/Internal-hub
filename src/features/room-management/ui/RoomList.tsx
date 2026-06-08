import { useNavigate } from 'react-router-dom'
import type { Room } from 'entities/room'
import { AnimatePresence } from 'motion/react'
import RoomGrid from './RoomGrid'
import RoomCardSkeleton from './RoomCardSkeleton'
import AddRoomCard from './AddRoomCard'
import ModernEmptyState from './ModernEmptyState'
import RoomItem from './RoomItem'

interface RoomListProps {
  rooms: Room[]
  removedIds: string[]
  loading?: boolean
  onCreateRoom?: () => void
  onRemove?: (room: Room) => void
}

const RoomList = ({ rooms, removedIds, loading = false, onCreateRoom, onRemove }: RoomListProps) => {
  const navigate = useNavigate()
  const visibleRooms = rooms.filter((room) => !removedIds.includes(room.id))

  if (loading) {
    return (
      <RoomGrid>
        {Array.from({ length: 3 }).map((_, index) => (
          <RoomCardSkeleton key={index} />
        ))}
      </RoomGrid>
    )
  }

  if (visibleRooms.length === 0) {
    return <ModernEmptyState onCreateRoom={onCreateRoom ?? (() => undefined)} />
  }

  return (
    <RoomGrid>
      <AnimatePresence>
        {visibleRooms.map((room, index) => (
          <RoomItem
            key={room.id}
            room={room}
            index={index}
            onClick={() => navigate(`/room/${room.id}`)}
            onRemove={onRemove ? () => onRemove(room) : undefined}
          />
        ))}
        {onCreateRoom && <AddRoomCard onClick={onCreateRoom} />}
      </AnimatePresence>
    </RoomGrid>
  )
}

export default RoomList
