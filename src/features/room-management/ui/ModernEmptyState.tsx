import styled from 'styled-components'
import { motion } from 'motion/react'
import { Sparkles } from 'lucide-react'

interface ModernEmptyStateProps {
  onCreateRoom: () => void
}

const Wrap = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl} ${({ theme }) => theme.spacing.lg};
  max-width: 460px;
  margin: 0 auto;
  gap: ${({ theme }) => theme.spacing.md};
`

const Illustration = styled(motion.div)`
  position: relative;
  width: 96px;
  height: 96px;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const Ring = styled(motion.div)<{ $size: number; $delay: number; $hue: number }>`
  position: absolute;
  inset: ${({ $size }) => `(${(96 - $size) / 2}px)`};
  border-radius: 50%;
  border: 1px solid ${({ $hue }) => `oklch(82% 0.04 ${$hue})`};
`

const Spoke = styled(motion.div)<{ $rotate: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1px;
  height: 38px;
  background: ${({ theme }) => theme.colors.grey[200]};
  transform-origin: top center;
  transform: translate(-50%, 0) rotate(${({ $rotate }) => $rotate}deg);
`

const Core = styled(motion.div)`
  position: absolute;
  inset: 36px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  box-shadow: 0 0 0 4px ${({ theme }) => theme.colors.focus};
`

const Heading = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.text};
`

const Hint = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.grey[500]};
  max-width: 36ch;
`

const Cta = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 0;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.primary};
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

const ModernEmptyState = ({ onCreateRoom }: ModernEmptyStateProps) => {
  const spokeAngles = [0, 60, 120, 180, 240, 300]
  return (
    <Wrap
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <Illustration>
        {[88, 64, 40].map((size, i) => (
          <Ring
            key={size}
            $size={size}
            $delay={i * 0.15}
            $hue={180 + i * 12}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
          />
        ))}
        {spokeAngles.map((angle) => (
          <Spoke key={angle} $rotate={angle} />
        ))}
        <Core
          animate={{ scale: [1, 1.15, 1], opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </Illustration>
      <Heading>No rooms yet</Heading>
      <Hint>Spin up your first room, add the team, and let the wheel pick who&apos;s up next.</Hint>
      <Cta type="button" onClick={onCreateRoom} whileTap={{ scale: 0.97 }}>
        <Sparkles size={14} strokeWidth={2} aria-hidden="true" />
        Create your first room
      </Cta>
    </Wrap>
  )
}

export default ModernEmptyState
