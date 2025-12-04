import styled from 'styled-components'
import { Card } from 'shared/ui'

export const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`

export const StatusCard = styled(Card)<{ $isCorrect?: boolean }>`
  text-align: center;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  background-color: white;
  border-radius: 24px;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
`
