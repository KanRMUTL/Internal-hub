import styled from 'styled-components'
import { ColorKeys, SpacingKeys, ShadowKeys, BorderRadiusKeys } from 'shared/styles'

export default styled.div<{
  $p?: SpacingKeys
  $m?: SpacingKeys
  $bg?: ColorKeys
  $radius?: BorderRadiusKeys
  $shadow?: ShadowKeys
  $flex?: boolean
  $direction?: 'row' | 'column'
  $align?: 'flex-start' | 'center' | 'flex-end'
  $justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between'
  $gap?: SpacingKeys
}>`
  padding: ${({ theme, $p }) => $p && theme.spacing[$p]};
  margin: ${({ theme, $m }) => $m && theme.spacing[$m]};
  background: ${({ theme, $bg }) => $bg && theme.colors[$bg]};
  border-radius: ${({ theme, $radius }) => $radius && theme.borderRadius[$radius]};
  box-shadow: ${({ theme, $shadow }) => $shadow && theme.shadow[$shadow]};

  ${({ $flex }) => $flex && 'display: flex;'}
  ${({ $direction }) => $direction && `flex-direction: ${$direction};`}
  ${({ $align }) => $align && `align-items: ${$align};`}
  ${({ $justify }) => $justify && `justify-content: ${$justify};`}
  ${({ theme, $gap }) => $gap && `gap: ${theme.spacing[$gap]};`}
`
