import { motion } from 'motion/react'
import React from 'react'
import { useMotionPreference } from 'shared/hooks'
import { createMotionTransition } from 'shared/styles/utils/motionUtils'

interface WithMotionProps {
  children: React.ReactNode
  initial?: Record<string, string | number>
  animate?: Record<string, string | number>
  exit?: Record<string, string | number>
  whileHover?: Record<string, string | number>
  whileTap?: Record<string, string | number>
  transition?: Record<string, string | number | number[]>
}

const withMotion = (children: React.ReactNode) => (
  <MotionWrapper
    initial={{ scale: 0.5, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 1.1 }}
  >
    {children}
  </MotionWrapper>
)

/**
 * Motion-aware wrapper component that respects user preferences
 */
export const MotionWrapper: React.FC<WithMotionProps> = ({
  children,
  initial = { scale: 0.5, opacity: 0 },
  animate = { scale: 1, opacity: 1 },
  exit = { scale: 0.5, opacity: 0 },
  whileHover = { scale: 1.1 },
  whileTap = { scale: 1.1 },
  transition,
}) => {
  const prefersReducedMotion = useMotionPreference()

  // If user prefers reduced motion, use static states
  if (prefersReducedMotion) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0 }}>
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={initial}
      animate={animate}
      exit={exit}
      whileHover={whileHover}
      whileTap={whileTap}
      transition={transition || createMotionTransition('medium', 'easeOut')}
    >
      {children}
    </motion.div>
  )
}

export default withMotion
