import { ReactNode } from 'react'
import { Modal, Box, Typography } from 'shared/ui'

interface ModalConfirmProps {
  isOpen: boolean
  title?: ReactNode
  description?: string | ReactNode
  confirmSection: ReactNode
  cancelSection: ReactNode
  onConfirm: () => void
  onCancel: () => void
}

const ModalConfirm = ({
  isOpen,
  title = null,
  description,
  confirmSection,
  cancelSection,
  onCancel,
}: ModalConfirmProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <Box $flex $direction="column" $align="center" $gap="lg">
        {title}
        {description && (
          <Typography $size="base" $color="grey">
            {description}
          </Typography>
        )}

        <Box $flex $justify="center" $gap="md">
          {cancelSection}
          {confirmSection}
        </Box>
      </Box>
    </Modal>
  )
}

export default ModalConfirm
