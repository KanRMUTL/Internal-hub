import styled from 'styled-components'
import { Box } from 'shared/ui'
import { BorderWidthKeys, ColorKeys } from 'shared/styles'

interface BorderStyle {
  width: BorderWidthKeys
  color: ColorKeys
  style: string
}

export default styled(Box)<{ $border: BorderStyle }>`
  transition: '0.2s ease-in-out';

  ${({ theme, $border }) => $border?.width && `border-width: ${theme.borderWidth[$border.width]};`}
  ${({ $border }) => $border?.style && `border-style: ${$border.style};`}
  ${({ theme, $border }) => $border?.color && `border-color: ${theme.colors[$border.color]};`}
`
