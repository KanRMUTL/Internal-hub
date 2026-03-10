import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Alert from '../Alert'
import { ColorKeys } from 'shared/styles'
import { cva, type VariantProps } from 'class-variance-authority'

const flashAlertVariants = cva('fixed top-3 left-1/2 -translate-x-1/2 z-[1000] flex flex-col gap-2')

type FlashAlertProps = {
  type?: ColorKeys
  message: string
  visible: boolean
  duration?: number
  onClose: () => void
} & VariantProps<typeof flashAlertVariants>

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
    <div className={flashAlertVariants()}>
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
    </div>
  )
}

export default FlashAlert
