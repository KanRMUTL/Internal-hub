export enum THEME_MODE {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}

export type THEME_MODE_KEYS = keyof typeof THEME_MODE

export interface Color {
  primary: string
  info: string
  success: string
  warning: string
  danger: string
  white: string
  black: string
  grey: string
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
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
}

export type SpacingKeys = keyof Spacing

export interface FontSize {
  sm: string
  base: string
  lg: string
  xl: string
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
  sm: string
  md: string
  lg: string
  xl: string
  inner: string
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

export interface Background {
  primary: string
  secondary: string
  surface: string
  elevated: string
  overlay: string
}

export type BackgroundKeys = keyof Background

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
  background: Background
}
