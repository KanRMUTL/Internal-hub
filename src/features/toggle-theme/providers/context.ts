import { createContext } from 'react'
import { THEME_MODE_KEYS } from 'shared/styles'

interface ThemeContextValue {
  toggleTheme: VoidFunction
  mode: THEME_MODE_KEYS
}

export const ThemeContext = createContext<ThemeContextValue>({
  toggleTheme: () => {},
  mode: 'DARK',
})
