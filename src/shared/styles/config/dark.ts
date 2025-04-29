import { colors } from './colors'
import { breakpoints } from './breakpoints'
import { spacing } from './spacing'
import { fontSizes } from './fontSizes'

export const darkTheme = {
  mode: 'dark',
  background: '#0a0a0a',
  text: '#ffffff',
  colors,
  breakpoints,
  spacing,
  fontSizes,
  shadow: {
    sm: '0 1px 2px rgba(255, 255, 255, 0.05)',
    md: '0 4px 6px rgba(255, 255, 255, 0.1)',
    lg: '0 10px 15px rgba(255, 255, 255, 0.15)',
    xl: '0 20px 25px rgba(255, 255, 255, 0.2)',
    inner: 'inset 0 2px 4px rgba(255, 255, 255, 0.06)',
  },
}
