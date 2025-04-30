import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0;
`

export const Nav = styled.div<{ $light: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xs};
  box-shadow: ${({ theme }) => theme.shadow.md};
  background: ${({ theme, $light }) => ($light ? theme.colors.info : theme.colors.black)};
`

export const Main = styled.div`
  width: 100%;
  min-height: 100vh;
`
