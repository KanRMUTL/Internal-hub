import { Room } from 'entities/room'
import { QUERY_ROOM_ACTIVE } from 'features/room-management/config'
import { useFirestoreCollection } from 'shared/hooks'

const useActiveRooms = () => {
  return useFirestoreCollection<Room>(QUERY_ROOM_ACTIVE)
}

export default useActiveRooms
