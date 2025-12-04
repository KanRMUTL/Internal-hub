import styled from 'styled-components'
import { Card } from 'shared/ui'

export const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 1rem;
`

export const JoinCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  background: white;
`
