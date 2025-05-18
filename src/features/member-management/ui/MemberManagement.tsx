import { motion } from 'motion/react'
import { PlusCircle } from 'lucide-react'

import { RoomMember } from 'entities/room'
import { useCreateNewMember, useMemberManagement } from 'features/member-management/hooks'
import { MemberList, MemberModal } from 'features/member-management/ui'
import { Box, Button } from 'shared/ui'

interface MemberManagementProps {
  roomId: string
  members: RoomMember[]
  eligibleRandomMembers: RoomMember[]
  normalMembers: RoomMember[]
}

const MemberManagement = ({ roomId, members, eligibleRandomMembers, normalMembers }: MemberManagementProps) => {
  const {
    selectedMember,
    modalEditMember,
    handleEditMember,
    handleSwitchEligibleMember,
    handleDeleteMember,
    handleSaveMember,
    closeModalEditMember,
  } = useMemberManagement(roomId, members)
  const { modalNewMember } = useCreateNewMember()

  return (
    <>
      <Box $flex $direction="column" $justify="center" $align="center" $gap="md">
        <MemberList members={eligibleRandomMembers} prefixKey="eligible" onClickMember={handleSwitchEligibleMember} />
        <MemberList
          members={normalMembers}
          prefixKey="normal"
          showDelete
          onClickMember={handleSwitchEligibleMember}
          onEditMember={handleEditMember}
          onDeleteMember={handleDeleteMember}
        />
        <Box>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 1.1 }}>
            <Button $variant="info" onClick={modalNewMember.open}>
              <PlusCircle size={20} /> &nbsp; New Member
            </Button>
          </motion.div>
        </Box>
      </Box>

      {selectedMember && (
        <MemberModal
          isOpen={modalEditMember.isOpen}
          title="Edit Member"
          defaultValues={{ name: selectedMember.name }}
          onClose={closeModalEditMember}
          onSubmit={(data) => handleSaveMember(data.name)}
        />
      )}
    </>
  )
}

export default MemberManagement
