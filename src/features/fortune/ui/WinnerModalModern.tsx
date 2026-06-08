import { useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import styled from 'styled-components'
import { Check, Dices, X } from 'lucide-react'
import { MotionWrapper } from 'shared/ui/MotionWrapper'
import { FocusTrap, LiveRegion } from 'shared/ui'
import { useBodyScrollLock } from 'shared/hooks'
import { memberAvatarText } from 'entities/member'

interface WinnerModalModernProps {
  open: boolean
  winner: { id: string; name: string; color: string } | null
  onSave: () => void
  onDiscard: () => void
  onSpinAgain: () => void
}

const Backdrop = styled(MotionWrapper).attrs({ as: 'div' })`
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

const Dialog = styled(MotionWrapper).attrs({ as: 'div' })`
  position: relative;
  width: 100%;
  max-width: 420px;
  /* The project default is box-sizing: content-box. Without border-box, the
     max-height would only cap the content area, and the dialog's visible box
     (content + 80px top + 32px bottom + 2px border) would still overflow the
     backdrop on short viewports. See FortuneHistoryListModern for the same
     pattern. */
  box-sizing: border-box;
  /* Constrain to the viewport minus the Backdrop's padding so the dialog
     can scroll internally on short viewports (mobile landscape, devtools
     open, etc.) instead of being clipped by the flex-centered backdrop. */
  max-height: calc(100vh - ${({ theme }) => theme.spacing.lg} * 2);
  min-height: 0;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing['5xl']} ${({ theme }) => theme.spacing.lg}
    ${({ theme }) => theme.spacing['2xl']};
  background: ${({ theme }) => theme.background.surface};
  border: 1px solid ${({ theme }) => theme.colors.grey[100]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
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

const AvatarFrame = styled(MotionWrapper).attrs({ as: 'div' })`
  position: relative;
  width: 96px;
  height: 96px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Avatar = styled.div<{ $color: string; $textColor: string }>`
  position: relative;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 38px;
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ $textColor }) => $textColor};
  background: ${({ $color }) => $color};
  border: 2px solid ${({ theme }) => theme.background.surface};
  z-index: 1;
`

const CheckBadge = styled(MotionWrapper).attrs({ as: 'div' })`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.interactive};
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${({ theme }) => theme.background.surface};
  z-index: 2;
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

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
`

const PrimaryBtn = styled(motion.button)`
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 44px;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border: 0;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.interactive};
  color: ${({ theme }) => theme.colors.white};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  letter-spacing: -0.005em;
  cursor: pointer;
  transition: background-color 180ms ${({ theme }) => theme.motion.easing.easeOut};

  &:hover:not(:disabled) {
    filter: brightness(0.95);
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadow.focusVisible};
  }
`

const SecondaryBtn = styled(motion.button)`
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 44px;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.grey[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.background.surface};
  color: ${({ theme }) => theme.colors.grey[600]};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  letter-spacing: -0.005em;
  cursor: pointer;
  transition:
    background-color 180ms ${({ theme }) => theme.motion.easing.easeOut},
    border-color 180ms ${({ theme }) => theme.motion.easing.easeOut},
    color 180ms ${({ theme }) => theme.motion.easing.easeOut};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.hover};
    border-color: ${({ theme }) => theme.colors.grey[300]};
    color: ${({ theme }) => theme.text};
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
  align-self: center;
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
  // The dialog is aria-modal but lives in a portal-less tree, so the page
  // behind it would still scroll. Lock body scroll while the modal is open.
  useBodyScrollLock(open)

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e: KeyboardEvent) => {
      // Don't hijack typing in any input/textarea/contenteditable on the page.
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
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
            <FocusTrap
              isActive={open}
              initialFocus="[data-testid='winner-modal-save']"
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              <CloseBtn type="button" onClick={onDiscard} aria-label="Close" whileTap={{ scale: 0.92 }}>
                <X size={24} strokeWidth={2} aria-hidden="true" />
              </CloseBtn>

              <AvatarFrame
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.12, duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              >
                <Avatar $color={winner.color} $textColor={memberAvatarText(winner.name)} aria-hidden="true">
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

              <Name id="winner-name">{winner.name}</Name>

              <Actions>
                <PrimaryBtn
                  type="button"
                  onClick={onSave}
                  data-testid="winner-modal-save"
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.01 }}
                >
                  Save to history
                </PrimaryBtn>
                <SecondaryBtn
                  type="button"
                  onClick={onDiscard}
                  data-testid="winner-modal-discard"
                  whileTap={{ scale: 0.97 }}
                >
                  Discard
                </SecondaryBtn>
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
            </FocusTrap>
            <LiveRegion message={open ? `${winner.name} is up` : ''} politeness="polite" />
          </Dialog>
        </Backdrop>
      )}
    </AnimatePresence>
  )
}

export default WinnerModalModern
