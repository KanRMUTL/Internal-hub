import { ReactNode, MouseEvent } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'motion/react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Backdrop
          onClick={handleBackdropClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <ModalContainer
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </ModalContainer>
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
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`

const ModalContainer = styled(motion.div)`
  background: ${({ theme }) => theme.background.surface};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  position: relative;
  width: 70%;

  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 50%;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 40%;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    width: 40%;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.widescreen}) {
    width: 30%;
  }
`
