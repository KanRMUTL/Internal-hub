import styled from 'styled-components'
import { FontSizeKeys, ColorKeys, FontWeightKeys } from 'shared/styles'

export default styled.p<{
  $size?: FontSizeKeys
  $color?: ColorKeys
  $align?: 'left' | 'center' | 'right'
  $weight?: FontWeightKeys
  $pointer?: boolean
}>`
  font-size: ${({ theme, $size = 'base' }) => theme.fontSizes[$size]};
  font-weight: ${({ theme, $weight = 'normal' }) => $weight || theme.fontWeight[$weight]};
  color: ${({ theme, $color }) => ($color ? theme.colors[$color] : theme.text)};
  text-align: ${({ $align }) => $align || 'left'};
  cursor: ${({ $pointer }) => ($pointer ? 'pointer' : 'auto')};
  margin: 0;
`
