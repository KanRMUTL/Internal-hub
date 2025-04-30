import { ThemeProvider } from 'features/toggleTheme'
import { GlobalStyle } from 'shared/styles'
import { AppRouter } from './routes'

function App() {
  return (
    <ThemeProvider>
      <GlobalStyle />
      <AppRouter />
    </ThemeProvider>
  )
}

export default App
