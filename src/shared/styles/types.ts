import { lightTheme } from './config/light'

export enum THEME_MODE {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}

export type THEME_MODE_KEYS = keyof typeof THEME_MODE

export type Theme = typeof lightTheme