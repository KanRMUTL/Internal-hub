import { Color } from 'shared/styles'

export const colors: Color = {
  // Brand colors
  primary: '#00d1b2',
  secondary: '#209cee',

  // Semantic colors
  info: '#209cee',
  success: '#23d160',
  warning: '#ffdd57',
  danger: '#ff3860',

  // Base colors
  white: '#ffffff',
  black: '#0a0a0a',

  // Gray scale
  grey: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Interactive states
  hover: 'rgba(0, 209, 178, 0.1)',
  focus: 'rgba(0, 209, 178, 0.2)',
  focusRing: 'rgba(0, 209, 178, 0.4)', // High contrast focus ring
  active: 'rgba(0, 209, 178, 0.3)',
  disabled: 'rgba(0, 0, 0, 0.3)',

  // Accessibility colors
  focusVisible: '#005a4f', // High contrast focus color
  skipLink: '#0066cc', // High contrast skip link color
}
