import { RoomMember } from 'entities/room'
import { Box } from 'shared/ui'
import { useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { MemberItem } from 'features/member-management/ui'

interface MemberListProps {
  members: RoomMember[]
  prefixKey?: string
  onClickMember: (id: string) => void
  onEditMember?: (id: string) => void
  showDelete?: boolean
  onDeleteMember?: (id: string) => void
}

const MemberList = ({
  members,
  prefixKey = 'member',
  onClickMember,
  onEditMember,
  showDelete,
  onDeleteMember,
}: MemberListProps) => {
  const [removedIds, setRemovedIds] = useState<string[]>([])
  const visibleMembers = members.filter((member) => !removedIds.includes(member.id))

  return (
    <Box $flex $justify="center" $align="center" $gap="lg" $p="md">
      <AnimatePresence>
        {visibleMembers.map((member) => (
          <MemberItem
            key={`${prefixKey}-${member.id}`}
            id={member.id}
            name={member.name}
            onClick={onClickMember}
            onEdit={onEditMember}
            showDelete={showDelete}
            onDelete={(id) => {
              setRemovedIds((prev) => [...prev, id])
              onDeleteMember?.(id)
            }}
          />
        ))}
      </AnimatePresence>
    </Box>
  )
}

export default MemberList
