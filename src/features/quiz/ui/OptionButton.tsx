import styled, { css } from 'styled-components'
import { motion } from 'motion/react'

interface OptionButtonProps {
  text: string
  color: string
  selected?: boolean
  disabled?: boolean
  onClick: () => void
}

export const OptionButton = ({ text, color, selected, disabled, onClick }: OptionButtonProps) => {
  return (
    <StyledButton
      $color={color}
      $selected={selected}
      $disabled={disabled}
      onClick={onClick}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: 0.95 }}
    >
      {text}
    </StyledButton>
  )
}

const StyledButton = styled(motion.button)<{ $color: string; $selected?: boolean; $disabled?: boolean }>`
  width: 100%;
  padding: 1.5rem;
  border: none;
  border-radius: 16px;
  background-color: ${({ $color }) => $color};
  color: white;
  font-size: 1.25rem;
  font-weight: bold;
  cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};
  opacity: ${({ $disabled, $selected }) => ($disabled && !$selected ? 0.3 : 1)};
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  &:active {
    transform: ${({ $disabled }) => ($disabled ? 'none' : 'translateY(4px)')};
    box-shadow: ${({ $disabled }) => ($disabled ? '0 4px 0 rgba(0, 0, 0, 0.2)' : 'none')};
  }

  ${({ $selected }) =>
    $selected &&
    css`
      transform: translateY(4px);
      box-shadow: none;
      ring: 4px solid white;
    `}
`
