import styled from 'styled-components'
import { ReactNode } from 'react'

interface ScreenReaderOnlyProps {
  children: ReactNode
  as?: 'span' | 'div' | 'p'
  id?: string
}

const ScreenReaderOnly = ({ children, as = 'span', id }: ScreenReaderOnlyProps) => {
  return (
    <StyledScreenReaderOnly as={as} id={id}>
      {children}
    </StyledScreenReaderOnly>
  )
}

export default ScreenReaderOnly

const StyledScreenReaderOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`
