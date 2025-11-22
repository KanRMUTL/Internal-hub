import styled from 'styled-components'
import { Plus } from 'lucide-react'
import { RoomMember } from 'entities/room'
import { CircularButton, withMotion, Modal } from 'shared/ui'
import { MemberManagementV2 } from 'features/member-management'

interface MembersModalProps {
  isOpen: boolean
  onClose: () => void
  onAddMember: () => void
  roomId: string
  members: RoomMember[]
}

const MembersModal = ({ isOpen, onClose, onAddMember, roomId, members }: MembersModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Members" $size="xl">
      <MembersModalContent>
        <MembersModalHeader>
          {withMotion(
            <CircularButton $size={40} $variant="info" onClick={onAddMember} aria-label="Add new member">
              <Plus size={20} />
            </CircularButton>
          )}
        </MembersModalHeader>
        <MemberManagementV2 roomId={roomId} members={members} />
      </MembersModalContent>
    </Modal>
  )
}

export default MembersModal

// Members modal content
const MembersModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  min-height: 50vh;
  max-height: 70vh;
`

const MembersModalHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: ${({ theme }) => theme.spacing.xs};
`
