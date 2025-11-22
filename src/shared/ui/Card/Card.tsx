import { ReactNode } from 'react'
import styled, { css } from 'styled-components'
import { motion } from 'motion/react'
import Box from '../Box'
import { BorderWidthKeys, ColorKeys, ShadowKeys, BorderRadiusKeys } from 'shared/styles'

interface BorderStyle {
  width: BorderWidthKeys
  color: ColorKeys
  style: string
}

interface CardProps {
  $border?: BorderStyle
  $shadow?: ShadowKeys
  $rounded?: BorderRadiusKeys
  $interactive?: boolean
  $padding?: 'sm' | 'md' | 'lg'
  children?: ReactNode
  className?: string
  onClick?: () => void
}

const Card = ({
  $border,
  $shadow = 'md',
  $rounded = 'lg',
  $interactive = false,
  $padding = 'md',
  children,
  className,
  onClick,
  ...rest
}: CardProps) => {
  const Component = $interactive ? motion.div : 'div'

  const motionProps = $interactive
    ? {
        whileHover: {
          scale: 1.01,
          transition: { duration: 0.15, ease: [0.0, 0.0, 0.2, 1] },
        },
        whileTap: {
          scale: 0.99,
          transition: { duration: 0.1, ease: [0.4, 0.0, 1, 1] },
        },
        transition: {
          duration: 0.25,
          ease: [0.4, 0.0, 0.2, 1],
        },
      }
    : {}

  return (
    <StyledCard
      as={Component}
      $border={$border}
      $shadow={$shadow}
      $rounded={$rounded}
      $interactive={$interactive}
      $padding={$padding}
      className={className}
      onClick={onClick}
      {...motionProps}
      {...rest}
    >
      {children}
    </StyledCard>
  )
}

export default Card

const StyledCard = styled(Box)<CardProps>`
  position: relative;
  background-color: ${({ theme }) => theme.background.surface};
  border: 1px solid ${({ theme }) => theme.colors.grey[200]};
  transition: ${({ theme }) => theme.motion.transitions.default};

  /* Border styling */
  ${({ theme, $border }) => $border?.width && `border-width: ${theme.borderWidth[$border.width]};`}
  ${({ $border }) => $border?.style && `border-style: ${$border.style};`}
  ${({ theme, $border }) => $border?.color && `border-color: ${theme.colors[$border.color]};`}

  /* Border radius */
  ${({ theme, $rounded = 'lg' }) => css`
    border-radius: ${theme.borderRadius[$rounded]};
  `}

  /* Shadow */
  ${({ theme, $shadow = 'md' }) => css`
    box-shadow: ${theme.shadow[$shadow]};
  `}

  /* Padding variants */
  ${({ theme, $padding = 'md' }) => {
    const paddingConfig = {
      sm: theme.spacing.sm,
      md: theme.spacing.md,
      lg: theme.spacing.lg,
    }
    return css`
      padding: ${paddingConfig[$padding]};
    `
  }}

  /* Interactive states */
  ${({ $interactive, theme }) =>
    $interactive &&
    css`
      cursor: pointer;

      &:hover {
        box-shadow: ${theme.shadow.md};

        /* Enhanced background contrast for better readability */
        background-color: ${theme.background.surface};
        filter: brightness(1.02);
      }

      &:focus {
        outline: none;
        box-shadow:
          ${theme.shadow.lg},
          0 0 0 3px ${theme.colors.focus};
        border-color: ${theme.colors.primary};
      }

      &:active {
        box-shadow: ${theme.shadow.sm};
      }
    `}

  /* Dark theme enhancements */
  ${({ theme, $interactive }) =>
    theme.mode === 'dark' &&
    css`
      background-color: ${theme.background.surface};
      border-color: ${theme.colors.grey[700]};

      ${$interactive &&
      css`
        &:hover {
          border-color: ${theme.colors.grey[600]};
          background-color: ${theme.background.surface};
          filter: brightness(1.05);
        }
      `}
    `}

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    transition: ${({ theme }) => theme.motion.reducedMotion.transitions};
  }
`
