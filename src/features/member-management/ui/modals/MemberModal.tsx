import { useForm, SubmitHandler } from 'react-hook-form'
import { Modal, Input, Button, Typography } from 'shared/ui'
import { Save, X, User } from 'lucide-react'
import styled from 'styled-components'
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
    mode: 'onChange', // Enable real-time validation
  })

  // Reset form when modal opens/closes or defaultValues change
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
      // Handle submission error if needed
      console.error('Error submitting form:', error)
    }
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose()
    }
  }

  const isEditing = Boolean(defaultValues.name)

  return (
    <Modal isOpen={isOpen} onClose={handleClose} $size="sm">
      <ModalContainer onKeyDown={handleKeyDown}>
        <Header>
          <IconContainer>
            <User size={20} />
          </IconContainer>
          <Typography $size="xl" $weight="semibold">
            {isEditing ? 'Edit Member' : 'Add Member'}
          </Typography>
        </Header>

        <Form onSubmit={handleSubmit(handleFormSubmit)}>
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

          <Actions>
            <Button type="button" $variant="danger" onClick={handleClose} disabled={isSubmitting}>
              <X size={16} />
              Cancel
            </Button>
            <Button
              type="submit"
              $variant="info"
              $loading={isSubmitting}
              disabled={!isValid || !isDirty || isSubmitting}
            >
              <Save size={16} />
              {isEditing ? 'Update' : 'Add'}
            </Button>
          </Actions>
        </Form>
      </ModalContainer>
    </Modal>
  )
}

export default MemberModal

const ModalContainer = styled.div`
  width: 300px;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.md};
`

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme }) => theme.colors.info};
  color: white;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
  padding-top: ${({ theme }) => theme.spacing.md};

  @media (max-width: 480px) {
    flex-direction: column-reverse;
    gap: ${({ theme }) => theme.spacing.sm};

    button {
      width: 100%;
    }
  }
`
