import { Wrapper, Nav, Main } from './styled'
import ToggleThemeButton, { useTheme } from 'features/toggleTheme'
import { Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

interface LayoutProps {
  logoPath: string
}

const Layout = ({ logoPath }: LayoutProps) => {
  const { mode } = useTheme()
  const navigate = useNavigate()

  return (
    <Wrapper>
      <Nav $light={mode == 'LIGHT'}>
        <div>
          <img
            src={logoPath}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              navigate('/')
            }}
          />
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
