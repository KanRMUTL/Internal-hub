import styled from 'styled-components'
import { Box } from 'shared/ui'

export default styled(Box)<{ $hoverAction?: boolean }>`
  transition: '0.2s ease-in-out';
  &:hover {
    transform: ${({ $hoverAction = false }) => ($hoverAction ? 'translateY(-4px)' : 'none')};
  }
`
