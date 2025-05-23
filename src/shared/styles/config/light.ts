import { Theme } from 'shared/styles'
import { colors } from './colors'
import { breakpoints } from './breakpoints'
import { spacing } from './spacing'
import { fontSizes } from './fontSizes'
import { fontWeight } from './fontWeight'
import { borderRadius } from './borderRadius'
import { borderWidth } from './borderWidth'

export const lightTheme: Theme = {
  mode: 'light',
  text: '#1a1a1a',
  colors,
  breakpoints,
  spacing,
  fontSizes,
  fontWeight,
  borderRadius,
  borderWidth,
  shadow: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.15)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.2)',
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
  },
  background: {
    primary: '#F5F6F8',
    secondary: '#ffffff',
    surface: '#ffffff',
    elevated: '#f0f1f3',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
}
