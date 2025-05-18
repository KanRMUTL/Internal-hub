import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import styled from 'styled-components'
import { Alert } from 'shared/ui'
import { ColorKeys } from 'shared/styles'

type FlashAlertProps = {
  type?: ColorKeys
  message: string
  visible: boolean
  duration?: number
  onClose: () => void
}

type FlashAlertState = {
  type: ColorKeys
  message: string
}

export const useFlashAlert = () => {
  const [state, set] = useState<FlashAlertState>({ type: 'success', message: '' })

  const reset = () => {
    set({ type: 'success', message: '' })
  }

  return {
    state,
    set,
    reset,
  }
}

const FlashAlert = ({ type = 'info', message, visible, duration = 3000, onClose }: FlashAlertProps) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [visible, duration, onClose])

  return (
    <Wrapper>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Alert $type={type}>{message}</Alert>
          </motion.div>
        )}
      </AnimatePresence>
    </Wrapper>
  )
}

export default FlashAlert

const Wrapper = styled.div`
  position: fixed;
  top: 12px;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`
