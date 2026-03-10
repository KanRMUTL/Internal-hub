import { useState } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from 'shared/lib/utils'
import { MotionDiv } from '../MotionWrapper'
import Button from '../Button'
import Box from '../Box'
import Typography from '../Typography'
import { useMotionConfig, useMotionProps, useInteractionProps } from 'shared/hooks'

const containerVariants = cva('flex flex-col gap-6 p-8 max-w-[500px] mx-auto')
const statusBoxVariants = cva('flex justify-between p-4 bg-white dark:bg-grey-800 rounded-md border border-grey-200')
const demoCardVariants = cva(
  'p-6 bg-surface-light dark:bg-surface-dark border border-grey-200 rounded-lg shadow-md text-center min-w-[250px]'
)
const instructionsBoxVariants = cva('p-4 bg-grey-50 dark:bg-grey-900 rounded-md border-l-4 border-info')

const MotionDemo = ({ className }: { className?: string }) => {
  const [isVisible, setIsVisible] = useState(true)
  const { prefersReducedMotion, shouldAnimate } = useMotionConfig()

  const cardMotionProps = useMotionProps({
    initial: { opacity: 0, y: 50, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -50, scale: 0.9 },
    transition: { duration: 0.5, ease: [0.4, 0.0, 0.2, 1] },
  })

  const buttonInteractionProps = useInteractionProps({
    whileHover: { scale: 1.05, y: -2 },
    whileTap: { scale: 0.95 },
  })

  return (
    <div className={cn(containerVariants({ className }))}>
      <Typography $size="lg" $weight="medium" $align="center">
        Motion Preferences Demo
      </Typography>

      <div className={statusBoxVariants()}>
        <Typography $size="sm" $color={prefersReducedMotion ? 'danger' : 'success'}>
          Reduced Motion: {prefersReducedMotion ? 'ON' : 'OFF'}
        </Typography>
        <Typography $size="sm" $color={shouldAnimate ? 'success' : 'danger'}>
          Animations: {shouldAnimate ? 'ENABLED' : 'DISABLED'}
        </Typography>
      </div>

      <Box $flex $direction="column" $gap="md" $align="center">
        <Button onClick={() => setIsVisible(!isVisible)}>{isVisible ? 'Hide' : 'Show'} Demo Card</Button>

        {isVisible && (
          <MotionDiv {...cardMotionProps}>
            <div className={demoCardVariants()}>
              <Typography $weight="medium">Animated Card</Typography>
              <Typography $size="sm" $color="muted">
                This card respects your motion preferences
              </Typography>

              <Box $flex $gap="sm" $justify="center" $pt="md">
                <MotionDiv {...buttonInteractionProps}>
                  <Button size="sm" variant="primary">
                    Hover Me
                  </Button>
                </MotionDiv>

                <MotionDiv {...buttonInteractionProps}>
                  <Button size="sm" variant="secondary">
                    Tap Me
                  </Button>
                </MotionDiv>
              </Box>
            </div>
          </MotionDiv>
        )}
      </Box>

      <div className={instructionsBoxVariants()}>
        <Typography $size="xs" $color="muted" $align="center">
          To test: Go to your browser settings and toggle "Reduce motion" preference, or use the accessibility settings
          in your OS.
        </Typography>
      </div>
    </div>
  )
}

export default MotionDemo
