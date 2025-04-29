import { ThemeProvider } from './providers'
import { GlobalStyle } from 'shared/styles'

function App() {
  return (
    <ThemeProvider>
      <GlobalStyle />
    </ThemeProvider>
  )
}

export default App
