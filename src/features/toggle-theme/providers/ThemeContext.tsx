import React, { createContext, useCallback, useContext, useMemo } from 'react'
import { useLocalStorage } from 'react-use'
import { ThemeProvider as StyledProvider } from 'styled-components'
import { lightTheme, darkTheme, THEME_MODE_KEYS } from 'shared/styles'
import { DEFAULT_MODE } from 'features/toggle-theme/config'
import { switchMode } from 'features/toggle-theme/lib'

interface ThemeContextValue {
  toggleTheme: VoidFunction
  mode: THEME_MODE_KEYS
}

const ThemeContext = createContext<ThemeContextValue>({
  toggleTheme: () => {},
  mode: 'LIGHT',
})

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modeStorage, setModeStorage] = useLocalStorage<THEME_MODE_KEYS>('theme', 'LIGHT')

  const toggleTheme = useCallback(() => {
    const nextMode = switchMode(modeStorage)
    setModeStorage(nextMode)
  }, [modeStorage])

  const { theme, mode } = useMemo(() => {
    const theme = modeStorage === 'LIGHT' ? lightTheme : darkTheme
    const mode = modeStorage || DEFAULT_MODE
    return {
      theme,
      mode,
    }
  }, [modeStorage])

  return (
    <ThemeContext.Provider value={{ toggleTheme, mode }}>
      <StyledProvider theme={theme}>{children}</StyledProvider>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
