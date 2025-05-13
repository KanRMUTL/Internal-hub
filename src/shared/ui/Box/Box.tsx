import styled from 'styled-components'
import { SpacingKeys, ShadowKeys, BorderRadiusKeys, BackgroundKeys } from 'shared/styles'

export interface BoxProps {
  $p?: SpacingKeys
  $m?: SpacingKeys
  $bg?: BackgroundKeys
  $radius?: BorderRadiusKeys
  $shadow?: ShadowKeys
  $flex?: boolean
  $direction?: 'row' | 'column'
  $align?: 'flex-start' | 'center' | 'flex-end'
  $justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between'
  $flexWrap?: 'no-wrap' | 'wrap' | 'wrap-reverse'
  $gap?: SpacingKeys
  $pointer?: boolean
}

export default styled.div<BoxProps>`
  padding: ${({ theme, $p }) => $p && theme.spacing[$p]};
  margin: ${({ theme, $m }) => $m && theme.spacing[$m]};
  background: ${({ theme, $bg }) => $bg && theme.background[$bg]};
  border-radius: ${({ theme, $radius }) => $radius && theme.borderRadius[$radius]};
  box-shadow: ${({ theme, $shadow }) => $shadow && theme.shadow[$shadow]};
  cursor: ${({ $pointer }) => ($pointer ? 'pointer' : 'auto')};
  flex-wrap: ${({ $flexWrap = 'wrap' }) => $flexWrap};

  ${({ $flex }) => $flex && 'display: flex;'}
  ${({ $direction }) => $direction && `flex-direction: ${$direction};`}
  ${({ $align }) => $align && `align-items: ${$align};`}
  ${({ $justify }) => $justify && `justify-content: ${$justify};`}
  ${({ theme, $gap }) => $gap && `gap: ${theme.spacing[$gap]};`}
`
