import dayjs from 'dayjs'
import { useModal } from 'shared/hooks'
import { createMember } from 'features/member-management/services/memberServices'
import { useFlashAlert } from 'shared/ui'

const useCreateNewMember = () => {
  const modalNewMember = useModal()
  const flashAlert = useModal()
  const flashState = useFlashAlert()

  const handleCreateMember = async (roomId: string, name: string) => {
    try {
      const timestamp = dayjs().toString()
      await createMember(roomId, {
        name,
        joinAt: timestamp,
        isEligibleRandom: false,
        createdAt: timestamp,
        updatedAt: timestamp,
      })
      flashState.set({ type: 'success', message: 'New Item created successfully!' })
    } catch (error) {
      console.log(error)
      flashState.set({ type: 'danger', message: 'Error from add new item!' })
    } finally {
      flashAlert.open()
    }
  }

  return { modalNewMember, flashAlert, flashState, handleCreateMember }
}

export default useCreateNewMember
