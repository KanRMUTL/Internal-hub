import styled, { css } from 'styled-components'
import { FontSizeKeys, ColorKeys, BorderRadiusKeys, ShadowKeys } from 'shared/styles'

interface ButtonProps {
  $variant?: ColorKeys
  $size?: FontSizeKeys
  $rounded?: BorderRadiusKeys
  $shadow?: ShadowKeys
  $fullWidth?: boolean
}

export default styled.button<ButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      width: 100%;
    `}

  ${({ theme, $size = 'base' }) => css`
    font-size: ${theme.fontSizes[$size]};
    padding: ${$size === 'sm'
      ? `${theme.spacing.xs} ${theme.spacing.sm}`
      : $size === 'lg'
        ? `${theme.spacing.md} ${theme.spacing.lg}`
        : `${theme.spacing.sm} ${theme.spacing.md}`};
  `}

  ${({ theme, $variant = 'primary' }) => css`
    background-color: ${theme.colors[$variant]};
    color: ${theme.colors.white};
  `}

  ${({ theme, $rounded = 'md' }) => css`
    border-radius: ${theme.borderRadius[$rounded]};
  `}

  ${({ theme, $shadow = 'md' }) =>
    $shadow &&
    css`
      box-shadow: ${theme.shadow[$shadow]};
    `}

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background-color: ${(props) => props.theme.colors.grey};
    cursor: not-allowed;
    opacity: 0.6;
  }
`
