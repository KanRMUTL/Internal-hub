import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import styled from 'styled-components'
import { Check, X, Dices } from 'lucide-react'

interface WinnerModalModernProps {
  open: boolean
  winner: { id: string; name: string; hue: number } | null
  onSave: () => void
  onDiscard: () => void
  onSpinAgain: () => void
}

const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.background.overlay};
  backdrop-filter: blur(8px);
`

const Dialog = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 420px;
  padding: ${({ theme }) => theme.spacing.xxl} ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.background.surface};
  border: 1px solid ${({ theme }) => theme.colors.grey[100]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.18);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`

const CloseBtn = styled(motion.button)`
  position: absolute;
  top: ${({ theme }) => theme.spacing.sm};
  right: ${({ theme }) => theme.spacing.sm};
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: transparent;
  color: ${({ theme }) => theme.colors.grey[500]};
  cursor: pointer;
  transition: background-color 160ms ${({ theme }) => theme.motion.easing.easeOut};

  &:hover {
    background: ${({ theme }) => theme.colors.hover};
    color: ${({ theme }) => theme.text};
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadow.focusVisible};
  }
`

const AvatarFrame = styled(motion.div)`
  position: relative;
  width: 96px;
  height: 96px;
  margin-top: ${({ theme }) => theme.spacing.sm};
`

const AvatarGlow = styled(motion.div)`
  position: absolute;
  inset: -10px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.secondary},
    ${({ theme }) => theme.colors.success},
    ${({ theme }) => theme.colors.primary}
  );
  opacity: 0.35;
  filter: blur(10px);
  z-index: 0;
`

const Avatar = styled.div<{ $hue: number }>`
  position: relative;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 38px;
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ $hue }) => `oklch(30% 0.08 ${$hue})`};
  background: ${({ $hue }) => `oklch(82% 0.10 ${$hue})`};
  border: 2px solid ${({ theme }) => theme.background.surface};
  z-index: 1;
`

const CheckBadge = styled(motion.div)`
  position: absolute;
  right: -2px;
  bottom: -2px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${({ theme }) => theme.background.surface};
  z-index: 2;
`

const Eyebrow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  font-size: 11px;
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.focus};
  border-radius: ${({ theme }) => theme.borderRadius.full};
`

const Name = styled.h2`
  margin: 0;
  font-size: 32px;
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  letter-spacing: -0.025em;
  line-height: 1.1;
  color: ${({ theme }) => theme.text};
  text-wrap: balance;
`

const Sub = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.base};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grey[500]};
  max-width: 30ch;
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.sm};
`

const PrimaryBtn = styled(motion.button)`
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 44px;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border: 0;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  letter-spacing: -0.005em;
  cursor: pointer;
  transition:
    background-color 180ms ${({ theme }) => theme.motion.easing.easeOut},
    box-shadow 180ms ${({ theme }) => theme.motion.easing.easeOut};

  &:hover:not(:disabled) {
    box-shadow: 0 6px 16px ${({ theme }) => theme.colors.focusRing};
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadow.focusVisible};
  }
`

const GhostBtn = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.grey[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.background.surface};
  color: ${({ theme }) => theme.text};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  cursor: pointer;
  transition:
    background-color 180ms ${({ theme }) => theme.motion.easing.easeOut},
    border-color 180ms ${({ theme }) => theme.motion.easing.easeOut};

  &:hover {
    background: ${({ theme }) => theme.colors.hover};
    border-color: ${({ theme }) => theme.colors.grey[300]};
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadow.focusVisible};
  }
`

const SpinAgainBtn = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  width: 44px;
  border: 1px solid ${({ theme }) => theme.colors.grey[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.background.surface};
  color: ${({ theme }) => theme.text};
  font-family: inherit;
  cursor: pointer;
  flex-shrink: 0;
  transition:
    background-color 180ms ${({ theme }) => theme.motion.easing.easeOut},
    border-color 180ms ${({ theme }) => theme.motion.easing.easeOut};

  &:hover {
    background: ${({ theme }) => theme.colors.hover};
    border-color: ${({ theme }) => theme.colors.grey[300]};
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadow.focusVisible};
  }
`

const Shortcuts = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSizes.caption};
  color: ${({ theme }) => theme.colors.grey[500]};
`

const Kbd = styled.kbd`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 20px;
  padding: 0 5px;
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace;
  font-size: 10.5px;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.grey[600]};
  background: ${({ theme }) => theme.colors.grey[100]};
  border: 1px solid ${({ theme }) => theme.colors.grey[200]};
  border-bottom-width: 2px;
  border-radius: 4px;
  margin-right: 4px;
`

const WinnerModalModern = ({ open, winner, onSave, onDiscard, onSpinAgain }: WinnerModalModernProps) => {
  const saveRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => saveRef.current?.focus(), 60)
      return () => window.clearTimeout(t)
    }
    return undefined
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onDiscard()
      } else if (e.key === 'Enter') {
        e.preventDefault()
        onSave()
      } else if (e.key.toLowerCase() === 's') {
        e.preventDefault()
        onSpinAgain()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onSave, onDiscard, onSpinAgain])

  return (
    <AnimatePresence>
      {open && winner && (
        <Backdrop
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onDiscard}
          role="presentation"
        >
          <Dialog
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="winner-name"
          >
            <CloseBtn type="button" onClick={onDiscard} aria-label="Close" whileTap={{ scale: 0.92 }}>
              <X size={16} strokeWidth={2} aria-hidden="true" />
            </CloseBtn>

            <AvatarFrame
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.12, duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            >
              <AvatarGlow
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                aria-hidden="true"
              />
              <Avatar $hue={winner.hue} aria-hidden="true">
                {winner.name.charAt(0).toUpperCase()}
              </Avatar>
              <CheckBadge
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 400, damping: 18 }}
                aria-hidden="true"
              >
                <Check size={16} strokeWidth={2.5} />
              </CheckBadge>
            </AvatarFrame>

            <Eyebrow>You're up</Eyebrow>
            <Name id="winner-name">{winner.name}</Name>
            <Sub>Time to take the wheel. Save the result or spin for someone else.</Sub>

            <Actions>
              <PrimaryBtn
                ref={saveRef}
                type="button"
                onClick={onSave}
                data-testid="winner-modal-save"
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.01 }}
              >
                Save to history
              </PrimaryBtn>
              <GhostBtn type="button" onClick={onDiscard} data-testid="winner-modal-discard" whileTap={{ scale: 0.97 }}>
                Discard
              </GhostBtn>
              <SpinAgainBtn
                type="button"
                onClick={onSpinAgain}
                data-testid="winner-modal-spin-again"
                aria-label="Spin again"
                whileTap={{ scale: 0.94 }}
                whileHover={{ rotate: 90 }}
              >
                <Dices size={16} strokeWidth={1.75} aria-hidden="true" />
              </SpinAgainBtn>
            </Actions>

            <Shortcuts>
              <span>
                <Kbd>⏎</Kbd>save
              </span>
              <span>
                <Kbd>S</Kbd>spin again
              </span>
              <span>
                <Kbd>Esc</Kbd>discard
              </span>
            </Shortcuts>
          </Dialog>
        </Backdrop>
      )}
    </AnimatePresence>
  )
}

export default WinnerModalModern
