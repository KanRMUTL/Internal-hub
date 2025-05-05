import { motion } from 'motion/react'
import { Card, Typography } from 'shared/ui'
import styled from 'styled-components'
import { X, Edit } from 'lucide-react'
import { colors } from 'shared/styles'

interface MemberItemProps {
  id: string
  name: string
  onClick?: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

const MemberItem = ({ id, name, onClick, onEdit, onDelete }: MemberItemProps) => {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.01 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 1.08 }}
      exit={{ opacity: 0, scale: 0 }}
    >
      <CardWrapper>
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
          $p="md"
          $shadow="sm"
          $radius="lg"
          $gap="lg"
          $bg="secondary"
          style={{ cursor: 'pointer' }}
          onClick={() => onClick?.(id)}
        >
          <Typography $pointer>{name}</Typography>
          {onDelete && (
            <DeleteButtonWrapper whileHover={{ scale: 1.2 }} whileTap={{ scale: 1.2 }}>
              <DeleteButton
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(id)
                }}
              >
                <div>
                  <X size={14} color={colors.white} />
                </div>
              </DeleteButton>
            </DeleteButtonWrapper>
          )}
          {onEdit && (
            <EditButtonWrapper>
              <EditButton
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(id)
                }}
              >
                <div>
                  <Edit size={12} color={colors.white} />
                </div>
              </EditButton>
            </EditButtonWrapper>
          )}
        </Card>
      </CardWrapper>
    </motion.div>
  )
}

export default MemberItem

const DeleteButtonWrapper = styled(motion.div)`
  position: absolute;
  top: -6px;
  right: -6px;
`

const DeleteButton = styled.div`
  aspect-ratio: 1/1;
  width: 16px;
  display: flex;
  justify-content: center;
  background: ${({ theme }) => theme.colors.danger};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: 1px solid ${({ theme }) => theme.colors.danger};
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease;
`

const EditButtonWrapper = styled(motion.div)`
  position: absolute;
  top: -6px;
  left: -6px;
`

const EditButton = styled.div`
  aspect-ratio: 1/1;
  width: 16px;
  display: flex;
  justify-content: center;
  background: ${({ theme }) => theme.colors.info};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: 1px solid ${({ theme }) => theme.colors.info};
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease;
`

const CardWrapper = styled.div`
  position: relative;

  &:hover ${DeleteButton}, &:focus-within ${DeleteButton}, &:hover ${EditButton}, &:focus-within ${EditButton} {
    opacity: 1;
    visibility: visible;
  }
`
