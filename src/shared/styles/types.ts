export enum THEME_MODE {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}

export type THEME_MODE_KEYS = keyof typeof THEME_MODE

export interface Color {
  primary: string
  secondary: string
  info: string
  success: string
  warning: string
  warningBg: string
  danger: string
  white: string
  black: string
  grey: {
    50: string
    100: string
    200: string
    300: string
    400: string
    500: string
    600: string
    700: string
    800: string
    900: string
  }
  hover: string
  focus: string
  focusRing: string
  active: string
  disabled: string
  focusVisible: string
  skipLink: string
}

export type ColorKeys = keyof Color

export interface Breakpoints {
  mobile: string
  tablet: string
  desktop: string
  widescreen: string
}

export type BreakpointsKeys = keyof Breakpoints

export interface Spacing {
  xxs: string
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
  xxl: string
}

export type SpacingKeys = keyof Spacing

export interface FontSize {
  xs: string
  caption: string
  sm: string
  base: string
  lg: string
  xl: string
  xxl: string
  '2xl': string
  '3xl': string
}

export type FontSizeKeys = keyof FontSize

export interface FontWeight {
  light: number
  normal: number
  medium: number
  semibold: number
  bold: number
  extrabold: number
}

export type FontWeightKeys = keyof FontWeight

export interface Shadow {
  none: string
  sm: string
  md: string
  lg: string
  xl: string
  '2xl': string
  inner: string
  focus: string
  focusVisible: string
  hover: string
}

export type ShadowKeys = keyof Shadow

export interface BorderRadius {
  none: string
  sm: string
  md: string
  lg: string
  xl: string
  full: string
}

export type BorderRadiusKeys = keyof BorderRadius

export interface BorderWidth {
  none: string
  thin: string
  medium: string
  thick: string
}

export type BorderWidthKeys = keyof BorderWidth

export interface Background {
  primary: string
  secondary: string
  surface: string
  elevated: string
  overlay: string
}

export type BackgroundKeys = keyof Background

export interface Motion {
  duration: {
    fast: string
    medium: string
    slow: string
  }
  easing: {
    easeOut: string
    easeIn: string
    easeInOut: string
    bounce: string
  }
  scale: {
    hover: string
    active: string
    focus: string
  }
  transitions: {
    default: string
    fast: string
    slow: string
    transform: string
    opacity: string
    colors: string
    transformOpacity: string
    boxShadow: string
  }
  performance: {
    willChange: {
      transform: string
      opacity: string
      transformOpacity: string
      boxShadow: string
      auto: string
    }
    hardwareAcceleration: {
      enable: string
      backfaceVisibility: string
      perspective: string
    }
  }
  reducedMotion: {
    duration: string
    easing: string
    scale: string
    transitions: string
  }
}

export type MotionKeys = keyof Motion

export interface Theme {
  mode: string
  text: string
  colors: Color
  breakpoints: Breakpoints
  spacing: Spacing
  fontSizes: FontSize
  fontWeight: FontWeight
  shadow: Shadow
  borderRadius: BorderRadius
  borderWidth: BorderWidth
  background: Background
  motion: Motion
}
