import { Wrapper, Nav, Main } from './styled'
import ToggleThemeButton, { useTheme } from 'features/toggleTheme'
import { Outlet } from 'react-router-dom'
interface LayoutProps {
  logoPath: string
}

const Layout = ({ logoPath }: LayoutProps) => {
  const { mode } = useTheme()
  return (
    <Wrapper>
      <Nav $light={mode == 'LIGHT'}>
        <div>
          <img src={logoPath} />
        </div>
        <div>
          <ToggleThemeButton />
        </div>
      </Nav>
      <Main>{<Outlet />}</Main>
    </Wrapper>
  )
}

export default Layout
