import { useCallback, useState } from 'react'
import dayjs from 'dayjs'
import { motion } from 'motion/react'
import { RoomMember } from 'entities/room'
import { useModal } from 'shared/hooks'
import { updateMember, useMemberCollection, createMember, deleteMember } from 'features/member-management'
import { MemberList, MemberModal } from 'features/member-management/ui'
import { Alert, Box, Button, Spinner } from 'shared/ui'

type MemberManagementProps = { roomId: string }

const MemberManagement = ({ roomId }: MemberManagementProps) => {
  const [selectedMember, setSelectedMember] = useState<RoomMember | null>(null)

  const modalNewMember = useModal()
  const modalEditMember = useModal()

  const { data: members, loading, error } = useMemberCollection(roomId)

  const handleEditMember = (id: string) => {
    const findMember = members.find((member) => member.id === id)
    if (!findMember) return

    setSelectedMember(findMember)
    modalEditMember.open()
  }

  const handleDeleteMember = useCallback(async (memberId: string) => {
    await deleteMember(roomId, memberId)
  }, [])

  const handleSaveMember = async (name: string) => {
    if (!roomId || !selectedMember) return

    const timestamp = dayjs().toString()
    await updateMember(roomId, selectedMember.id, { name, updatedAt: timestamp })
  }

  const handleAddMember = async (name: string) => {
    const timestamp = dayjs().toString()
    await createMember(roomId, {
      name,
      joinAt: timestamp,
      createdAt: timestamp,
      updatedAt: timestamp,
    })
  }

  const closeModalEditMember = () => {
    modalEditMember.close()
    setSelectedMember(null)
  }

  if (loading) return renderLoading()

  if (error) return renderError()

  return (
    <Box $flex $justify="center" $align="center" $gap="xl" $p="xl">
      <MemberList members={members} onEditMember={handleEditMember} onDeleteMember={handleDeleteMember} />
      <Box>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 1.1 }}>
          <Button $variant="info" onClick={modalNewMember.open}>
            + Add Member
          </Button>
        </motion.div>
      </Box>
      <MemberModal
        isOpen={modalNewMember.isOpen}
        title="Add Member"
        defaultValues={{ name: '' }}
        onClose={modalNewMember.close}
        onSubmit={(data) => {
          handleAddMember(data.name)
        }}
      />
      {selectedMember && (
        <MemberModal
          isOpen={modalEditMember.isOpen}
          title="Edit Member"
          defaultValues={{ name: selectedMember.name }}
          onClose={closeModalEditMember}
          onSubmit={(data) => handleSaveMember(data.name)}
        />
      )}
    </Box>
  )
}

export default MemberManagement

const renderLoading = () => (
  <Box $flex $justify="center" $align="center" $gap="xl" $p="lg">
    <Spinner label="Loading room..." />
  </Box>
)

const renderError = () => (
  <Box $flex $justify="center" $align="center" $gap="xl" $p="lg">
    <Alert $type="danger">Failed to load room</Alert>
  </Box>
)
