import { RoomMember } from 'entities/room'
import { Table } from 'shared/ui'
import { MemberModal, ModalConfirmRemoveMember } from 'features/member-management/ui'
import { useMemberManagement } from 'features/member-management/hooks'
import { createMemberColumns } from 'features/member-management/libs'

interface MemberTableProps {
  roomId: string
  members: RoomMember[]
}

const MemberManagementV2 = ({ roomId, members }: MemberTableProps) => {
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
      <Table<RoomMember> rowkey="id" columns={columns} data={members} />

      {selectedMember && (
        <>
          <MemberModal
            isOpen={modalEditMember.isOpen}
            title={`Edit "${selectedMember.name}"`}
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

export default MemberManagementV2
