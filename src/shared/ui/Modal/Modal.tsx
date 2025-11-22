import { ReactNode, MouseEvent, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { motion, AnimatePresence } from 'motion/react'
import { FocusTrap } from 'shared/ui/FocusTrap'
import { createInteractionProps, createPerformantMotionProps } from 'shared/styles/utils'
import { useMotionPreference } from 'shared/hooks'
import { X } from 'lucide-react'
import Typography from '../Typography'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  $size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'fullscreen'
  $closeOnBackdrop?: boolean
  $showCloseButton?: boolean
  title?: string
}

const Modal = ({
  isOpen,
  onClose,
  children,
  $size = 'md',
  $closeOnBackdrop = true,
  $showCloseButton = true,
  title,
}: ModalProps) => {
  const prefersReducedMotion = useMotionPreference()

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if ($closeOnBackdrop && e.target === e.currentTarget) {
      onClose()
    }
  }

  // Performance-optimized motion configurations
  const backdropProps = createPerformantMotionProps({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  })

  const modalProps = createPerformantMotionProps({
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 20 },
  })

  const closeButtonProps = createInteractionProps({
    whileHover: { scale: 1.1 },
    whileTap: { scale: 0.9 },
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'

      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        document.body.style.overflow = 'unset'
      }
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <Backdrop onClick={handleBackdropClick} {...backdropProps}>
          <FocusTrap isActive={isOpen} initialFocus={$showCloseButton ? '[aria-label="Close modal"]' : undefined}>
            <ModalContainer
              $size={$size}
              {...modalProps}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? 'modal-title' : undefined}
              aria-describedby={title ? undefined : 'modal-content'}
            >
              <ModalHeader>
                {title && <ModalTitle id="modal-title">{title}</ModalTitle>}
                {$showCloseButton && (
                  <>
                    <Typography></Typography>
                    <CloseButton
                      onClick={onClose}
                      aria-label="Close modal"
                      {...closeButtonProps}
                      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.15 }}
                    >
                      <X size={18} />
                    </CloseButton>
                  </>
                )}
              </ModalHeader>

              <ModalContent $hasHeader={!!title} id={title ? undefined : 'modal-content'}>
                {children}
              </ModalContent>
            </ModalContainer>
          </FocusTrap>
        </Backdrop>
      )}
    </AnimatePresence>
  )
}

export default Modal

const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.background.overlay};
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  padding: ${({ theme }) => theme.spacing.md};

  /* Ensure proper stacking */
  isolation: isolate;

  /* Performance optimizations */
  will-change: opacity;
  backface-visibility: hidden;
`

const ModalContainer = styled(motion.div)<{ $size: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'fullscreen' }>`
  background: ${({ theme }) => theme.background.surface};
  border: 1px solid ${({ theme }) => theme.colors.grey[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadow.xl};
  position: relative;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  /* Performance optimizations */
  will-change: transform, opacity;
  backface-visibility: hidden;

  /* Size variants */
  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return css`
          width: 100%;
          max-width: 400px;
        `
      case 'md':
        return css`
          width: 100%;
          max-width: 500px;
        `
      case 'lg':
        return css`
          width: 100%;
          max-width: 700px;
        `
      case 'xl':
        return css`
          width: 100%;
          max-width: 900px;
        `
      case 'xxl':
        return css`
          width: 1200px;
          max-width: 90vw;
        `
      case 'fullscreen':
        return css`
          width: 100vw;
          height: 100vh;
          max-width: none;
          max-height: none;
          border-radius: 0;
        `
      default:
        return css`
          width: 100%;
          max-width: 500px;
        `
    }
  }}

  /* Mobile-first responsive behavior */
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    ${({ $size }) =>
      $size !== 'fullscreen' &&
      css`
        width: 100vw;
        height: 100vh;
        max-width: none;
        max-height: none;
        border-radius: 0;
        margin: 0;
      `}
  }

  /* Dark theme enhancements */
  ${({ theme }) =>
    theme.mode === 'dark' &&
    css`
      border-color: ${theme.colors.grey[700]};
      box-shadow:
        ${theme.shadow.xl},
        0 0 0 1px rgba(255, 255, 255, 0.05);
    `}
`

const CloseButton = styled(motion.button)`
  width: 32px;
  height: 32px;
  border: none;
  background: ${({ theme }) => theme.colors.grey[100]};
  color: ${({ theme }) => theme.colors.grey[600]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-self: flex-end;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  z-index: 1;
  transition: ${({ theme }) => theme.motion.transitions.colors};

  &:hover {
    background: ${({ theme }) => theme.colors.grey[200]};
    color: ${({ theme }) => theme.colors.grey[800]};
  }

  &:focus {
    outline: none;
  }

  /* Dark theme */
  ${({ theme }) =>
    theme.mode === 'dark' &&
    css`
      background: ${theme.colors.grey[800]};
      color: ${theme.colors.grey[400]};

      &:hover {
        background: ${theme.colors.grey[700]};
        color: ${theme.colors.grey[200]};
      }
    `}

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    transition: ${({ theme }) => theme.motion.reducedMotion.transitions};
  }
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.grey[200]};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  ${({ theme }) =>
    theme.mode === 'dark' &&
    css`
      border-bottom-color: ${theme.colors.grey[700]};
    `}
`

const ModalTitle = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.text};
  line-height: 1.2;
`

const ModalContent = styled.div<{ $hasHeader?: boolean }>`
  padding: ${({ theme, $hasHeader }) => ($hasHeader ? `0 ${theme.spacing.lg} ${theme.spacing.lg}` : theme.spacing.md)};
  overflow-y: auto;
  flex: 1;

  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.grey[100]};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.grey[300]};
    border-radius: 3px;

    &:hover {
      background: ${({ theme }) => theme.colors.grey[400]};
    }
  }

  /* Dark theme scrollbar */
  ${({ theme }) =>
    theme.mode === 'dark' &&
    css`
      &::-webkit-scrollbar-track {
        background: ${theme.colors.grey[800]};
      }

      &::-webkit-scrollbar-thumb {
        background: ${theme.colors.grey[600]};

        &:hover {
          background: ${theme.colors.grey[500]};
        }
      }
    `}
`
