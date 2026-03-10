import { Color } from 'shared/styles'

export const colors: Color = {
  // Brand colors
  primary: '#008472',
  secondary: '#1b7ab8',

  // Semantic colors
  info: '#1b7ab8',
  success: '#1e8a42',
  warning: '#856404',
  warningBg: '#ffdd57',
  danger: '#d31d43',

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
  hover: 'rgba(0, 132, 114, 0.1)',
  focus: 'rgba(0, 132, 114, 0.2)',
  focusRing: 'rgba(0, 132, 114, 0.4)', // High contrast focus ring
  active: 'rgba(0, 132, 114, 0.3)',
  disabled: 'rgba(0, 0, 0, 0.3)',

  // Accessibility colors
  focusVisible: '#005a4f', // High contrast focus color
  skipLink: '#0066cc', // High contrast skip link color
}
