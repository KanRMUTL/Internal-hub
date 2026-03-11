import { Plus } from 'lucide-react'
import { RoomMember } from 'entities/room'
import { CircularButton, withMotion, Modal } from 'shared/ui'
import { MemberManagement } from 'features/member-management'
import { cva } from 'class-variance-authority'

interface MembersModalProps {
  isOpen: boolean
  onClose: () => void
  onAddMember: () => void
  roomId: string
  members: RoomMember[]
}

const modalContentVariants = cva('flex flex-col gap-4 min-h-[50vh] max-h-[70vh]')

const modalHeaderVariants = cva('flex justify-end p-1')

const MembersModal = ({ isOpen, onClose, onAddMember, roomId, members }: MembersModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Members" size="xl">
      <div className={modalContentVariants()}>
        <div className={modalHeaderVariants()}>
          {withMotion(
            <CircularButton size={40} variant="info" onClick={onAddMember} aria-label="Add new member">
              <Plus size={20} />
            </CircularButton>
          )}
        </div>
        <MemberManagement roomId={roomId} members={members} />
      </div>
    </Modal>
  )
}

export default MembersModal
