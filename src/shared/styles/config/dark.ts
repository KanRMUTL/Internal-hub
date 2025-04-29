import { colors } from './colors'
import { breakpoints } from './breakpoints'
import { spacing } from './spacing'
import { fontSizes } from './fontSizes'

export const darkTheme = {
  mode: 'dark',
  background: '#0a0a0a',
  text: '#ffffff',
  ...colors,
  breakpoints,
  spacing,
  fontSizes,
}
