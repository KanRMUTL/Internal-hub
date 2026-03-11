import { ModalConfirm, Button, Typography, Box } from 'shared/ui'
import { RoomMember } from 'entities/room'
import { motion } from 'motion/react'
import { AlertTriangle, Trash2, X } from 'lucide-react'

interface ModalConfirmRemoveMemberProps {
  selectedMember: RoomMember
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}

const ModalConfirmRemoveMember = ({ selectedMember, isOpen, onConfirm, onCancel }: ModalConfirmRemoveMemberProps) => (
  <ModalConfirm
    isOpen={isOpen}
    title={
      <Box flex align="flex-start" gap="md">
        <Box
          flex
          align="center"
          justify="center"
          radius="lg"
          style={{ color: 'white', flexShrink: 0 }}
          className="w-12 h-12"
        >
          <Typography color="danger">
            <AlertTriangle size={40} />
          </Typography>
        </Box>
        <Box flex justify="center" direction="column" gap="xs">
          <Typography size="xl" weight="semibold" color="danger">
            Remove Member
          </Typography>
          <Typography size="base" color="muted">
            Are you sure you want to remove{' '}
            <Typography size="base" weight="semibold" color="primary" inline>
              "{selectedMember.name}"
            </Typography>
            ?
          </Typography>
        </Box>
      </Box>
    }
    description={
      <Box
        p="md"
        radius="md"
        style={{
          backgroundColor: 'var(--bg-grey-50, #f9fafb)',
          borderLeft: '4px solid var(--color-warning, #f59e0b)',
        }}
      >
        <Typography size="sm" color="muted">
          This action cannot be undone. The member will be permanently removed from this room.
        </Typography>
      </Box>
    }
    onConfirm={onConfirm}
    onCancel={onCancel}
    confirmSection={
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.15 }}>
        <Button size="lg" variant="secondary" onClick={onCancel}>
          <X size={18} />
          Cancel
        </Button>
      </motion.div>
    }
    cancelSection={
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.15 }}>
        <Button size="lg" variant="danger" onClick={onConfirm}>
          <Trash2 size={18} />
          Yes Remove
        </Button>
      </motion.div>
    }
  />
)

export default ModalConfirmRemoveMember
