import { RoomMember } from 'entities/room'
import { Table } from 'shared/ui'
import { MemberModal, ModalConfirmRemoveMember } from 'features/member-management/ui'
import { useMemberManagement } from 'features/member-management/hooks'
import { createMemberColumns } from 'features/member-management/libs'

interface MemberTableProps {
  roomId: string
  members: RoomMember[]
}

const MemberManagement = ({ roomId, members }: MemberTableProps) => {
  const {
    selectedMember,
    modalEditMember,
    modalConfirmRemove,
    handleEditMember,
    handleConfirmRemoveMember,
    handleDeleteMember,
    handleSwitchEligibleMember,
    handleSaveMember,
    closeModalEditMember,
  } = useMemberManagement(roomId, members)

  const columns = createMemberColumns({
    handleEdit: handleEditMember,
    handleDelete: handleConfirmRemoveMember,
    handleToggle: handleSwitchEligibleMember,
  })

  return (
    <>
      <Table<RoomMember>
        rowkey="id"
        columns={columns}
        data={members}
        ariaLabel="Table of room members with actions to edit, delete, and toggle eligibility"
        emptyMessage="No members in this room yet. Add some members to get started."
      />

      {selectedMember && (
        <>
          <MemberModal
            isOpen={modalEditMember.isOpen}
            defaultValues={{ name: selectedMember.name }}
            onClose={closeModalEditMember}
            onSubmit={(data) => handleSaveMember(data.name)}
          />

          <ModalConfirmRemoveMember
            selectedMember={selectedMember}
            isOpen={modalConfirmRemove.isOpen}
            onCancel={modalConfirmRemove.close}
            onConfirm={() => handleDeleteMember(selectedMember.id)}
          />
        </>
      )}
    </>
  )
}

export default MemberManagement
