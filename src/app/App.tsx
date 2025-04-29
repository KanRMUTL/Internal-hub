import { ThemeProvider } from './providers'
import { Layout } from 'shared/ui'
import { GlobalStyle } from 'shared/styles'
import { LOGO } from 'shared/config'

function App() {
  return (
    <ThemeProvider>
      <GlobalStyle />
      <Layout logoPath={LOGO}>Content</Layout>
    </ThemeProvider>
  )
}

export default App
