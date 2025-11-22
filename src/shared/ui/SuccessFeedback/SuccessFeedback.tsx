import { motion, AnimatePresence } from 'motion/react'
import { Check } from 'lucide-react'
import Box from '../Box'
import Typography from '../Typography'
import { useMotionProps } from 'shared/hooks'
import styled from 'styled-components'

interface SuccessFeedbackProps {
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
        <Wrapper {...motionProps}>
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
              backgroundColor: '#10b981',
              color: 'white',
            }}
          >
            <motion.div {...iconMotionProps}>
              <Check size={24} />
            </motion.div>
            <Typography $color="white" $weight="medium">
              {message}
            </Typography>
          </Box>
        </Wrapper>
      )}
    </AnimatePresence>
  )
}

export default SuccessFeedback

const Wrapper = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  z-index: 9999;
  pointer-events: none;

  /* Performance optimizations */
  will-change: transform, opacity;
  backface-visibility: hidden;

  /* Ensure it works on all screen sizes */
  max-width: 90vw;
  max-height: 90vh;

  /* Enable pointer events for the content if needed */
  > * {
    pointer-events: auto;
  }
`
