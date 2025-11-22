import { Motion } from 'shared/styles'

export const motion: Motion = {
  // Duration tokens (optimized for 60fps performance)
  duration: {
    fast: '120ms', // Micro-interactions (hover, focus) - optimized timing
    medium: '180ms', // Component state changes - faster for better perceived performance
    slow: '250ms', // Layout changes and modals - reduced from 350ms
  },

  // Easing functions (optimized for smooth 60fps animations)
  easing: {
    easeOut: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Optimized easeOutQuad
    easeIn: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)', // Optimized easeInQuad
    easeInOut: 'cubic-bezier(0.165, 0.84, 0.44, 1)', // Optimized easeOutQuart
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // Playful interactions (use sparingly)
  },

  // Scale transforms (subtle for better performance)
  scale: {
    hover: '1.02', // Subtle hover effect
    active: '0.98', // Active/pressed state
    focus: '1.01', // Focus state
  },

  // Performance-optimized transition combinations
  transitions: {
    default: 'all 180ms cubic-bezier(0.165, 0.84, 0.44, 1)',
    fast: 'all 120ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    slow: 'all 250ms cubic-bezier(0.165, 0.84, 0.44, 1)',
    // GPU-accelerated specific properties
    transform: 'transform 180ms cubic-bezier(0.165, 0.84, 0.44, 1)',
    opacity: 'opacity 180ms cubic-bezier(0.165, 0.84, 0.44, 1)',
    colors:
      'background-color 180ms cubic-bezier(0.165, 0.84, 0.44, 1), border-color 180ms cubic-bezier(0.165, 0.84, 0.44, 1), color 180ms cubic-bezier(0.165, 0.84, 0.44, 1)',
    // Performance-optimized combinations
    transformOpacity:
      'transform 180ms cubic-bezier(0.165, 0.84, 0.44, 1), opacity 180ms cubic-bezier(0.165, 0.84, 0.44, 1)',
    boxShadow: 'box-shadow 120ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },

  // Performance optimization properties
  performance: {
    // Will-change properties for different animation types
    willChange: {
      transform: 'transform',
      opacity: 'opacity',
      transformOpacity: 'transform, opacity',
      boxShadow: 'box-shadow',
      auto: 'auto',
    },
    // Hardware acceleration helpers
    hardwareAcceleration: {
      enable: 'translateZ(0)',
      backfaceVisibility: 'hidden',
      perspective: '1000px',
    },
  },

  // Reduced motion fallbacks
  reducedMotion: {
    duration: '0ms',
    easing: 'linear',
    scale: '1',
    transitions: 'none',
  },
}
