import { motion } from 'motion/react'
import { Card, Typography, TypogaphyProps, BoxProps, Box, CircularButton } from 'shared/ui'
import styled from 'styled-components'
import { X, Edit, User, UserCheck } from 'lucide-react'
import { ReactNode } from 'react'

interface MemberItemProps {
  id: string
  name: string
  description?: ReactNode
  onClick?: (id: string) => void
  onEdit?: (id: string) => void
  showDelete?: boolean
  onDelete?: (id: string) => void
  typography?: TypogaphyProps
  box?: BoxProps
  active?: boolean
}

const MemberItem = ({
  id,
  name,
  description = null,
  onClick,
  onEdit,
  showDelete = false,
  onDelete,
  typography,
  box,
  active = true,
}: MemberItemProps) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      transition={{
        duration: 0.25,
        ease: [0.4, 0.0, 0.2, 1],
      }}
      layout
    >
      <Box $position="relative" $width="100%" $minWidth="280px" $maxWidth="400px">
        <StyledCard
          $border={{
            width: 'thin',
            style: 'solid',
            color: active ? 'primary' : 'grey',
          }}
          $interactive
          $padding="md"
          $shadow="sm"
          $rounded="lg"
          $active={active}
          onClick={() => onClick?.(id)}
          {...box}
        >
          <Box $flex $align="center" $gap="md" $width="100%" $minHeight="44px">
            <CircularButton $variant={active ? 'success' : 'disabled'}>
              {active ? <UserCheck size={16} /> : <User size={16} />}
            </CircularButton>

            <Box $flex $direction="column" style={{ gap: '2px', flex: 1, minWidth: 0 }}>
              <Typography
                $size="lg"
                $weight="semibold"
                $color={active ? 'primary' : 'disabled'}
                $pointer
                {...typography}
              >
                {name}
              </Typography>

              {description}
            </Box>

            <ActionButtons>
              {onEdit && (
                <ActionButton
                  as={motion.button}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  $variant="edit"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit(id)
                  }}
                  aria-label={`Edit ${name}`}
                  title={`Edit ${name}`}
                >
                  <Edit size={14} />
                </ActionButton>
              )}

              {showDelete && onDelete && (
                <ActionButton
                  as={motion.button}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  $variant="delete"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(id)
                  }}
                  aria-label={`Delete ${name}`}
                  title={`Delete ${name}`}
                >
                  <X size={14} />
                </ActionButton>
              )}
            </ActionButtons>
          </Box>
        </StyledCard>
      </Box>
    </motion.div>
  )
}

export default MemberItem

const StyledCard = styled(Card)<{ $active?: boolean }>`
  transition: ${({ theme }) => theme.motion.transitions.default};
  cursor: pointer;
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadow.lg};
  }

  &:focus-within {
    outline: none;
    box-shadow:
      ${({ theme }) => theme.shadow.lg},
      0 0 0 3px ${({ theme }) => theme.colors.focus};
  }

  /* Enhanced background contrast for better readability */
  ${({ theme, $active }) => `
    background-color: ${
      $active ? theme.background.surface : theme.mode === 'dark' ? theme.colors.grey[800] : theme.colors.grey[50]
    };
  `}

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    transition: ${({ theme }) => theme.motion.reducedMotion.transitions};

    &:hover {
      transform: none;
    }
  }
`

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  opacity: 0;
  visibility: hidden;
  transition:
    opacity ${({ theme }) => theme.motion.duration.fast} ${({ theme }) => theme.motion.easing.easeOut},
    visibility ${({ theme }) => theme.motion.duration.fast} ${({ theme }) => theme.motion.easing.easeOut};

  /* Show on hover of parent container */
  *:hover > & {
    opacity: 1;
    visibility: visible;
  }

  /* Always show on touch devices */
  @media (hover: none) {
    opacity: 1;
    visibility: visible;
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

const ActionButton = styled.button<{ $variant: 'edit' | 'delete' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: ${({ theme }) => theme.motion.transitions.default};

  background-color: ${({ theme, $variant }) => ($variant === 'edit' ? theme.colors.info : theme.colors.danger)};
  color: ${({ theme }) => theme.colors.white};

  &:hover {
    filter: brightness(1.1);
    box-shadow: ${({ theme }) => theme.shadow.md};
  }

  &:focus {
    outline: none;
    box-shadow:
      ${({ theme }) => theme.shadow.md},
      0 0 0 2px ${({ theme }) => theme.colors.focus};
  }

  &:active {
    transform: scale(0.95);
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    transition: ${({ theme }) => theme.motion.reducedMotion.transitions};

    &:active {
      transform: none;
    }
  }
`
