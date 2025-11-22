import { ReactNode } from 'react'
import { motion, MotionProps } from 'motion/react'
import { useMotionPreference } from 'shared/hooks'

interface MotionWrapperProps extends Omit<MotionProps, 'children'> {
  children: ReactNode
  as?: keyof typeof motion
  fallbackOpacity?: boolean
}

/**
 * Motion wrapper that automatically respects user's reduced motion preferences
 * Provides fallback behavior for users who prefer reduced motion
 */
const MotionWrapper = ({
  children,
  as = 'div',
  initial,
  animate,
  exit,
  whileHover,
  whileTap,
  whileFocus,
  whileInView,
  transition,
  fallbackOpacity = true,
  ...rest
}: MotionWrapperProps) => {
  const prefersReducedMotion = useMotionPreference()
  const MotionComponent = motion[as] as React.ComponentType<MotionProps>

  if (prefersReducedMotion) {
    // Provide minimal animation for reduced motion users
    const reducedProps = {
      initial: fallbackOpacity ? { opacity: 0 } : undefined,
      animate: fallbackOpacity ? { opacity: 1 } : undefined,
      exit: fallbackOpacity ? { opacity: 0 } : undefined,
      transition: { duration: 0 },
      ...rest,
    }

    return <MotionComponent {...reducedProps}>{children}</MotionComponent>
  }

  // Full motion for users who prefer animations
  return (
    <MotionComponent
      initial={initial}
      animate={animate}
      exit={exit}
      whileHover={whileHover}
      whileTap={whileTap}
      whileFocus={whileFocus}
      whileInView={whileInView}
      transition={transition}
      {...rest}
    >
      {children}
    </MotionComponent>
  )
}

MotionWrapper.displayName = 'MotionWrapper'

export default MotionWrapper

/**
 * Pre-configured motion components that respect reduced motion preferences
 */
export const MotionDiv = (props: MotionWrapperProps) => <MotionWrapper as="div" {...props} />

export const MotionButton = (props: MotionWrapperProps) => <MotionWrapper as="button" {...props} />

export const MotionSpan = (props: MotionWrapperProps) => <MotionWrapper as="span" {...props} />
