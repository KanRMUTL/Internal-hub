import styled, { css, keyframes } from 'styled-components'
import { BorderRadiusKeys } from 'shared/styles'

interface SkeletonProps {
  $width?: string
  $height?: string
  $rounded?: BorderRadiusKeys
  $variant?: 'text' | 'rectangular' | 'circular'
}

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`

const Skeleton = styled.div<SkeletonProps>`
  display: inline-block;
  background: ${({ theme }) => theme.colors.grey[200]};
  background-image: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.grey[200]} 0px,
    ${({ theme }) => theme.colors.grey[100]} 40px,
    ${({ theme }) => theme.colors.grey[200]} 80px
  );
  background-size: 200px 100%;
  background-repeat: no-repeat;
  animation: ${shimmer} 1.5s infinite linear;

  /* Dark theme support */
  ${({ theme }) =>
    theme.mode === 'dark' &&
    css`
      background: ${theme.colors.grey[700]};
      background-image: linear-gradient(
        90deg,
        ${theme.colors.grey[700]} 0px,
        ${theme.colors.grey[600]} 40px,
        ${theme.colors.grey[700]} 80px
      );
    `}

  /* Sizing */
  ${({ $width = '100%' }) => css`
    width: ${$width};
  `}
  ${({ $height = '1rem' }) => css`
    height: ${$height};
  `}

  /* Border radius */
  ${({ theme, $rounded = 'md' }) => css`
    border-radius: ${theme.borderRadius[$rounded]};
  `}

  /* Variants */
  ${({ $variant = 'rectangular' }) => {
    switch ($variant) {
      case 'text':
        return css`
          height: 1em;
          border-radius: 4px;
        `
      case 'circular':
        return css`
          border-radius: 50%;
        `
      case 'rectangular':
      default:
        return ''
    }
  }}

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    background-image: none;
    background: ${({ theme }) => theme.colors.grey[200]};

    ${({ theme }) =>
      theme.mode === 'dark' &&
      css`
        background: ${theme.colors.grey[700]};
      `}
  }
`

export default Skeleton
