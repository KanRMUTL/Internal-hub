import { useMemo } from 'react'
import { useMotionPreference } from './useMotionPreference'
import { motion } from 'shared/styles/config'

/**
 * Hook that provides motion configuration based on user preferences and device capabilities
 * Returns motion-aware values for animations and transitions with performance optimizations
 */
export const useMotionConfig = () => {
  const prefersReducedMotion = useMotionPreference()

  const motionConfig = useMemo(() => {
    if (prefersReducedMotion) {
      return {
        // Reduced motion configuration
        duration: {
          fast: '0ms',
          medium: '0ms',
          slow: '0ms',
        },
        easing: {
          easeOut: 'linear',
          easeIn: 'linear',
          easeInOut: 'linear',
          bounce: 'linear',
        },
        scale: {
          hover: '1',
          active: '1',
          focus: '1',
        },
        transitions: {
          default: 'none',
          fast: 'none',
          slow: 'none',
          transform: 'none',
          opacity: 'opacity 0ms linear',
          colors: 'background-color 0ms linear, border-color 0ms linear, color 0ms linear',
          transformOpacity: 'none',
          boxShadow: 'none',
        },
        performance: {
          willChange: 'auto',
          hardwareAcceleration: false,
        },
        // Framer Motion specific
        framerTransition: { duration: 0 },
        // Animation states
        shouldAnimate: false,
        // CSS animation
        animationPlayState: 'paused' as const,
      }
    }

    return {
      // Full motion configuration with performance optimizations
      duration: motion.duration,
      easing: motion.easing,
      scale: motion.scale,
      transitions: motion.transitions,
      performance: {
        willChange: motion.performance.willChange,
        hardwareAcceleration: true,
      },
      // Optimized Framer Motion configuration
      framerTransition: {
        duration: 0.18, // Optimized from 0.25 for better performance
        ease: [0.165, 0.84, 0.44, 1], // Optimized easing curve
      },
      // Animation states
      shouldAnimate: true,
      // CSS animation
      animationPlayState: 'running' as const,
    }
  }, [prefersReducedMotion])

  return {
    ...motionConfig,
    prefersReducedMotion,
  }
}

/**
 * Hook that returns motion-aware CSS transition string
 */
export const useMotionTransition = (
  properties: string | string[],
  duration: keyof typeof motion.duration = 'medium',
  easing: keyof typeof motion.easing = 'easeInOut'
) => {
  const { prefersReducedMotion } = useMotionConfig()

  return useMemo(() => {
    if (prefersReducedMotion) {
      return 'none'
    }

    const props = Array.isArray(properties) ? properties.join(', ') : properties
    return `${props} ${motion.duration[duration]} ${motion.easing[easing]}`
  }, [properties, duration, easing, prefersReducedMotion])
}

/**
 * Hook that returns motion-aware Framer Motion props
 */
export const useMotionProps = (props: {
  initial?: Record<string, string | number>
  animate?: Record<string, string | number>
  exit?: Record<string, string | number>
  whileHover?: Record<string, string | number>
  whileTap?: Record<string, string | number>
  transition?: Record<string, string | number | number[]>
}) => {
  const { prefersReducedMotion, framerTransition } = useMotionConfig()

  return useMemo(() => {
    if (prefersReducedMotion) {
      return {
        initial: { opacity: props.initial?.opacity ?? 0 },
        animate: { opacity: props.animate?.opacity ?? 1 },
        exit: { opacity: props.exit?.opacity ?? 0 },
        transition: { duration: 0 },
      }
    }

    return {
      ...props,
      transition: props.transition || framerTransition,
    }
  }, [props, prefersReducedMotion, framerTransition])
}

/**
 * Hook that returns motion-aware interaction props (hover, tap, etc.)
 */
export const useInteractionProps = (props: {
  whileHover?: Record<string, string | number>
  whileTap?: Record<string, string | number>
  whileFocus?: Record<string, string | number>
}) => {
  const { prefersReducedMotion } = useMotionConfig()

  return useMemo(() => {
    if (prefersReducedMotion) {
      return {}
    }
    return props
  }, [props, prefersReducedMotion])
}

/**
 * Hook for performance-optimized will-change management
 */
export const useWillChange = (
  properties: ('transform' | 'opacity' | 'box-shadow')[] = ['transform'],
  isActive: boolean = false
) => {
  const { prefersReducedMotion } = useMotionConfig()

  return useMemo(() => {
    if (prefersReducedMotion || !isActive) {
      return 'auto'
    }

    if (properties.length === 1) {
      return properties[0]
    }

    if (properties.includes('transform') && properties.includes('opacity')) {
      return 'transform, opacity'
    }

    return properties.join(', ')
  }, [properties, isActive, prefersReducedMotion])
}

/**
 * Hook for hardware acceleration management
 */
export const useHardwareAcceleration = (shouldAccelerate: boolean = true) => {
  const { prefersReducedMotion, performance } = useMotionConfig()

  return useMemo(() => {
    if (prefersReducedMotion || !shouldAccelerate || !performance.hardwareAcceleration) {
      return {}
    }

    return {
      transform: motion.performance.hardwareAcceleration.enable,
      backfaceVisibility: motion.performance.hardwareAcceleration.backfaceVisibility,
    }
  }, [shouldAccelerate, prefersReducedMotion, performance])
}

/**
 * Performance-optimized transition hook
 */
export const useOptimizedTransition = (
  properties: string | string[],
  duration: keyof typeof motion.duration = 'medium',
  easing: keyof typeof motion.easing = 'easeInOut'
) => {
  const { prefersReducedMotion, transitions } = useMotionConfig()

  return useMemo(() => {
    if (prefersReducedMotion) {
      return 'none'
    }

    // Use pre-optimized transitions when available
    if (typeof properties === 'string') {
      const optimizedKey = properties as keyof typeof transitions
      if (transitions[optimizedKey]) {
        return transitions[optimizedKey]
      }
    }

    // Fallback to custom transition
    const props = Array.isArray(properties) ? properties.join(', ') : properties
    return `${props} ${motion.duration[duration]} ${motion.easing[easing]}`
  }, [properties, duration, easing, prefersReducedMotion, transitions])
}

/**
 * Performance-aware Framer Motion props with adaptive quality
 */
export const useAdaptiveMotionProps = (
  baseProps: {
    initial?: Record<string, any>
    animate?: Record<string, any>
    exit?: Record<string, any>
    whileHover?: Record<string, any>
    whileTap?: Record<string, any>
    transition?: Record<string, any>
  },
  performanceMode: 'high' | 'balanced' | 'low' = 'balanced'
) => {
  const { prefersReducedMotion, framerTransition } = useMotionConfig()

  return useMemo(() => {
    if (prefersReducedMotion) {
      return {
        initial: { opacity: baseProps.initial?.opacity ?? 0 },
        animate: { opacity: baseProps.animate?.opacity ?? 1 },
        exit: { opacity: baseProps.exit?.opacity ?? 0 },
        transition: { duration: 0 },
      }
    }

    // Adjust animation complexity based on performance mode
    const getOptimizedProps = () => {
      switch (performanceMode) {
        case 'high':
          return baseProps
        case 'low':
          return {
            initial: { opacity: baseProps.initial?.opacity ?? 0 },
            animate: { opacity: baseProps.animate?.opacity ?? 1 },
            exit: { opacity: baseProps.exit?.opacity ?? 0 },
            transition: { ...framerTransition, duration: framerTransition.duration * 0.7 },
          }
        case 'balanced':
        default:
          return {
            ...baseProps,
            transition: baseProps.transition || framerTransition,
          }
      }
    }

    return getOptimizedProps()
  }, [baseProps, performanceMode, prefersReducedMotion, framerTransition])
}
