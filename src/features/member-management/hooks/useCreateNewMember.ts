import dayjs from 'dayjs'
import { useModal } from 'shared/hooks'
import { createMember } from 'features/member-management/services/memberServices'

const useCreateNewMember = () => {
  const modalNewMember = useModal()

  const handleCreateMember = async (roomId: string, name: string) => {
    const timestamp = dayjs().toString()
    await createMember(roomId, {
      name,
      joinAt: timestamp,
      isEligibleRandom: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    })
  }

  return { modalNewMember, handleCreateMember }
}

export default useCreateNewMember
