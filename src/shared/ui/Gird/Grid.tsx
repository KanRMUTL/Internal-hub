import styled from 'styled-components'
import { SpacingKeys } from 'shared/styles'

export interface GridProps {
  $columns?: string
  $rows?: string
  $gap?: SpacingKeys
  $rowGap?: SpacingKeys
  $columnGap?: SpacingKeys
  $alignItems?: 'start' | 'center' | 'end' | 'stretch'
  $justifyItems?: 'start' | 'center' | 'end' | 'stretch'
  $pointer?: boolean
}

const Grid = styled.div<GridProps>`
  display: grid;
  grid-template-columns: ${({ $columns }) => $columns || 'none'};
  grid-template-rows: ${({ $rows }) => $rows || 'none'};
  gap: ${({ theme, $gap }) => $gap && theme.spacing[$gap]};
  row-gap: ${({ theme, $rowGap }) => $rowGap && theme.spacing[$rowGap]};
  column-gap: ${({ theme, $columnGap }) => $columnGap && theme.spacing[$columnGap]};
  align-items: ${({ $alignItems }) => $alignItems || 'stretch'};
  justify-items: ${({ $justifyItems }) => $justifyItems || 'stretch'};
  cursor: ${({ $pointer }) => ($pointer ? 'pointer' : 'auto')};
`

export default Grid
