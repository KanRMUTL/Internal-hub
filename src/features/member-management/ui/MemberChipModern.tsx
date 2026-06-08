import { motion } from 'motion/react'
import styled, { css } from 'styled-components'
import { EyeOff, Sparkles } from 'lucide-react'
import { memberAvatarText } from 'entities/member'

interface MemberChipModernProps {
  name: string
  color: string
  isHighlighted?: boolean
  isActive?: boolean
  delay?: number
}

const Chip = styled(motion.div)<{ $highlighted: boolean; $inactive: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: 6px 12px 6px 6px;
  color: ${({ theme }) => theme.text};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  letter-spacing: -0.005em;
  transition:
    border-color 200ms ${({ theme }) => theme.motion.easing.easeOut},
    background-color 200ms ${({ theme }) => theme.motion.easing.easeOut},
    opacity 200ms ${({ theme }) => theme.motion.easing.easeOut};

  ${({ $inactive }) =>
    $inactive &&
    css`
      opacity: 0.55;
      background: transparent;
      .chip-name {
        text-decoration: line-through;
        text-decoration-color: oklch(75% 0.005 180);
        text-decoration-thickness: 1px;
      }
    `}
`

const Avatar = styled.span<{ $color: string; $textColor: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  color: ${({ $textColor }) => $textColor};
  font-size: ${({ theme }) => theme.fontSizes.micro};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  flex-shrink: 0;
`

const MemberChipModern = ({ name, color, isHighlighted = false, isActive = true, delay = 0 }: MemberChipModernProps) => {
  const initial = name.trim().charAt(0).toUpperCase() || '?'
  return (
    <Chip
      $highlighted={isHighlighted}
      $inactive={!isActive}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
    >
      <Avatar $color={color} $textColor={memberAvatarText(name)} aria-hidden="true">
        {initial}
      </Avatar>
      <span className="chip-name">{name}</span>
      {isHighlighted && isActive && <Sparkles size={12} strokeWidth={2} aria-hidden="true" />}
      {!isActive && <EyeOff size={12} strokeWidth={1.75} aria-hidden="true" />}
    </Chip>
  )
}

export default MemberChipModern
