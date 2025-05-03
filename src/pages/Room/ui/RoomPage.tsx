import { MemberManagement } from 'features/member-management'
import { useParams } from 'react-router-dom'

const RoomPage = () => {
  const { id = '' } = useParams<{ id: string }>()

  return <MemberManagement roomId={id} />
}

export default RoomPage
