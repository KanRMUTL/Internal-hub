import { Color } from 'shared/styles'

export const colors: Color = {
  // Brand
  primary: 'oklch(72% 0.156 178)',
  secondary: 'oklch(68% 0.13 230)',

  // Semantic
  info: 'oklch(68% 0.13 230)',
  success: 'oklch(70% 0.16 150)',
  warning: 'oklch(80% 0.16 80)',
  danger: 'oklch(62% 0.22 25)',

  // Base
  white: 'oklch(100% 0 0)',
  black: 'oklch(18% 0.012 180)',

  // Neutrals, tinted toward the brand teal hue at low chroma
  grey: {
    50: 'oklch(98.5% 0.004 180)',
    100: 'oklch(96.5% 0.006 180)',
    200: 'oklch(92% 0.008 180)',
    300: 'oklch(85% 0.01 180)',
    400: 'oklch(70% 0.01 180)',
    500: 'oklch(50% 0.012 180)',
    600: 'oklch(42% 0.012 180)',
    700: 'oklch(32% 0.012 180)',
    800: 'oklch(24% 0.012 180)',
    900: 'oklch(18% 0.012 180)',
  },

  // Interactive states (derived from primary)
  hover: 'oklch(72% 0.156 178 / 0.08)',
  focus: 'oklch(72% 0.156 178 / 0.12)',
  focusRing: 'oklch(72% 0.156 178 / 0.45)',
  active: 'oklch(72% 0.156 178 / 0.18)',
  disabled: 'oklch(80% 0.005 180 / 0.5)',

  // Accessibility
  focusVisible: 'oklch(48% 0.18 178)',
  skipLink: 'oklch(48% 0.18 230)',

  // Interactive ink: darker teal for buttons, accent text, and any primary
  // surface that carries readable content. Lighter `primary` is reserved for
  // decorative accents (borders, hover tints, wheel segments) where it never
  // sits behind text. `primary` alone fails WCAG AA on white; `interactive`
  // passes 4.5:1.
  interactive: 'oklch(48% 0.18 178)',
}
