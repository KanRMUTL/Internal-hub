import { ModalConfirm, Button, Typography } from 'shared/ui'
import { Room } from 'entities/room'
import { withMotion } from 'shared/ui'

interface ModalConfirmRemoveMemberProps {
  room: Room
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}

const ModalConfirmRemoveMember = ({ room, isOpen, onConfirm, onCancel }: ModalConfirmRemoveMemberProps) => (
  <ModalConfirm
    isOpen={isOpen}
    title={
      <Typography $size="xl" $weight="bold" $color="danger" $inline>
        {'🥹 Are you sure to remove '}
        <Typography $size="xl" $weight="bold" $color="primary" $inline>
          "{room.name}"
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
