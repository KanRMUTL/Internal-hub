import { ReactNode } from 'react'
import { Wrapper, Nav, Content } from './styled'

interface LayoutProps {
  children: ReactNode
  logoPath: string
}

const Layout = ({ children, logoPath }: LayoutProps) => {
  return (
    <Wrapper>
      <Nav>
        <div>
          <img src={logoPath} />
        </div>
      </Nav>
      <Content>{children}</Content>
    </Wrapper>
  )
}

export default Layout
