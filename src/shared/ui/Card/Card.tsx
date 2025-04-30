import styled from 'styled-components'
import { Box } from 'shared/ui'

export default styled(Box)`
  transition: '0.2s ease-in-out';
  &:hover {
    transform: translateY(-4px);
  }
`
