import { useForm, SubmitHandler } from 'react-hook-form'
import { Modal, Input, Button, Typography } from 'shared/ui'
import { Save, X, User } from 'lucide-react'
import { useEffect } from 'react'

export interface MemberForm {
  name: string
}

interface MemberModalProps {
  isOpen: boolean
  defaultValues?: MemberForm
  onClose: () => void
  onSubmit: (formData: MemberForm) => void
}

const MemberModal = ({ isOpen, defaultValues = { name: '' }, onClose, onSubmit }: MemberModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<MemberForm>({
    defaultValues,
    mode: 'onChange',
  })

  useEffect(() => {
    if (isOpen) {
      reset(defaultValues)
    }
  }, [isOpen, defaultValues, reset])

  const handleClose = () => {
    onClose()
    reset()
  }

  const handleFormSubmit: SubmitHandler<MemberForm> = (data) => {
    try {
      onSubmit(data)
      onClose()
      reset()
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose()
    }
  }

  const isEditing = Boolean(defaultValues.name)

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="sm">
      <div className="w-[300px]" onKeyDown={handleKeyDown}>
        <div className="flex items-center gap-4 pb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500 text-white">
            <User size={20} />
          </div>
          <Typography size="xl" weight="semibold">
            {isEditing ? 'Edit Member' : 'Add Member'}
          </Typography>
        </div>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit(handleFormSubmit)}>
          <Input
            placeholder="Enter member name"
            error={errors.name?.message}
            autoFocus
            autoComplete="name"
            {...register('name', {
              required: { value: true, message: 'Member name is required' },
              minLength: { value: 2, message: 'Name must be at least 2 characters' },
              maxLength: { value: 30, message: 'Name must not exceed 30 characters' },
              pattern: {
                value: /^[a-zA-Z\s\-'.]+$/,
                message: 'Name can only contain letters, spaces, hyphens, apostrophes, and periods',
              },
            })}
          />

          <div className="flex gap-4 justify-end pt-4 max-[480px]:flex-col-reverse max-[480px]:gap-2 max-[480px]:[&_button]:w-full">
            <Button type="button" variant="danger" onClick={handleClose} disabled={isSubmitting}>
              <X size={16} />
              Cancel
            </Button>
            <Button type="submit" variant="info" loading={isSubmitting} disabled={!isValid || !isDirty || isSubmitting}>
              <Save size={16} />
              {isEditing ? 'Update' : 'Add'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default MemberModal
