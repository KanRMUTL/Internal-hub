import styled, { css } from 'styled-components'
import { FontSizeKeys, ColorKeys, FontWeightKeys } from 'shared/styles'

export interface TypogaphyProps {
  $size?: FontSizeKeys
  $color?: ColorKeys
  $align?: 'left' | 'center' | 'right'
  $weight?: FontWeightKeys
  $pointer?: boolean
  $inline?: boolean
  $noWrap?: boolean
}

export default styled.p<TypogaphyProps>`
  font-size: ${({ theme, $size = 'base' }) => theme.fontSizes[$size]};
  font-weight: ${({ theme, $weight }) => ($weight ? theme.fontWeight[$weight] : theme.fontWeight['normal'])};
  color: ${({ theme, $color }) => ($color ? theme.colors[$color] : theme.text)};
  text-align: ${({ $align }) => $align || 'left'};
  display: ${({ $inline }) => ($inline ? 'inline' : 'block')};
  cursor: ${({ $pointer }) => ($pointer ? 'pointer' : 'auto')};
  margin: 0;
  ${({ $noWrap }) =>
    $noWrap &&
    css`
      white-space: nowrap;
    `}
`
