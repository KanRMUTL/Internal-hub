import { InputHTMLAttributes, forwardRef, useState, useId } from 'react'
import styled, { css } from 'styled-components'
import { motion, AnimatePresence } from 'motion/react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  $floatingLabel?: boolean
  $variant?: 'default' | 'filled'
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      name,
      $floatingLabel = false,
      $variant = 'default',
      value,
      defaultValue,
      placeholder,
      ...rest
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false)
    const inputId = useId()
    const errorId = useId()
    const helperTextId = useId()
    const finalId = name || inputId

    const hasValue = Boolean(value || defaultValue)
    const shouldFloatLabel = $floatingLabel && (isFocused || hasValue)

    // Build aria-describedby
    const describedBy = []
    if (error) describedBy.push(errorId)
    if (helperText) describedBy.push(helperTextId)
    const ariaDescribedBy = describedBy.length > 0 ? describedBy.join(' ') : undefined

    return (
      <InputWrapper>
        <InputContainer $variant={$variant}>
          <StyledInput
            id={finalId}
            name={name}
            $hasError={!!error}
            $hasLabel={!!label}
            $floatingLabel={$floatingLabel}
            $variant={$variant}
            value={value}
            defaultValue={defaultValue}
            placeholder={$floatingLabel ? '' : placeholder}
            aria-invalid={!!error}
            aria-describedby={ariaDescribedBy}
            onFocus={(e) => {
              setIsFocused(true)
              rest.onFocus?.(e)
            }}
            onBlur={(e) => {
              setIsFocused(false)
              rest.onBlur?.(e)
            }}
            ref={ref}
            {...rest}
          />

          {label && (
            <Label
              htmlFor={finalId}
              $floating={$floatingLabel}
              $floated={shouldFloatLabel}
              $hasError={!!error}
              $focused={isFocused}
            >
              {label}
            </Label>
          )}

          {$floatingLabel && placeholder && shouldFloatLabel && <PlaceholderText>{placeholder}</PlaceholderText>}
        </InputContainer>

        {helperText && !error && <HelperText id={helperTextId}>{helperText}</HelperText>}

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -5, height: 0 }}
              transition={{ duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }}
            >
              <ErrorMessage id={errorId} role="alert" aria-live="polite">
                {error}
              </ErrorMessage>
            </motion.div>
          )}
        </AnimatePresence>
      </InputWrapper>
    )
  }
)

Input.displayName = 'Input'

export default Input

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const InputContainer = styled.div<{ $variant: 'default' | 'filled' }>`
  position: relative;
  display: flex;
  align-items: center;

  ${({ $variant, theme }) =>
    $variant === 'filled' &&
    css`
      background-color: ${theme.colors.grey[50]};
      border-radius: ${theme.borderRadius.md};

      ${theme.mode === 'dark' &&
      css`
        background-color: ${theme.colors.grey[800]};
      `}
    `}
`

const StyledInput = styled.input<{
  $hasError?: boolean
  $hasLabel?: boolean
  $floatingLabel?: boolean
  $variant: 'default' | 'filled'
}>`
  width: 100%;
  font-size: ${({ theme }) => theme.fontSizes.base};
  background-color: ${({ theme, $variant }) => ($variant === 'filled' ? 'transparent' : theme.background.surface)};
  color: ${({ theme }) => theme.text};
  border: ${({ $variant }) => ($variant === 'filled' ? 'none' : '2px solid')};
  border-color: ${({ theme, $hasError }) => ($hasError ? theme.colors.danger : theme.colors.grey[300])};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition:
    ${({ theme }) => theme.motion.transitions.colors},
    box-shadow ${({ theme }) => theme.motion.duration.fast} ${({ theme }) => theme.motion.easing.easeOut};

  /* Padding adjustments for floating labels */
  ${({ theme, $floatingLabel }) => {
    if ($floatingLabel) {
      return css`
        padding: ${theme.spacing.lg} ${theme.spacing.sm} ${theme.spacing.xs} ${theme.spacing.sm};
      `
    }
    return css`
      padding: ${theme.spacing.sm};
    `
  }}

  &:focus {
    outline: none;
    border-color: ${({ theme, $hasError }) => ($hasError ? theme.colors.danger : theme.colors.primary)};
  }

  &:focus-visible {
    box-shadow: ${({ theme, $hasError }) =>
      $hasError ? `0 0 0 3px ${theme.colors.danger}33` : theme.shadow.focusVisible};

    ${({ $variant, theme }) =>
      $variant === 'filled' &&
      css`
        box-shadow:
          inset 0 -2px 0 ${theme.colors.primary},
          ${theme.shadow.focusVisible};
      `}
  }

  /* Fallback for browsers that don't support :focus-visible */
  &:focus:not(:focus-visible) {
    box-shadow: ${({ theme, $hasError }) => ($hasError ? `0 0 0 3px ${theme.colors.danger}33` : theme.shadow.focus)};

    ${({ $variant, theme }) =>
      $variant === 'filled' &&
      css`
        box-shadow:
          inset 0 -2px 0 ${theme.colors.primary},
          ${theme.shadow.focus};
      `}
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.grey[400]};
    opacity: 1;
    transition: opacity ${({ theme }) => theme.motion.duration.fast} ${({ theme }) => theme.motion.easing.easeOut};
  }

  &:focus::placeholder {
    opacity: 0.7;
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.grey[100]};
    border-color: ${({ theme }) => theme.colors.grey[200]};
    color: ${({ theme }) => theme.colors.grey[400]};
    cursor: not-allowed;

    ${({ theme }) =>
      theme.mode === 'dark' &&
      css`
        background-color: ${theme.colors.grey[800]};
        border-color: ${theme.colors.grey[700]};
        color: ${theme.colors.grey[500]};
      `}
  }

  /* Dark theme enhancements */
  ${({ theme, $hasError }) =>
    theme.mode === 'dark' &&
    css`
      border-color: ${$hasError ? theme.colors.danger : theme.colors.grey[600]};

      &::placeholder {
        color: ${theme.colors.grey[500]};
      }
    `}

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    transition: ${({ theme }) => theme.motion.reducedMotion.transitions};
  }
`

const Label = styled.label<{
  $floating?: boolean
  $floated?: boolean
  $hasError?: boolean
  $focused?: boolean
}>`
  font-size: ${({ theme, $floating, $floated }) => ($floating && $floated ? theme.fontSizes.sm : theme.fontSizes.base)};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme, $hasError, $focused }) =>
    $hasError ? theme.colors.danger : $focused ? theme.colors.primary : theme.text};
  transition:
    ${({ theme }) => theme.motion.transitions.colors},
    transform ${({ theme }) => theme.motion.duration.medium} ${({ theme }) => theme.motion.easing.easeOut},
    font-size ${({ theme }) => theme.motion.duration.medium} ${({ theme }) => theme.motion.easing.easeOut};

  ${({ $floating, $floated, theme }) =>
    $floating
      ? css`
          position: absolute;
          left: ${theme.spacing.sm};
          pointer-events: none;
          z-index: 1;
          background-color: ${theme.background.surface};
          padding: 0 ${theme.spacing.xxs};

          ${$floated
            ? css`
                top: -${theme.spacing.xs};
                transform: translateY(0);
              `
            : css`
                top: 50%;
                transform: translateY(-50%);
              `}
        `
      : css`
          display: block;
          margin-bottom: ${theme.spacing.xs};
        `}

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    transition: ${({ theme }) => theme.motion.reducedMotion.transitions};
  }
`

const PlaceholderText = styled.span`
  position: absolute;
  left: ${({ theme }) => theme.spacing.sm};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.grey[400]};
  font-size: ${({ theme }) => theme.fontSizes.base};
  pointer-events: none;
  opacity: 0.7;
  z-index: 0;
`

const HelperText = styled.span`
  color: ${({ theme }) => theme.colors.grey[500]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeight.normal};
  margin-top: ${({ theme }) => theme.spacing.xs};
  display: block;
`

const ErrorMessage = styled.span`
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeight.normal};
  margin-top: ${({ theme }) => theme.spacing.xs};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxs};

  &::before {
    content: '⚠';
    font-size: ${({ theme }) => theme.fontSizes.sm};
    aria-hidden: true;
  }
`
