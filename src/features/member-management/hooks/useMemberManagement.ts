import { useCallback, useState } from 'react'
import dayjs from 'dayjs'
import { RoomMember } from 'entities/room'
import { useModal } from 'shared/hooks'
import { updateMember, deleteMember, switchEligibleMember } from 'features/member-management/services'

const useMemberManagement = (roomId: string, members: RoomMember[]) => {
  const [selectedMember, setSelectedMember] = useState<RoomMember | null>(null)

  const modalEditMember = useModal()
  const modalConfirmRemove = useModal()

  const handleEditMember = (id: string) => {
    const findMember = members.find((member) => member.id === id)
    if (!findMember) return
    setSelectedMember(findMember)
    modalEditMember.open()
  }

  const handleSwitchEligibleMember = async (id: string) => {
    const findMember = members.find((member) => member.id === id)
    if (!findMember) return

    const timestamp = dayjs().toString()
    await switchEligibleMember(roomId, findMember.id, {
      isEligibleRandom: !findMember.isEligibleRandom,
      updatedAt: timestamp,
    })
  }

  const handleDeleteMember = useCallback(
    async (memberId: string) => {
      modalConfirmRemove.close()
      await deleteMember(roomId, memberId)
    },
    [roomId]
  )

  const handleSaveMember = async (name: string) => {
    if (!roomId || !selectedMember) return

    const timestamp = dayjs().toString()
    await updateMember(roomId, selectedMember.id, { name, updatedAt: timestamp })
  }

  const handleConfirmRemoveMember = async (memberId: string) => {
    const findMember = members.find((member) => member.id === memberId)
    if (!findMember) return

    setSelectedMember(findMember)
    modalConfirmRemove.open()
  }

  const closeModalEditMember = () => {
    modalEditMember.close()
    setTimeout(() => setSelectedMember(null), 200)
  }

  return {
    selectedMember,
    modalEditMember,
    modalConfirmRemove,
    handleEditMember,
    handleSwitchEligibleMember,
    handleDeleteMember,
    handleSaveMember,
    closeModalEditMember,
    handleConfirmRemoveMember,
  }
}

export default useMemberManagement
