import { THEME_MODE_KEYS } from 'shared/styles'
import { DEFAULT_MODE } from 'features/toggleTheme/config'

export const switchMode = (currentMode: THEME_MODE_KEYS | undefined) => {
  switch (currentMode) {
    case 'LIGHT':
      return 'DARK'
    case 'DARK':
      return 'LIGHT'
    default:
      return DEFAULT_MODE
  }
}
