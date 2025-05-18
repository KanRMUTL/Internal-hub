import { ModalConfirm, Button, Typography } from 'shared/ui'
import { RoomMember } from 'entities/room'
import { withMotion } from 'shared/ui'

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
      <Typography $size="xl" $weight="bold" $color="danger" $inline>
        {'🥹 Are you sure to remove '}
        <Typography $size="xl" $weight="bold" $color="primary" $inline>
          "{selectedMember.name}"
        </Typography>
        {' ?'}
      </Typography>
    }
    description="This action cannot be undone❗️"
    onConfirm={onConfirm}
    onCancel={onCancel}
    cancelSection={withMotion(
      <Button $size="base" $variant="grey" onClick={onCancel}>
        <Typography $size="base" $weight="semibold" $color="white" $pointer>
          Not Sure
        </Typography>
      </Button>
    )}
    confirmSection={withMotion(
      <Button $size="base" $variant="danger" onClick={onConfirm}>
        <Typography $size="base" $weight="semibold" $color="white" $pointer>
          Remove
        </Typography>
      </Button>
    )}
  />
)

export default ModalConfirmRemoveMember
