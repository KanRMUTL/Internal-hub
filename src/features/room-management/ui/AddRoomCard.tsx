import RoomItem from './RoomItem'

interface AddRoomCardProps {
  onClick: () => void
}

const AddRoomCard = ({ onClick }: AddRoomCardProps) => {
  return <RoomItem variant="add" onClick={onClick} />
}

export default AddRoomCard
