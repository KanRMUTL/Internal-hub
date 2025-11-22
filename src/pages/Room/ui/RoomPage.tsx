import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { RoomMember } from 'entities/room'
import { DataBoundary, FlashAlert, useFlashAlert, SkipLinks, Box } from 'shared/ui'
import { useMemberCollection, useCreateNewMember, MemberModal } from 'features/member-management'
import { WheelOfFortune, LuckyModal, createFortuneHistoryEntry } from 'features/fortune'

import { MobileNavigation, FloatingActionButton, HistorySection, MembersModal } from './components'

const RoomPage = () => {
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

  return (
    <>
      <SkipLinks
        links={[
          { href: '#wheel-section', label: 'Skip to fortune wheel' },
          { href: '#history-section', label: 'Skip to history' },
        ]}
      />

      <DataBoundary
        loading={loading}
        error={error}
        loadingMessage="Loading room information..."
        errorMessage="Failed to load room information..."
      >
        <Box $minHeight="100vh" $tabletP="lg" $position="relative">
          {/* Mobile Navigation */}
          <MobileNavigation
            activeMobileSection={activeMobileSection}
            onSectionChange={setActiveMobileSection}
            onMembersClick={() => setIsMembersModalOpen(true)}
          />

          {/* Floating Action Button for Desktop */}
          <FloatingActionButton onClick={() => setIsMembersModalOpen(true)} />

          {/* Two Column Layout */}
          <Box
            $flex
            $direction="column"
            $gap="lg"
            $grid={false}
            $tabletDisplay="grid"
            $gridColumns="1fr 1fr"
            $tabletGap="xl"
            $desktopGridColumns="2fr 1fr"
            role="main"
          >
            {/* Wheel Section */}

            <WheelOfFortune members={memberNames} onSpinCompleted={handleSpinComplete} />

            {/* History Section */}
            <HistorySection roomId={id} active={activeMobileSection === 'history'} />
          </Box>

          {winner && (
            <LuckyModal
              winner={winner}
              onAccept={handleAcceptWinner}
              onDiscard={() => setWinner(null)}
              onSaveFortuneHistory={handleSaveFortuneHistory}
            />
          )}

          {/* Members Management Modal */}
          <MembersModal
            isOpen={isMembersModalOpen}
            onClose={() => setIsMembersModalOpen(false)}
            onAddMember={modalNewMember.open}
            roomId={id}
            members={members}
          />

          <MemberModal
            isOpen={modalNewMember.isOpen}
            defaultValues={{ name: '' }}
            onClose={modalNewMember.close}
            onSubmit={(data) => {
              handleCreateMember(id, data.name)
            }}
          />

          <FlashAlert
            type={flashState.state.type}
            message={flashState.state.message}
            visible={flashAlert.isOpen}
            onClose={flashAlert.close}
          />

          <FlashAlert
            type={fortuneFlashState.state.type}
            message={fortuneFlashState.state.message}
            visible={fortuneFlashVisible}
            onClose={() => setFortuneFlashVisible(false)}
          />
        </Box>
      </DataBoundary>
    </>
  )
}

export default RoomPage
