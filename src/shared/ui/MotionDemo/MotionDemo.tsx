import { useState } from 'react'
import styled from 'styled-components'
import { MotionDiv } from '../MotionWrapper'
import Button from '../Button'
import Box from '../Box'
import Typography from '../Typography'
import { useMotionConfig, useMotionProps, useInteractionProps } from 'shared/hooks'

/**
 * Demo component to test motion preferences
 * This component can be temporarily added to pages for testing
 */
const MotionDemo = () => {
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
    <DemoContainer>
      <Typography $size="lg" $weight="semibold" $align="center">
        Motion Preferences Demo
      </Typography>

      <StatusBox>
        <Typography $size="sm" $color={prefersReducedMotion ? 'danger' : 'success'}>
          Reduced Motion: {prefersReducedMotion ? 'ON' : 'OFF'}
        </Typography>
        <Typography $size="sm" $color={shouldAnimate ? 'success' : 'danger'}>
          Animations: {shouldAnimate ? 'ENABLED' : 'DISABLED'}
        </Typography>
      </StatusBox>

      <Box $flex $direction="column" $gap="md" $align="center">
        <Button onClick={() => setIsVisible(!isVisible)}>{isVisible ? 'Hide' : 'Show'} Demo Card</Button>

        {isVisible && (
          <MotionDiv {...cardMotionProps}>
            <DemoCard>
              <Typography $weight="medium">Animated Card</Typography>
              <Typography $size="sm" $color="grey">
                This card respects your motion preferences
              </Typography>

              <Box $flex $gap="sm" $justify="center" $pt="md">
                <MotionDiv {...buttonInteractionProps}>
                  <Button $size="sm" $variant="primary">
                    Hover Me
                  </Button>
                </MotionDiv>

                <MotionDiv {...buttonInteractionProps}>
                  <Button $size="sm" $variant="secondary">
                    Tap Me
                  </Button>
                </MotionDiv>
              </Box>
            </DemoCard>
          </MotionDiv>
        )}
      </Box>

      <InstructionsBox>
        <Typography $size="xs" $color="grey" $align="center">
          To test: Go to your browser settings and toggle "Reduce motion" preference, or use the accessibility settings
          in your OS.
        </Typography>
      </InstructionsBox>
    </DemoContainer>
  )
}

export default MotionDemo

const DemoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  max-width: 500px;
  margin: 0 auto;
`

const StatusBox = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.background.elevated};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.grey[200]};
`

const DemoCard = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.background.surface};
  border: 1px solid ${({ theme }) => theme.colors.grey[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadow.md};
  text-align: center;
  min-width: 250px;
`

const InstructionsBox = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.grey[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border-left: 4px solid ${({ theme }) => theme.colors.info};
`
