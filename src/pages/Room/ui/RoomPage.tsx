import { useState } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { Plus } from 'lucide-react'

import { RoomMember } from 'entities/room'
import { Box, CircularButton, withMotion, DataBoundary, FlashAlert, useFlashAlert } from 'shared/ui'
import { MemberManagementV2, useMemberCollection, useCreateNewMember, MemberModal } from 'features/member-management'
import { WheelOfFortune, LuckyModal, FortuneHistoryTable, createFortuneHistoryEntry } from 'features/fortune'

const RoomPage = () => {
  const { id = '' } = useParams<{ id: string }>()
  const [winner, setWinner] = useState<RoomMember | null>(null)

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
    <DataBoundary
      loading={loading}
      error={error}
      loadingMessage="Loading room information..."
      errorMessage="Failed to load room information..."
    >
      <Box $flex $justify="center" $gap="md" $p="lg" style={{ position: 'relative' }}>
        <WrapperButtonAdd>
          {withMotion(
            <CircularButton $size={54} $variant="info" onClick={modalNewMember.open}>
              <Plus size={30} />
            </CircularButton>
          )}
        </WrapperButtonAdd>
        <div style={{ flex: 1 }}>
          <WheelOfFortune members={memberNames} onSpinCompleted={handleSpinComplete} />
        </div>
        <RightSideContainer>
          <ScrollableContainer>
            <MemberManagementV2 roomId={id} members={members} />
          </ScrollableContainer>
          <FortuneHistoryContainer>
            <FortuneHistoryTable roomId={id} />
          </FortuneHistoryContainer>
        </RightSideContainer>

        {winner && (
          <LuckyModal
            winner={winner}
            onAccept={handleAcceptWinner}
            onDiscard={() => setWinner(null)}
            onSaveFortuneHistory={handleSaveFortuneHistory}
          />
        )}

        <MemberModal
          isOpen={modalNewMember.isOpen}
          title="Add Member"
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
  )
}

export default RoomPage

const RightSideContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  width: fit-content;
  max-width: 100%;
`

const ScrollableContainer = styled.div`
  width: fit-content;
  height: calc(50vh - 33px - 30px - 16px);
  overflow: auto;
  padding: 1rem;
`

const FortuneHistoryContainer = styled.div`
  width: fit-content;
  min-width: 400px;
  max-width: 600px;
  padding: 1rem;

  @media (max-width: 768px) {
    min-width: 300px;
    max-width: 100%;
  }
`

const WrapperButtonAdd = styled.div`
  z-index: 99;
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  justify-content: flex-end;
`
