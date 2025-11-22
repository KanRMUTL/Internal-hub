import styled, { css } from 'styled-components'
import Button from '../Button'
import { ComponentProps } from 'react'

interface CircularButtonProps extends Omit<ComponentProps<typeof Button>, '$size' | '$variant'> {
  $size?: number
}

export default styled(Button)<CircularButtonProps>`
  width: ${({ $size = 36 }) => $size}px;
  height: ${({ $size = 36 }) => $size}px;
  ${({ theme, $variant = 'primary' }) => css`
    background-color: ${theme.colors[$variant]};
    color: ${theme.colors.white};
  `}
  padding: 0;
  border-radius: 50%;
`
