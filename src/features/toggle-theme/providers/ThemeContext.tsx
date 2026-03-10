import React, { useCallback, useMemo, useEffect } from 'react'
import { useLocalStorage } from 'react-use'
import { THEME_MODE_KEYS } from 'shared/styles'
import { DEFAULT_MODE } from 'features/toggle-theme/config'
import { switchMode } from 'features/toggle-theme/lib'
import { ThemeContext } from './context'

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modeStorage, setModeStorage] = useLocalStorage<THEME_MODE_KEYS>('theme', 'LIGHT')

  const toggleTheme = useCallback(() => {
    const nextMode = switchMode(modeStorage)
    setModeStorage(nextMode)
  }, [modeStorage, setModeStorage])

  const { mode } = useMemo(() => {
    const mode = modeStorage || DEFAULT_MODE
    return {
      mode,
    }
  }, [modeStorage])

  useEffect(() => {
    if (mode === 'DARK') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [mode])

  return <ThemeContext.Provider value={{ toggleTheme, mode }}>{children}</ThemeContext.Provider>
}
