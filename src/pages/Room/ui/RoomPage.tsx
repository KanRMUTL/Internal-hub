import { useState } from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import { useParams } from 'react-router-dom'
import { Plus } from 'lucide-react'

import { RoomMember } from 'entities/room'
import { Box, CircularButton, withMotion, DataBoundary } from 'shared/ui'
import { MemberManagementV2, useMemberCollection, useCreateNewMember, MemberModal } from 'features/member-management'
import { WheelOfFortune, LuckyModal } from 'features/fortune'

const RoomPage = () => {
  const { id = '' } = useParams<{ id: string }>()
  const [winner, setWinner] = useState<RoomMember | null>(null)

  const { members, loading, error, eligibleRandomMembers } = useMemberCollection(id)
  const { modalNewMember, handleCreateMember } = useCreateNewMember()

  const memberNames = eligibleRandomMembers.map(({ id, name }) => ({
    id,
    name,
  }))

  const handleSpinComplete = (id: string) => {
    const findMember = members.find((m) => m.id === id)
    if (!findMember) return

    setWinner(findMember)
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
        <ScrollableContainer>
          <MemberManagementV2 roomId={id} members={members} />
        </ScrollableContainer>

        {winner && <LuckyModal winner={winner} onAccept={() => setWinner(null)} onDiscard={() => setWinner(null)} />}

        <MemberModal
          isOpen={modalNewMember.isOpen}
          title="Add Member"
          defaultValues={{ name: '' }}
          onClose={modalNewMember.close}
          onSubmit={(data) => {
            handleCreateMember(id, data.name)
          }}
        />
      </Box>
    </DataBoundary>
  )
}

export default RoomPage

const ScrollableContainer = styled.div`
  width: fit-content;
  height: calc(100vh - 66px - 60px - 32px);
  overflow: auto;
  padding: 1rem;
`

const WrapperButtonAdd = styled.div`
  z-index: 99;
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  justify-content: flex-end;
`
