import { Theme } from 'shared/styles'
import { colors } from './colors'
import { breakpoints } from './breakpoints'
import { spacing } from './spacing'
import { fontSizes } from './fontSizes'
import { fontWeight } from './fontWeight'
import { borderRadius } from './borderRadius'
import { borderWidth } from './borderWidth'
import { motion } from './motion'

export const lightTheme: Theme = {
  mode: 'light',
  text: 'oklch(20% 0.012 180)',
  colors,
  breakpoints,
  spacing,
  fontSizes,
  fontWeight,
  borderRadius,
  borderWidth,
  shadow: {
    none: 'none',
    sm: '0 1px 1px oklch(20% 0.01 180 / 0.04)',
    md: '0 2px 4px oklch(20% 0.01 180 / 0.05), 0 1px 2px oklch(20% 0.01 180 / 0.04)',
    lg: '0 4px 12px oklch(20% 0.01 180 / 0.06)',
    xl: '0 8px 24px oklch(20% 0.01 180 / 0.08)',
    '2xl': '0 16px 48px oklch(20% 0.01 180 / 0.12)',
    inner: 'inset 0 1px 2px oklch(20% 0.01 180 / 0.04)',
    focus: '0 0 0 3px oklch(72% 0.156 178 / 0.25)',
    focusVisible: '0 0 0 3px oklch(48% 0.18 178 / 0.6)',
    hover: '0 6px 20px oklch(20% 0.01 180 / 0.08)',
  },
  background: {
    primary: 'oklch(98.5% 0.004 180)',
    secondary: 'oklch(100% 0 0)',
    surface: 'oklch(100% 0 0)',
    elevated: 'oklch(99% 0.003 180)',
    overlay: 'oklch(20% 0.012 180 / 0.4)',
  },
  motion,
}
