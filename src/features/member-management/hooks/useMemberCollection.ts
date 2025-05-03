import { RoomMember } from 'entities/room'
import { useFirestoreCollection } from 'shared/hooks'
import { getMemberQuery } from 'features/member-management/services'
import { useMemo } from 'react'

const useMemberCollection = (roomId: string) => {
  const query = useMemo(() => getMemberQuery(roomId), [roomId])
  return useFirestoreCollection<RoomMember>(query)
}

export default useMemberCollection
