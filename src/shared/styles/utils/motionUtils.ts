import { motion } from '../config'

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Performance optimization utilities
 */

/**
 * Get optimized will-change property based on animation type
 */
export const getWillChange = (properties: string | string[]): string => {
  if (prefersReducedMotion()) {
    return 'auto'
  }

  const props = Array.isArray(properties) ? properties : [properties]

  // Optimize common animation properties
  const optimizedProps = props.map((prop) => {
    switch (prop) {
      case 'x':
      case 'y':
      case 'scale':
      case 'rotate':
        return 'transform'
      case 'backgroundColor':
      case 'background-color':
        return 'background-color'
      case 'borderColor':
      case 'border-color':
        return 'border-color'
      default:
        return prop
    }
  })

  // Remove duplicates and join
  return [...new Set(optimizedProps)].join(', ')
}

/**
 * Create performance-optimized CSS for animations
 */
export const optimizedAnimation = (properties: string | string[]) => `
  will-change: ${getWillChange(properties)};
  backface-visibility: hidden;
  perspective: 1000px;
  
  @media (prefers-reduced-motion: reduce) {
    will-change: auto;
  }
`

/**
 * Performance-aware transform with GPU acceleration
 */
export const gpuTransform = (transform: string) => `
  transform: ${prefersReducedMotion() ? 'none' : transform};
  will-change: ${prefersReducedMotion() ? 'auto' : 'transform'};
  backface-visibility: hidden;
  
  @media (prefers-reduced-motion: reduce) {
    transform: none;
    will-change: auto;
  }
`

/**
 * Check if device supports hardware acceleration
 */
export const supportsHardwareAcceleration = (): boolean => {
  if (typeof window === 'undefined') return false

  // Check for 3D transform support
  const testElement = document.createElement('div')
  testElement.style.transform = 'translate3d(0,0,0)'
  return testElement.style.transform !== ''
}

/**
 * Get optimized easing function based on device capabilities
 */
export const getOptimizedEasing = (easing: keyof typeof motion.easing = 'easeInOut'): string => {
  if (prefersReducedMotion()) {
    return motion.reducedMotion.easing
  }

  // Use simpler easing for lower-end devices
  if (!supportsHardwareAcceleration()) {
    return 'ease' // Browser-optimized easing
  }

  return motion.easing[easing]
}

/**
 * Performance monitoring for animations
 */
export const createPerformanceMonitor = () => {
  let frameCount = 0
  let lastTime = performance.now()
  let fps = 60

  const measureFPS = () => {
    frameCount++
    const currentTime = performance.now()

    if (currentTime >= lastTime + 1000) {
      fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
      frameCount = 0
      lastTime = currentTime

      // Log performance warnings
      if (fps < 30) {
        console.warn(`Animation performance warning: ${fps} FPS detected`)
      }
    }

    requestAnimationFrame(measureFPS)
  }

  return {
    start: () => requestAnimationFrame(measureFPS),
    getFPS: () => fps,
    isPerformant: () => fps >= 50,
  }
}

/**
 * Utility function to get motion values based on user's reduced motion preference
 * @param normalValue - The normal motion value to use
 * @param reducedValue - The reduced motion fallback value
 * @returns The appropriate value based on user preference
 */
export const getMotionValue = (normalValue: string, reducedValue?: string): string => {
  if (prefersReducedMotion()) {
    return reducedValue || motion.reducedMotion.transitions
  }
  return normalValue
}

/**
 * CSS helper for motion-safe animations
 * Returns CSS that respects user's motion preferences
 */
export const motionSafe = (styles: string): string => {
  return `
    @media (prefers-reduced-motion: no-preference) {
      ${styles}
    }
  `
}

/**
 * CSS helper for reduced motion fallbacks
 */
export const motionReduce = (styles: string): string => {
  return `
    @media (prefers-reduced-motion: reduce) {
      ${styles}
    }
  `
}

/**
 * Get transition value that respects motion preferences
 */
export const getTransition = (transitionType: keyof typeof motion.transitions = 'default'): string => {
  return getMotionValue(motion.transitions[transitionType], motion.reducedMotion.transitions)
}

/**
 * Get duration value that respects motion preferences
 */
export const getDuration = (durationType: keyof typeof motion.duration = 'medium'): string => {
  return getMotionValue(motion.duration[durationType], motion.reducedMotion.duration)
}

/**
 * Get scale value that respects motion preferences
 */
export const getScale = (scaleType: keyof typeof motion.scale = 'hover'): string => {
  return getMotionValue(motion.scale[scaleType], motion.reducedMotion.scale)
}

/**
 * Get easing value that respects motion preferences
 */
export const getEasing = (easingType: keyof typeof motion.easing = 'easeInOut'): string => {
  return getMotionValue(motion.easing[easingType], motion.reducedMotion.easing)
}

/**
 * Create a motion-aware transition string
 */
export const createTransition = (
  properties: string | string[],
  duration: keyof typeof motion.duration = 'medium',
  easing: keyof typeof motion.easing = 'easeInOut'
): string => {
  const props = Array.isArray(properties) ? properties.join(', ') : properties
  const dur = getDuration(duration)
  const ease = getEasing(easing)

  if (prefersReducedMotion()) {
    return motion.reducedMotion.transitions
  }

  return `${props} ${dur} ${ease}`
}

/**
 * Motion-aware CSS transition mixin for styled-components with performance optimizations
 */
export const motionTransition = (
  properties: string | string[],
  duration: keyof typeof motion.duration = 'medium',
  easing: keyof typeof motion.easing = 'easeInOut',
  optimize = true
) => `
  transition: ${createTransition(properties, duration, easing)};
  ${optimize ? `will-change: ${getWillChange(properties)};` : ''}
  
  @media (prefers-reduced-motion: reduce) {
    transition: ${motion.reducedMotion.transitions};
    will-change: auto;
  }
`

/**
 * High-performance transition for transform properties
 */
export const performantTransform = (
  transform: string,
  duration: keyof typeof motion.duration = 'medium',
  easing: keyof typeof motion.easing = 'easeOut'
) => `
  transform: ${prefersReducedMotion() ? 'none' : transform};
  transition: ${createTransition('transform', duration, easing)};
  will-change: ${prefersReducedMotion() ? 'auto' : 'transform'};
  backface-visibility: hidden;
  
  @media (prefers-reduced-motion: reduce) {
    transform: none;
    transition: none;
    will-change: auto;
  }
`

/**
 * Motion-aware transform with will-change optimization
 */
export const motionTransform = (transform: string, willChange = true) => `
  transform: ${prefersReducedMotion() ? 'none' : transform};
  ${willChange ? 'will-change: transform;' : ''}
  
  @media (prefers-reduced-motion: reduce) {
    transform: none;
    will-change: auto;
  }
`

/**
 * Performance-optimized animation properties
 * Uses GPU-accelerated properties and proper will-change declarations
 */
export const performanceOptimizedAnimation = (
  properties: ('transform' | 'opacity' | 'filter')[] = ['transform', 'opacity'],
  duration: keyof typeof motion.duration = 'medium',
  easing: keyof typeof motion.easing = 'easeInOut'
) => {
  const willChangeProps = properties.join(', ')
  const transition = createTransition(properties, duration, easing)

  return `
    will-change: ${willChangeProps};
    transition: ${transition};
    transform: translateZ(0); /* Force hardware acceleration */
    backface-visibility: hidden; /* Prevent flickering */
    
    @media (prefers-reduced-motion: reduce) {
      will-change: auto;
      transition: none;
      transform: none;
    }
  `
}

/**
 * Optimized hover effects with proper will-change management
 */
export const optimizedHoverEffect = (
  hoverTransform: string = 'scale(1.02)',
  activeTransform: string = 'scale(0.98)',
  duration: keyof typeof motion.duration = 'fast'
) => `
  ${performanceOptimizedAnimation(['transform'], duration, 'easeOut')}
  
  &:hover:not(:disabled) {
    transform: ${prefersReducedMotion() ? 'none' : hoverTransform};
  }
  
  &:active:not(:disabled) {
    transform: ${prefersReducedMotion() ? 'none' : activeTransform};
    transition-duration: ${motion.duration.fast};
  }
  
  &:not(:hover):not(:active) {
    will-change: auto; /* Remove will-change when not needed */
  }
`

/**
 * Performance-aware box shadow transitions
 */
export const optimizedShadowTransition = (
  normalShadow: string,
  hoverShadow: string,
  duration: keyof typeof motion.duration = 'fast'
) => `
  box-shadow: ${normalShadow};
  transition: box-shadow ${motion.duration[duration]} ${motion.easing.easeOut};
  
  &:hover:not(:disabled) {
    box-shadow: ${hoverShadow};
    will-change: box-shadow;
  }
  
  &:not(:hover) {
    will-change: auto;
  }
  
  @media (prefers-reduced-motion: reduce) {
    transition: none;
    will-change: auto;
    
    &:hover:not(:disabled) {
      box-shadow: ${normalShadow};
    }
  }
`

/**
 * Optimized fade transition with proper timing
 */
export const optimizedFadeTransition = (duration: keyof typeof motion.duration = 'medium') => `
  ${performanceOptimizedAnimation(['opacity'], duration, 'easeInOut')}
  
  &.fade-enter {
    opacity: 0;
  }
  
  &.fade-enter-active {
    opacity: 1;
  }
  
  &.fade-exit {
    opacity: 1;
  }
  
  &.fade-exit-active {
    opacity: 0;
  }
`

/**
 * Performance monitoring CSS for debugging
 */
export const performanceDebugCSS = `
  /* Highlight elements with will-change for debugging */
  [style*="will-change"] {
    outline: 1px dashed rgba(255, 0, 0, 0.3) !important;
  }
  
  /* Highlight GPU-accelerated elements */
  [style*="translateZ"] {
    outline: 1px dashed rgba(0, 255, 0, 0.3) !important;
  }
`

/**
 * Framer Motion variants that respect reduced motion preferences
 */
export const createMotionVariants = (variants: Record<string, Record<string, string | number>>) => {
  if (prefersReducedMotion()) {
    // Return static variants for reduced motion
    const reducedVariants: Record<string, Record<string, string | number>> = {}
    Object.keys(variants).forEach((key) => {
      reducedVariants[key] = {
        ...variants[key],
        scale: 1,
        x: 0,
        y: 0,
        rotate: 0,
        opacity: variants[key].opacity !== undefined ? variants[key].opacity : 1,
      }
    })
    return reducedVariants
  }
  return variants
}

/**
 * Motion-aware Framer Motion transition config with performance optimizations
 */
export const createMotionTransition = (
  duration: keyof typeof motion.duration = 'medium',
  easing: keyof typeof motion.easing = 'easeInOut',
  optimize = true
) => {
  if (prefersReducedMotion()) {
    return { duration: 0 }
  }

  const baseTransition = {
    duration: parseFloat(motion.duration[duration]) / 1000, // Convert ms to seconds
    ease: getOptimizedEasing(easing).includes('cubic-bezier')
      ? getOptimizedEasing(easing).replace('cubic-bezier(', '').replace(')', '').split(', ').map(Number)
      : getOptimizedEasing(easing),
  }

  if (optimize) {
    return {
      ...baseTransition,
      // Optimize for 60fps
      type: 'tween',
      // Use hardware acceleration when available
      ...(supportsHardwareAcceleration() && {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }),
    }
  }

  return baseTransition
}

/**
 * Performance-optimized Framer Motion props
 */
export const createPerformantMotionProps = (props: {
  initial?: Record<string, string | number>
  animate?: Record<string, string | number>
  exit?: Record<string, string | number>
  transition?: Record<string, string | number | number[]>
}) => {
  if (prefersReducedMotion()) {
    return {
      initial: { opacity: props.initial?.opacity ?? 0 },
      animate: { opacity: props.animate?.opacity ?? 1 },
      exit: { opacity: props.exit?.opacity ?? 0 },
      transition: { duration: 0 },
    }
  }

  return {
    ...props,
    transition: {
      ...createMotionTransition('medium', 'easeInOut', true),
      ...props.transition,
    },
  }
}

/**
 * Create motion-aware animation props for Framer Motion components
 */
export const createMotionProps = (props: {
  initial?: Record<string, string | number>
  animate?: Record<string, string | number>
  exit?: Record<string, string | number>
  whileHover?: Record<string, string | number>
  whileTap?: Record<string, string | number>
  transition?: Record<string, string | number | number[]>
}) => {
  if (prefersReducedMotion()) {
    return {
      initial: { opacity: props.initial?.opacity ?? 0 },
      animate: { opacity: props.animate?.opacity ?? 1 },
      exit: { opacity: props.exit?.opacity ?? 0 },
      transition: { duration: 0 },
    }
  }
  return props
}

/**
 * Motion-aware hover and tap props
 */
export const createInteractionProps = (props: {
  whileHover?: Record<string, string | number>
  whileTap?: Record<string, string | number>
}) => {
  if (prefersReducedMotion()) {
    return {}
  }
  return props
}

/**
 * Get motion-aware CSS animation
 */
export const getMotionAnimation = (
  keyframes: string,
  duration: keyof typeof motion.duration = 'medium',
  easing: keyof typeof motion.easing = 'easeInOut',
  fillMode = 'both'
) => {
  if (prefersReducedMotion()) {
    return 'none'
  }
  return `${keyframes} ${getDuration(duration)} ${getEasing(easing)} ${fillMode}`
}

/**
 * Create a motion-aware CSS keyframe animation
 */
export const createKeyframeAnimation = (
  name: string,
  keyframes: string,
  duration: keyof typeof motion.duration = 'medium',
  easing: keyof typeof motion.easing = 'easeInOut'
) => `
  @keyframes ${name} {
    ${keyframes}
  }
  
  animation: ${getMotionAnimation(name, duration, easing)};
  
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

/**
 * Optimized timing functions for 60fps performance
 */
export const optimizedEasing = {
  // Fast micro-interactions (100-200ms)
  microFast: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // easeOutQuad
  microSlow: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)', // easeInQuad

  // Standard interactions (200-300ms)
  standardFast: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // easeOutQuad
  standardSlow: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)', // easeInQuad

  // Complex animations (300-500ms)
  complexFast: 'cubic-bezier(0.165, 0.84, 0.44, 1)', // easeOutQuart
  complexSlow: 'cubic-bezier(0.895, 0.03, 0.685, 0.22)', // easeInQuart

  // Bouncy effects (use sparingly)
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',

  // Performance-optimized linear for reduced motion
  linear: 'linear',
} as const

/**
 * Performance-optimized duration values
 */
export const optimizedDuration = {
  // Micro-interactions (hover, focus)
  micro: '120ms',

  // Fast interactions (button press, small state changes)
  fast: '180ms',

  // Standard interactions (modal open, page transitions)
  standard: '250ms',

  // Complex animations (layout changes, complex transitions)
  complex: '350ms',

  // Slow animations (use sparingly)
  slow: '500ms',

  // Reduced motion fallback
  none: '0ms',
} as const

/**
 * Create performance-optimized Framer Motion transition
 */
export const createOptimizedMotionTransition = (
  type: 'micro' | 'fast' | 'standard' | 'complex' = 'standard',
  easing: keyof typeof optimizedEasing = 'standardFast'
) => {
  if (prefersReducedMotion()) {
    return { duration: 0, ease: 'linear' }
  }

  const durationMap = {
    micro: 0.12,
    fast: 0.18,
    standard: 0.25,
    complex: 0.35,
  }

  return {
    duration: durationMap[type],
    ease: optimizedEasing[easing].replace('cubic-bezier(', '').replace(')', '').split(', ').map(Number),
  }
}

/**
 * Performance-optimized Framer Motion variants
 */
export const optimizedMotionVariants = {
  // Fade variants
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },

  // Scale variants (GPU-optimized)
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },

  // Slide variants (GPU-optimized with transform3d)
  slideUp: {
    initial: { opacity: 0, y: 20, z: 0 },
    animate: { opacity: 1, y: 0, z: 0 },
    exit: { opacity: 0, y: 20, z: 0 },
  },

  slideDown: {
    initial: { opacity: 0, y: -20, z: 0 },
    animate: { opacity: 1, y: 0, z: 0 },
    exit: { opacity: 0, y: -20, z: 0 },
  },

  slideLeft: {
    initial: { opacity: 0, x: 20, z: 0 },
    animate: { opacity: 1, x: 0, z: 0 },
    exit: { opacity: 0, x: 20, z: 0 },
  },

  slideRight: {
    initial: { opacity: 0, x: -20, z: 0 },
    animate: { opacity: 1, x: 0, z: 0 },
    exit: { opacity: 0, x: -20, z: 0 },
  },

  // Hover interaction variants
  hoverScale: {
    rest: { scale: 1 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
  },

  hoverLift: {
    rest: { y: 0, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
    hover: { y: -2, boxShadow: '0 4px 8px rgba(0,0,0,0.15)' },
    tap: { y: -1, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  },
}

/**
 * Create reduced motion variants
 */
export const createReducedMotionVariants = (variants: Record<string, any>) => {
  if (prefersReducedMotion()) {
    const reducedVariants: Record<string, any> = {}
    Object.keys(variants).forEach((key) => {
      reducedVariants[key] = {
        opacity: variants[key].opacity !== undefined ? variants[key].opacity : 1,
        transition: { duration: 0 },
      }
    })
    return reducedVariants
  }
  return variants
}

/**
 * Performance-optimized CSS animation keyframes
 */
export const optimizedKeyframes = {
  // Pulse animation (GPU-optimized)
  pulse: `
    @keyframes optimized-pulse {
      0%, 100% { 
        transform: scale3d(1, 1, 1); 
        opacity: 1; 
      }
      50% { 
        transform: scale3d(1.05, 1.05, 1); 
        opacity: 0.8; 
      }
    }
  `,

  // Bounce animation (GPU-optimized)
  bounce: `
    @keyframes optimized-bounce {
      0%, 20%, 53%, 80%, 100% {
        transform: translate3d(0, 0, 0);
      }
      40%, 43% {
        transform: translate3d(0, -8px, 0);
      }
      70% {
        transform: translate3d(0, -4px, 0);
      }
      90% {
        transform: translate3d(0, -2px, 0);
      }
    }
  `,

  // Shake animation (GPU-optimized)
  shake: `
    @keyframes optimized-shake {
      0%, 100% { transform: translate3d(0, 0, 0); }
      10%, 30%, 50%, 70%, 90% { transform: translate3d(-2px, 0, 0); }
      20%, 40%, 60%, 80% { transform: translate3d(2px, 0, 0); }
    }
  `,

  // Spin animation (GPU-optimized)
  spin: `
    @keyframes optimized-spin {
      from { transform: rotate3d(0, 0, 1, 0deg); }
      to { transform: rotate3d(0, 0, 1, 360deg); }
    }
  `,
}

/**
 * Apply optimized animation with performance monitoring
 */
export const applyOptimizedAnimation = (
  element: HTMLElement,
  animationType: keyof typeof optimizedKeyframes,
  duration: keyof typeof optimizedDuration = 'standard',
  easing: keyof typeof optimizedEasing = 'standardFast'
) => {
  if (prefersReducedMotion()) {
    return
  }

  // Set will-change before animation
  element.style.willChange = 'transform, opacity'

  // Apply animation
  element.style.animation = `optimized-${animationType} ${optimizedDuration[duration]} ${optimizedEasing[easing]} both`

  // Clean up will-change after animation
  const cleanup = () => {
    element.style.willChange = 'auto'
    element.removeEventListener('animationend', cleanup)
  }

  element.addEventListener('animationend', cleanup)
}

/**
 * Utility to check if an element should use hardware acceleration
 */
export const shouldUseHardwareAcceleration = (element?: HTMLElement): boolean => {
  if (!element || prefersReducedMotion()) {
    return false
  }

  // Check if element is likely to benefit from hardware acceleration
  const rect = element.getBoundingClientRect()
  const isLargeElement = rect.width * rect.height > 10000 // Larger than 100x100px
  const hasComplexContent = element.children.length > 5

  return isLargeElement || hasComplexContent
}

/**
 * Apply hardware acceleration conditionally
 */
export const conditionalHardwareAcceleration = (element?: HTMLElement) => {
  if (shouldUseHardwareAcceleration(element)) {
    return `
      transform: translateZ(0);
      backface-visibility: hidden;
      perspective: 1000px;
    `
  }
  return ''
}
