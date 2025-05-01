import styled from 'styled-components'
import { Color, ColorKeys } from 'shared/styles'

const getColor = (type: ColorKeys, colors: Color) => {
  return colors[type] || colors.info
}

const Alert = styled.div<{ $type: ColorKeys; $width?: string }>`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ $type, theme }) => {
    const color = getColor($type, theme.colors)
    return `${color}20`
  }};
  color: ${({ $type, theme }) => getColor($type, theme.colors)};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  border-left: 4px solid ${({ $type, theme }) => getColor($type, theme.colors)};
  width: ${({ $width }) => $width || 'fit-content'};
`

export default Alert
