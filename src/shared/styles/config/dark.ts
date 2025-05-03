import { Theme } from 'shared/styles'
import { colors } from './colors'
import { breakpoints } from './breakpoints'
import { spacing } from './spacing'
import { fontSizes } from './fontSizes'
import { fontWeight } from './fontWeight'
import { borderRadius } from './borderRadius'
import { borderWidth } from './borderWidth'

export const darkTheme: Theme = {
  mode: 'dark',
  text: '#F5F6F8',
  colors,
  breakpoints,
  spacing,
  fontSizes,
  fontWeight,
  borderRadius,
  borderWidth,
  shadow: {
    sm: '0 1px 2px rgba(255, 255, 255, 0.05)',
    md: '0 4px 6px rgba(255, 255, 255, 0.1)',
    lg: '0 10px 15px rgba(255, 255, 255, 0.15)',
    xl: '0 20px 25px rgba(255, 255, 255, 0.2)',
    inner: 'inset 0 2px 4px rgba(255, 255, 255, 0.06)',
  },
  background: {
    primary: '#1a1a1a',
    secondary: '#2a2a2a',
    surface: '#2e2e2e',
    elevated: '#3a3a3a',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
}
