import { RoomMember } from 'entities/room'
import { motion } from 'motion/react'
import { Card, Typography } from 'shared/ui'

interface MemberItemProps {
  member: RoomMember
  onClick: (member: RoomMember) => void
}

const MemberItem = ({ member, onClick }: MemberItemProps) => {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.01 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 1.08 }}
      exit={{ opacity: 0, scale: 0 }}
    >
      <Card
        $border={{
          width: 'thin',
          style: 'solid',
          color: 'primary',
        }}
        $pointer
        $flex
        $direction="column"
        $justify="space-between"
        $align="center"
        $p="lg"
        $shadow="md"
        $radius="lg"
        $gap="lg"
        $bg="secondary"
        style={{ cursor: 'pointer' }}
        onClick={() => onClick(member)}
      >
        <Typography $pointer>{member.name}</Typography>
      </Card>
    </motion.div>
  )
}

export default MemberItem
