import styled from 'styled-components'
import { FontSizeKeys, ColorKeys, FontWeightKeys } from 'shared/styles'

export interface TypogaphyProps {
  $size?: FontSizeKeys
  $color?: ColorKeys
  $align?: 'left' | 'center' | 'right'
  $weight?: FontWeightKeys
  $pointer?: boolean
}

export default styled.p<TypogaphyProps>`
  font-size: ${({ theme, $size = 'base' }) => theme.fontSizes[$size]};
  font-weight: ${({ theme, $weight = 'normal' }) => $weight || theme.fontWeight[$weight]};
  color: ${({ theme, $color }) => ($color ? theme.colors[$color] : theme.text)};
  text-align: ${({ $align }) => $align || 'left'};
  cursor: ${({ $pointer }) => ($pointer ? 'pointer' : 'auto')};
  margin: 0;
`
