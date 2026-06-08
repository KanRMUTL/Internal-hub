import { ModalConfirm, Button, Typography, MotionWrapper } from 'shared/ui'
import { Room } from 'entities/room'

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
      <Typography $size="xl" $weight="bold" $color="danger" $align="center" $inline $noWrap>
        {'🥹 Are you sure to remove '} <br />
        <Typography $size="xl" $weight="bold" $color="primary" $inline>
          "{room.name}"
        </Typography>
        {' ?'}
      </Typography>
    }
    description="This action cannot be undone❗️"
    onConfirm={onConfirm}
    onCancel={onCancel}
    confirmSection={
      <MotionWrapper>
        <Button $size="md" $variant="info" onClick={onCancel}>
          <Typography $size="base" $weight="semibold" $color="white" $pointer>
            Not Sure
          </Typography>
        </Button>
      </MotionWrapper>
    }
    cancelSection={
      <MotionWrapper>
        <Button $size="md" $variant="danger" onClick={onConfirm}>
          <Typography $size="base" $weight="semibold" $color="white" $pointer>
            Remove
          </Typography>
        </Button>
      </MotionWrapper>
    }
  />
)

export default ModalConfirmRemoveMember
