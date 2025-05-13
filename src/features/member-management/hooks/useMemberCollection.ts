import { RoomMember } from 'entities/room'
import { useFirestoreCollection } from 'shared/hooks'
import { getMemberQuery } from 'features/member-management/services'
import { useMemo } from 'react'

const useMemberCollection = (roomId: string) => {
  const query = useMemo(() => getMemberQuery(roomId), [roomId])
  const { data: members, loading, error } = useFirestoreCollection<RoomMember>(query)

  const { eligibleRandomMembers, normalMembers } = useMemo(() => {
    return {
      eligibleRandomMembers: members.filter((member) => member.isEligibleRandom === true),
      normalMembers: members.filter((member) => member.isEligibleRandom === false),
    }
  }, [members])

  return { members, loading, error, eligibleRandomMembers, normalMembers }
}

export default useMemberCollection
