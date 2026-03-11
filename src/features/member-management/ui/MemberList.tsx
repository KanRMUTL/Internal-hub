import { RoomMember } from 'entities/room'
import { Typography, Box } from 'shared/ui'
import { useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { MemberItem } from 'features/member-management/ui'

interface MemberListProps {
  members: RoomMember[]
  prefixKey?: string
  title?: string
  onClickMember: (id: string) => void
  onEditMember?: (id: string) => void
  showDelete?: boolean
  onDeleteMember?: (id: string) => void
}

const MemberList = ({
  members,
  prefixKey = 'member',
  title,
  onClickMember,
  onEditMember,
  showDelete,
  onDeleteMember,
}: MemberListProps) => {
  const [removedIds, setRemovedIds] = useState<string[]>([])
  const visibleMembers = members.filter((member) => !removedIds.includes(member.id))

  if (visibleMembers.length === 0 && !title) {
    return null
  }

  return (
    <Box flex direction="column" gap="md" width="100%">
      {title && (
        <Box flex align="center" justify="space-between" px="xs">
          <Typography size="lg" weight="semibold" color="primary">
            {title}
          </Typography>
          <Typography size="sm" color="muted" weight="medium">
            {visibleMembers.length} {visibleMembers.length === 1 ? 'member' : 'members'}
          </Typography>
        </Box>
      )}

      <Box
        grid
        gridColumns="1fr"
        tabletGridColumns="repeat(auto-fill, minmax(250px, 1fr))"
        desktopGridColumns="repeat(auto-fill, minmax(280px, 1fr))"
        gap="sm"
        tabletGap="md"
        width="100%"
      >
        <AnimatePresence mode="popLayout">
          {visibleMembers.map((member) => (
            <MemberItem
              key={`${prefixKey}-${member.id}`}
              id={member.id}
              name={member.name}
              active={prefixKey === 'eligible'}
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
    </Box>
  )
}

export default MemberList
