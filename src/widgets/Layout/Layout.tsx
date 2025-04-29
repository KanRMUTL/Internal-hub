import { ReactNode } from 'react'
import { Wrapper, Nav, Content } from './styled'
import ToggleThemeButton, { useTheme } from 'features/toggleTheme'

interface LayoutProps {
  children: ReactNode
  logoPath: string
}

const Layout = ({ children, logoPath }: LayoutProps) => {
  const { mode } = useTheme()
  return (
    <Wrapper>
      <Nav light={mode == 'LIGHT'}>
        <div>
          <img src={logoPath} />
        </div>
        <div>
          <ToggleThemeButton />
        </div>
      </Nav>
      <Content>{children}</Content>
    </Wrapper>
  )
}

export default Layout
