import { ReactNode, ButtonHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { ColorKeys, BorderRadiusKeys, ShadowKeys } from 'shared/styles'
import Spinner from '../Spinner'
import { motionTransition, getScale } from 'shared/styles/utils'

type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  $variant?: ColorKeys
  $size?: ButtonSize
  $rounded?: BorderRadiusKeys
  $shadow?: ShadowKeys
  $fullWidth?: boolean
  $loading?: boolean
  $loadingText?: string
  children: ReactNode
}

const Button = ({
  $variant = 'primary',
  $size = 'md',
  $rounded = 'md',
  $shadow = 'md',
  $fullWidth = false,
  $loading = false,
  $loadingText = 'Loading...',
  disabled,
  children,
  'aria-label': ariaLabel,
  ...rest
}: ButtonProps) => {
  const isDisabled = disabled || $loading

  return (
    <StyledButton
      $variant={$variant}
      $size={$size}
      $rounded={$rounded}
      $shadow={$shadow}
      $fullWidth={$fullWidth}
      $loading={$loading}
      disabled={isDisabled}
      aria-label={$loading ? $loadingText : ariaLabel}
      aria-busy={$loading}
      {...rest}
    >
      {$loading && (
        <SpinnerWrapper aria-hidden="true">
          <Spinner size={$size === 'sm' ? 16 : $size === 'lg' ? 20 : 18} color="currentColor" />
        </SpinnerWrapper>
      )}
      <ContentWrapper $loading={$loading}>{children}</ContentWrapper>
    </StyledButton>
  )
}

export default Button

const StyledButton = styled.button<ButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  border: none;
  cursor: pointer;
  position: relative;
  ${motionTransition(['background-color', 'border-color', 'color', 'box-shadow', 'transform'], 'fast', 'easeOut', true)}
  backface-visibility: hidden;

  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      width: 100%;
    `}

  /* Size variants with consistent heights */
  ${({ theme, $size = 'md' }) => {
    const sizeConfig = {
      sm: {
        height: '32px',
        fontSize: theme.fontSizes.sm,
        padding: `0 ${theme.spacing.sm}`,
      },
      md: {
        height: '40px',
        fontSize: theme.fontSizes.base,
        padding: `0 ${theme.spacing.md}`,
      },
      lg: {
        height: '48px',
        fontSize: theme.fontSizes.lg,
        padding: `0 ${theme.spacing.lg}`,
      },
    }

    const config = sizeConfig[$size]
    return css`
      height: ${config.height};
      font-size: ${config.fontSize};
      padding: ${config.padding};
    `
  }}

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

  &:hover:not(:disabled) {
    transform: scale(${getScale('hover')});
    box-shadow: ${({ theme, $shadow = 'md' }) =>
      $shadow === 'sm' ? theme.shadow.md : $shadow === 'md' ? theme.shadow.lg : theme.shadow.xl};
    filter: brightness(1.05);
  }

  &:active:not(:disabled) {
    transform: scale(${getScale('active')});
  }

  &:focus {
    outline: none;
  }

  &:focus-visible:not(:disabled) {
    outline: none;
    box-shadow:
      ${({ theme, $shadow = 'md' }) =>
        $shadow === 'sm' ? theme.shadow.md : $shadow === 'md' ? theme.shadow.lg : theme.shadow.xl},
      ${({ theme }) => theme.shadow.focusVisible};
  }

  /* Fallback for browsers that don't support :focus-visible */
  &:focus:not(:focus-visible):not(:disabled) {
    box-shadow:
      ${({ theme, $shadow = 'md' }) =>
        $shadow === 'sm' ? theme.shadow.md : $shadow === 'md' ? theme.shadow.lg : theme.shadow.xl},
      ${({ theme }) => theme.shadow.focus};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.grey[300]};
    color: ${({ theme }) => theme.colors.grey[500]};
    cursor: not-allowed;
    opacity: 0.6;
    box-shadow: none;
  }
`

const SpinnerWrapper = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ContentWrapper = styled.div<{ $loading?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  opacity: ${({ $loading }) => ($loading ? 0 : 1)};
  ${motionTransition('opacity', 'fast', 'easeOut')}
`
