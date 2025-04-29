// src/context/ThemeContext.tsx
import React, { createContext, useState, useContext } from 'react'
import { ThemeProvider as StyledProvider } from 'styled-components'
import { lightTheme, darkTheme, THEME_MODE_KEYS } from 'shared/styles'

interface ThemeContextValue {
  toggleTheme: VoidFunction
  mode: THEME_MODE_KEYS
}

const ThemeContext = createContext<ThemeContextValue>({
  toggleTheme: () => {},
  mode: 'DARK',
})

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<THEME_MODE_KEYS>('LIGHT')

  const toggleTheme = () => setMode((previousMode) => (previousMode === 'LIGHT' ? 'DARK' : 'LIGHT'))

  const theme = mode === 'LIGHT' ? lightTheme : darkTheme

  return (
    <ThemeContext.Provider value={{ toggleTheme, mode }}>
      <StyledProvider theme={theme}>{children}</StyledProvider>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
