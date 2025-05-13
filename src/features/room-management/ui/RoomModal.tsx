import { useForm, SubmitHandler } from 'react-hook-form'
import { Box, Button, Input, Modal, Typography, TextArea } from 'shared/ui'

export interface RoomForm {
  name: string
  description: string
}

interface RoomModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (formData: RoomForm) => void
  defaultValues?: RoomForm
  title?: string
}

const RoomModal = ({ isOpen, onClose, onSubmit, defaultValues, title = 'New Room' }: RoomModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoomForm>({ defaultValues })

  const handleClose = () => {
    onClose()
    reset()
  }

  const handleFormSubmit: SubmitHandler<RoomForm> = (data) => {
    onSubmit(data)
    reset()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <Box $flex $direction="column" $justify="center" $align="center" $p="sm" $gap="sm">
        <Typography $size="xl" $weight="bold" $color="primary">
          {title}
        </Typography>
        <form onSubmit={handleSubmit(handleFormSubmit)} style={{ width: '100%' }}>
          <Box $flex $direction="column" $justify="center" $align="center" $gap="md">
            <Input
              placeholder="Enter room name..."
              error={errors.name?.message}
              autoFocus
              {...register('name', {
                required: { value: true, message: "Don't forget to enter name" },
                maxLength: { value: 20, message: 'Name must not exceed 20 characters' },
              })}
            />
            <TextArea
              placeholder="Enter room description..."
              error={errors.description?.message}
              {...register('description', {
                maxLength: { value: 30, message: 'Description must not exceed 30 characters' },
              })}
            />
            <Button type="submit">Save</Button>
          </Box>
        </form>
      </Box>
    </Modal>
  )
}

export default RoomModal
