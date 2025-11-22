import { Theme } from 'shared/styles'
import { colors } from './colors'
import { breakpoints } from './breakpoints'
import { spacing } from './spacing'
import { fontSizes } from './fontSizes'
import { fontWeight } from './fontWeight'
import { borderRadius } from './borderRadius'
import { borderWidth } from './borderWidth'
import { motion } from './motion'

export const darkTheme: Theme = {
  mode: 'dark',
  text: '#F5F6F8',
  colors: { ...colors, disabled: 'rgba(255, 255, 255, 0.3)' },
  breakpoints,
  spacing,
  fontSizes,
  fontWeight,
  borderRadius,
  borderWidth,
  shadow: {
    none: 'none',
    sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px rgba(0, 0, 0, 0.4)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.5)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.6)',
    '2xl': '0 25px 50px rgba(0, 0, 0, 0.7)',
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
    focus: '0 0 0 3px rgba(0, 209, 178, 0.3)',
    focusVisible: '0 0 0 3px rgba(0, 255, 217, 0.7)', // High contrast focus ring for dark mode
    hover: '0 8px 25px rgba(0, 0, 0, 0.5)',
  },
  background: {
    primary: '#1a1a1a',
    secondary: '#2a2a2a',
    surface: '#2e2e2e',
    elevated: '#3a3a3a',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  motion,
}
