import { RoomItem } from 'entities/room'

interface AddRoomCardProps {
  onClick: () => void
}

const AddRoomCard = ({ onClick }: AddRoomCardProps) => {
  return <RoomItem variant="add" onClick={onClick} />
}

export default AddRoomCard
