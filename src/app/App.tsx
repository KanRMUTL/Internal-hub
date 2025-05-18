import { ThemeProvider } from 'features/toggle-theme'
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
