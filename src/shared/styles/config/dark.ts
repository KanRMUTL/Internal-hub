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
  text: 'oklch(95% 0.005 180)',
  colors: { ...colors, disabled: 'oklch(35% 0.008 180 / 0.5)' },
  breakpoints,
  spacing,
  fontSizes,
  fontWeight,
  borderRadius,
  borderWidth,
  shadow: {
    none: 'none',
    sm: '0 1px 1px oklch(0% 0 0 / 0.2)',
    md: '0 2px 4px oklch(0% 0 0 / 0.3), 0 1px 2px oklch(0% 0 0 / 0.2)',
    lg: '0 4px 12px oklch(0% 0 0 / 0.35)',
    xl: '0 8px 24px oklch(0% 0 0 / 0.4)',
    '2xl': '0 16px 48px oklch(0% 0 0 / 0.5)',
    inner: 'inset 0 1px 2px oklch(0% 0 0 / 0.3)',
    focus: '0 0 0 3px oklch(78% 0.14 178 / 0.3)',
    focusVisible: '0 0 0 3px oklch(82% 0.16 178 / 0.7)',
    hover: '0 6px 20px oklch(0% 0 0 / 0.4)',
    menu: '0 6px 18px oklch(0% 0 0 / 0.4), 0 1px 2px oklch(0% 0 0 / 0.2)',
    modal: '0 24px 64px oklch(0% 0 0 / 0.5), 0 1px 2px oklch(0% 0 0 / 0.3)',
    popover: '0 12px 32px oklch(0% 0 0 / 0.4), 0 1px 0 oklch(0% 0 0 / 0.2)',
    pointer: 'drop-shadow(0 2px 4px oklch(0% 0 0 / 0.4))',
  },
  background: {
    primary: 'oklch(12% 0.008 180)',
    secondary: 'oklch(16% 0.008 180)',
    surface: 'oklch(16% 0.008 180)',
    elevated: 'oklch(20% 0.008 180)',
    overlay: 'oklch(0% 0 0 / 0.6)',
  },
  motion,
}
