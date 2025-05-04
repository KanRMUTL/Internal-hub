import { RoomMember } from 'entities/room'
import { Box } from 'shared/ui'
import { useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { MemberItem } from 'features/member-management/ui'

interface MemberListProps {
  members: RoomMember[]
  onClickMember: (id: string) => void
  onDeleteMember: (id: string) => void
}

const MemberList = ({ members, onClickMember, onDeleteMember }: MemberListProps) => {
  const [removedIds, setRemovedIds] = useState<string[]>([])
  const visibleMembers = members.filter((member) => !removedIds.includes(member.id))

  return (
    <Box $flex $justify="center" $align="center" $gap="xl" $p="md">
      <AnimatePresence>
        {visibleMembers.map((member) => (
          <MemberItem
            key={member.id}
            id={member.id}
            name={member.name}
            onClick={onClickMember}
            onDelete={(id) => {
              setRemovedIds((prev) => [...prev, id])
              onDeleteMember(id)
            }}
          />
        ))}
      </AnimatePresence>
    </Box>
  )
}

export default MemberList
