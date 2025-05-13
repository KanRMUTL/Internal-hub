// hooks/useMemberManagement.ts
import { useCallback, useState } from 'react'
import dayjs from 'dayjs'
import { RoomMember } from 'entities/room'
import { useModal } from 'shared/hooks'
import { updateMember, createMember, deleteMember, switchEligibleMember } from 'features/member-management'

export const useMemberManagement = (roomId: string, members: RoomMember[]) => {
  const [selectedMember, setSelectedMember] = useState<RoomMember | null>(null)

  const modalNewMember = useModal()
  const modalEditMember = useModal()

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
      await deleteMember(roomId, memberId)
    },
    [roomId]
  )

  const handleSaveMember = async (name: string) => {
    if (!roomId || !selectedMember) return

    const timestamp = dayjs().toString()
    await updateMember(roomId, selectedMember.id, { name, updatedAt: timestamp })
  }

  const handleAddMember = async (name: string) => {
    const timestamp = dayjs().toString()
    await createMember(roomId, {
      name,
      joinAt: timestamp,
      isEligibleRandom: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    })
  }

  const closeModalEditMember = () => {
    modalEditMember.close()
    setTimeout(() => setSelectedMember(null), 200)
  }

  return {
    selectedMember,
    modalNewMember,
    modalEditMember,
    handleEditMember,
    handleSwitchEligibleMember,
    handleDeleteMember,
    handleSaveMember,
    handleAddMember,
    closeModalEditMember,
  }
}
