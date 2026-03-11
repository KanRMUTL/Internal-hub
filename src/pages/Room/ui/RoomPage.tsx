import { RoomMember } from 'entities/room'
import { DataBoundary, FlashAlert, SkipLinks, Box, PerformanceMonitor } from 'shared/ui'
import { MemberModal } from 'features/member-management'
import { WheelOfFortune, LuckyModal } from 'features/fortune'

import { MobileNavigation, FloatingActionButton, HistorySection, MembersModal } from './components'
import { useRoomPage } from '../hooks/useRoomPage'

const RoomPage = () => {
  const {
    roomId,
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
  } = useRoomPage()

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
            onMembersClick={openMembersModal}
          />

          {/* Floating Action Button for Desktop */}
          <FloatingActionButton onClick={openMembersModal} />

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
            <HistorySection roomId={roomId} active={activeMobileSection === 'history'} />
          </Box>

          {winner && (
            <LuckyModal
              winner={winner}
              onAccept={handleAcceptWinner}
              onDiscard={handleDiscardWinner}
              onSaveFortuneHistory={handleSaveFortuneHistory}
            />
          )}

          {/* Members Management Modal */}
          <MembersModal
            isOpen={isMembersModalOpen}
            onClose={closeMembersModal}
            onAddMember={modalNewMember.open}
            roomId={roomId}
            members={members}
          />

          <MemberModal
            isOpen={modalNewMember.isOpen}
            defaultValues={{ name: '' }}
            onClose={modalNewMember.close}
            onSubmit={(data) => {
              handleAddMember(data.name)
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
            onClose={closeFortuneFlash}
          />

          <PerformanceMonitor enabled showDetails position="bottom-right" />
        </Box>
      </DataBoundary>
    </>
  )
}

export default RoomPage
