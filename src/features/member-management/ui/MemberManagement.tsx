import { useCallback, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { motion } from 'motion/react'
import { RoomMember } from 'entities/room'
import { useModal } from 'shared/hooks'
import {
  updateMember,
  useMemberCollection,
  createMember,
  deleteMember,
  switchEligibleMember,
} from 'features/member-management'
import { MemberList, MemberModal } from 'features/member-management/ui'
import { Alert, Box, Button, Spinner } from 'shared/ui'

interface MemberManagementProps {
  roomId: string
}

const MemberManagement = ({ roomId }: MemberManagementProps) => {
  const [selectedMember, setSelectedMember] = useState<RoomMember | null>(null)

  const modalNewMember = useModal()
  const modalEditMember = useModal()

  const { data: members, loading, error } = useMemberCollection(roomId)

  const { eligibleRandomMembers, normalMember } = useMemo(() => {
    const eligibleRandomMembers = members.filter((m) => m.isEligibleRandom === true)
    const normalMember = members.filter((m) => m.isEligibleRandom === false)
    return {
      eligibleRandomMembers,
      normalMember,
    }
  }, [members])

  const handleEditMember = (id: string) => {
    const findMember = members.find((member) => member.id === id)
    if (!findMember) return

    setSelectedMember(findMember)
    modalEditMember.open()
  }
  const handleSwitchEligibleMember = async (id: string) => {
    const findMember = members.find((member) => member.id === id)
    if (!findMember) return

    const timestamp = dayjs().toString()
    await switchEligibleMember(roomId, findMember.id, {
      isEligibleRandom: !findMember.isEligibleRandom,
      updatedAt: timestamp,
    })
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
      isEligibleRandom: false,
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
      <Box $flex $direction="column" $justify="center" $align="center" $gap="xl" $p="xl">
        <MemberList
          members={eligibleRandomMembers}
          prefixKey="eligible"
          onClickMember={handleSwitchEligibleMember}
          onEditMember={handleEditMember}
          onDeleteMember={handleDeleteMember}
        />
        <MemberList members={normalMember} prefixKey="normal" onClickMember={handleSwitchEligibleMember} />
        <Box>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 1.1 }}>
            <Button $variant="info" onClick={modalNewMember.open}>
              + Add Member
            </Button>
          </motion.div>
        </Box>
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
