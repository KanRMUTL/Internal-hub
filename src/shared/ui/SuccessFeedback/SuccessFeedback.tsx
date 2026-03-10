import { motion, AnimatePresence } from 'motion/react'
import { Check } from 'lucide-react'
import Box from '../Box'
import Typography from '../Typography'
import { useMotionProps } from 'shared/hooks'
import { cva, type VariantProps } from 'class-variance-authority'

const successFeedbackVariants = cva(
  'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] pointer-events-none will-change-[transform,opacity] backface-hidden max-w-[90vw] max-h-[90vh] [&>*]:pointer-events-auto'
)

interface SuccessFeedbackProps extends VariantProps<typeof successFeedbackVariants> {
  visible: boolean
  message: string
  onComplete?: () => void
}

const SuccessFeedback = ({ visible, message, onComplete }: SuccessFeedbackProps) => {
  const motionProps = useMotionProps({
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 },
    transition: {
      duration: 0.25,
      ease: [0.4, 0.0, 0.2, 1],
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  })

  const iconMotionProps = useMotionProps({
    initial: { scale: 0 },
    animate: { scale: 1 },
    transition: {
      delay: 0.1,
      duration: 0.2,
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  })

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div className={successFeedbackVariants()} {...motionProps}>
          <Box
            $flex
            $align="center"
            $justify="center"
            $gap="sm"
            $p="lg"
            $bg="primary"
            $radius="lg"
            $shadow="xl"
            style={{
              backgroundColor: '#1e8a42', // WCAG AA compliant success color
              color: '#ffffff',
            }}
          >
            <motion.div {...iconMotionProps}>
              <Check size={24} />
            </motion.div>
            <Typography $color="white" $weight="medium">
              {message}
            </Typography>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SuccessFeedback
