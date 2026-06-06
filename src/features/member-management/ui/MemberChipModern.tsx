import { motion } from 'motion/react'
import styled, { css } from 'styled-components'
import { EyeOff, Sparkles } from 'lucide-react'

interface MemberChipModernProps {
  name: string
  hue: number
  isHighlighted?: boolean
  isActive?: boolean
  delay?: number
}

const Chip = styled(motion.div)<{ $highlighted: boolean; $inactive: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: 6px 12px 6px 6px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ theme, $highlighted }) => ($highlighted ? theme.colors.focus : theme.background.surface)};
  border: 1px solid ${({ theme }) => theme.colors.grey[200]};
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

const Avatar = styled.span<{ $hue: number }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ $hue }) => `oklch(78% 0.10 ${$hue})`};
  color: ${({ $hue }) => `oklch(30% 0.08 ${$hue})`};
  font-size: 11px;
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  flex-shrink: 0;
`

const MemberChipModern = ({ name, hue, isHighlighted = false, isActive = true, delay = 0 }: MemberChipModernProps) => {
  const initial = name.trim().charAt(0).toUpperCase() || '?'
  return (
    <Chip
      $highlighted={isHighlighted}
      $inactive={!isActive}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
    >
      <Avatar $hue={hue} aria-hidden="true">
        {initial}
      </Avatar>
      <span className="chip-name">{name}</span>
      {isHighlighted && isActive && <Sparkles size={12} strokeWidth={2} aria-hidden="true" />}
      {!isActive && <EyeOff size={12} strokeWidth={1.75} aria-hidden="true" />}
    </Chip>
  )
}

export default MemberChipModern
