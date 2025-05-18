import styled from 'styled-components'
import { Button } from 'shared/ui'

interface CircularButtonProps {
  $size?: number
}

export default styled(Button)<CircularButtonProps>`
  width: ${({ $size = 36 }) => $size}px;
  height: ${({ $size = 36 }) => $size}px;
  padding: 0;
  border-radius: 50%;
`
