import { ThemeProvider } from 'features/toggle-theme'
import { AppRouter } from './routes'

function App() {
  return (
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  )
}

export default App
