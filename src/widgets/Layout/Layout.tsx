import { Wrapper, Nav, Main } from './styled'
import { ToggleThemeButton, useTheme } from 'features/toggle-theme'
import { Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { masterLogo, hatohub } from 'shared/assets'
import { Box, Breadcrumbs, Container } from 'shared/ui'
import styled from 'styled-components'

const Layout = () => {
  const { mode } = useTheme()
  const navigate = useNavigate()

  return (
    <Wrapper>
      <Nav $light={mode == 'LIGHT'}>
        <LogoWrapper $display="flex" $align="center" $gap="sm" $pl="sm" $pr="md" $pt="xs" $pb="xs">
          <img
            src={masterLogo}
            height={42}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              navigate('/')
            }}
          />
          <img
            src={hatohub}
            height={22}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              navigate('/')
            }}
          />
        </LogoWrapper>
        <div>
          <ToggleThemeButton />
        </div>
      </Nav>
      <Main>
        <Container>
          <Breadcrumbs />
          <Outlet />
        </Container>
      </Main>
    </Wrapper>
  )
}

export default Layout

const LogoWrapper = styled(Box)`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`
