import { motion } from 'motion/react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Modal, Input, Button, Box, Typography } from 'shared/ui'

export interface MemberForm {
  name: string
}

interface MemberModalProps {
  isOpen: boolean
  title?: string
  defaultValues?: MemberForm
  onClose: () => void
  onSubmit: (formData: MemberForm) => void
}

const MemberModal = ({ isOpen, title, defaultValues = { name: '' }, onClose, onSubmit }: MemberModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MemberForm>({ defaultValues })

  const handleClose = () => {
    onClose()
    reset()
  }

  const handleFormSubmit: SubmitHandler<MemberForm> = (data) => {
    onSubmit(data)
    onClose()
    reset()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <Box $flex $direction="column" $justify="center" $align="center" $p="sm" $gap="sm">
        {title && (
          <Typography $size="xl" $weight="bold" $color="primary">
            {title}
          </Typography>
        )}
        <form onSubmit={handleSubmit(handleFormSubmit)} style={{ width: '100%' }}>
          <Box $flex $direction="column" $gap="md" $p="md">
            <Input
              placeholder="Enter member name..."
              error={errors.name?.message}
              {...register('name', {
                required: { value: true, message: 'Please enter a name' },
                maxLength: { value: 15, message: 'Name must not exceed 15 characters' },
              })}
            />
            <Box $flex $justify="center" $gap="sm">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 1.1 }}>
                <Button type="button" $variant="grey" onClick={handleClose}>
                  Cancel
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 1.1 }}>
                <Button type="submit" $variant="primary">
                  Save
                </Button>
              </motion.div>
            </Box>
          </Box>
        </form>
      </Box>
    </Modal>
  )
}

export default MemberModal
