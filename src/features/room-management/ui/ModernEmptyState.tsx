import styled from 'styled-components'
import { motion } from 'motion/react'

interface ModernEmptyStateProps {
  onCreateRoom: () => void
}

const Wrap = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${({ theme }) => theme.spacing.md};
  max-width: 380px;
  margin: ${({ theme }) => theme.spacing['4xl']} auto;
  padding: ${({ theme }) => theme.spacing.xl};
`

const Heading = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  letter-spacing: -0.015em;
  color: ${({ theme }) => theme.text};
`

const Hint = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grey[500]};
`

const Cta = styled.button`
  display: inline-flex;
  align-items: center;
  height: 36px;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border: 0;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.interactive};
  color: ${({ theme }) => theme.colors.white};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  cursor: pointer;
  transition: box-shadow 180ms ${({ theme }) => theme.motion.easing.easeOut};

  &:hover {
    box-shadow: 0 6px 16px ${({ theme }) => theme.colors.focusRing};
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadow.focusVisible};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

const ModernEmptyState = ({ onCreateRoom }: ModernEmptyStateProps) => (
  <Wrap
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
  >
    <Heading>No rooms yet</Heading>
    <Hint>Create a room, add the team, then spin the wheel.</Hint>
    <Cta type="button" onClick={onCreateRoom}>
      New room
    </Cta>
  </Wrap>
)

export default ModernEmptyState
