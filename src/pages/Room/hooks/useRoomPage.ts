import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { RoomMember } from 'entities/room'
import { useMemberCollection, useCreateNewMember } from 'features/member-management'
import { createFortuneHistoryEntry } from 'features/fortune'
import { useFlashAlert } from 'shared/ui'

export const useRoomPage = () => {
  const { id = '' } = useParams<{ id: string }>()
  const [winner, setWinner] = useState<RoomMember | null>(null)
  const [activeMobileSection, setActiveMobileSection] = useState<'wheel' | 'history'>('wheel')
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false)

  const { members, loading, error, eligibleRandomMembers } = useMemberCollection(id)
  const { modalNewMember, flashAlert, flashState, handleCreateMember } = useCreateNewMember()

  // Flash alert for fortune history errors
  const fortuneFlashState = useFlashAlert()
  const [fortuneFlashVisible, setFortuneFlashVisible] = useState(false)

  const memberNames = eligibleRandomMembers.map(({ id, name }: RoomMember) => ({
    id,
    name,
  }))

  const handleSpinComplete = (id: string) => {
    const findMember = members.find((m: RoomMember) => m.id === id)
    if (!findMember) return

    setWinner(findMember)
  }

  const handleSaveFortuneHistory = async (winnerId: string, winnerName: string) => {
    try {
      await createFortuneHistoryEntry({
        roomId: id,
        winnerId,
        winnerName,
      })
    } catch (error) {
      fortuneFlashState.set({
        type: 'danger',
        message: 'Failed to save fortune history. Please try again.',
      })
      setFortuneFlashVisible(true)
      throw error // Re-throw to prevent modal from closing
    }
  }

  const handleAcceptWinner = () => {
    setWinner(null)
  }

  const handleDiscardWinner = () => {
    setWinner(null)
  }

  const openMembersModal = () => setIsMembersModalOpen(true)
  const closeMembersModal = () => setIsMembersModalOpen(false)
  const closeFortuneFlash = () => setFortuneFlashVisible(false)

  const handleAddMember = (name: string) => {
    handleCreateMember(id, name)
  }

  return {
    roomId: id,
    winner,
    activeMobileSection,
    isMembersModalOpen,
    members,
    loading,
    error,
    memberNames,
    modalNewMember,
    flashAlert,
    flashState,
    fortuneFlashState,
    fortuneFlashVisible,
    setActiveMobileSection,
    handleSpinComplete,
    handleSaveFortuneHistory,
    handleAcceptWinner,
    handleDiscardWinner,
    openMembersModal,
    closeMembersModal,
    handleAddMember,
    closeFortuneFlash,
  }
}
