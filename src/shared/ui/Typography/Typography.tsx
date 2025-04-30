import styled from 'styled-components'
import { FontSizeKeys, ColorKeys, FontWeightKeys } from 'shared/styles'

export default styled.p<{
  $size?: FontSizeKeys
  $color?: ColorKeys
  $align?: 'left' | 'center' | 'right'
  $weight?: FontWeightKeys
}>`
  font-size: ${({ theme, $size = 'base' }) => theme.fontSizes[$size]};
  font-weight: ${({ theme, $weight = 'medium' }) => $weight || theme.fontWeight[$weight]};
  color: ${({ theme, $color = 'black' }) => theme.colors[$color]};
  text-align: ${({ $align }) => $align || 'left'};
  margin: 0;
`
