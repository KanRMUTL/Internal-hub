import { colors } from './colors'
import { breakpoints } from './breakpoints'
import { spacing } from './spacing'
import { fontSizes } from './fontSizes'

export const lightTheme = {
  mode: 'light',
  background: '#ffffff',
  text: '#0a0a0a',
  ...colors,
  breakpoints,
  spacing,
  fontSizes,
}
