import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0;
`

export const Nav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xs};
  box-shadow: ${({ theme }) => theme.shadow.md};
  background: ${({ theme }) => theme.colors.info};
`

export const Content = styled.div`
  display: flex;
  flex-direction: column;
`
