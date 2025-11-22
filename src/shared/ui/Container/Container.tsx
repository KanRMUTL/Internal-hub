import styled, { css } from 'styled-components'
import { SpacingKeys } from 'shared/styles'

export interface ContainerProps {
  // Container sizing
  $maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | string
  $fluid?: boolean

  // Responsive padding
  $px?: SpacingKeys
  $tabletPx?: SpacingKeys
  $desktopPx?: SpacingKeys
  $widescreenPx?: SpacingKeys

  // Centering
  $centered?: boolean

  // Touch targets
  $touchTargets?: boolean
}

const getMaxWidth = (maxWidth?: string) => {
  switch (maxWidth) {
    case 'sm':
      return '640px'
    case 'md':
      return '768px'
    case 'lg':
      return '1024px'
    case 'xl':
      return '1280px'
    case 'full':
      return '100%'
    default:
      return maxWidth || '1280px'
  }
}

const Container = styled.div<ContainerProps>`
  width: 100%;
  ${({ $maxWidth, $fluid }) =>
    !$fluid &&
    css`
      max-width: ${getMaxWidth($maxWidth)};
    `}

  ${({ $centered }) =>
    $centered &&
    css`
      margin-left: auto;
      margin-right: auto;
    `}
  
  /* Base mobile padding */
  padding-left: ${({ theme, $px }) => ($px ? theme.spacing[$px] : theme.spacing.md)};
  padding-right: ${({ theme, $px }) => ($px ? theme.spacing[$px] : theme.spacing.md)};

  /* Touch target sizing for mobile */
  ${({ $touchTargets }) =>
    $touchTargets &&
    css`
      & > * {
        min-height: 44px;
      }

      & button,
      & [role='button'],
      & input[type='button'],
      & input[type='submit'],
      & a {
        min-height: 44px;
        min-width: 44px;
      }
    `}

  /* Tablet breakpoint */
  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    ${({ theme, $tabletPx }) =>
      $tabletPx &&
      css`
        padding-left: ${theme.spacing[$tabletPx]};
        padding-right: ${theme.spacing[$tabletPx]};
      `}
  }

  /* Desktop breakpoint */
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    ${({ theme, $desktopPx }) =>
      $desktopPx &&
      css`
        padding-left: ${theme.spacing[$desktopPx]};
        padding-right: ${theme.spacing[$desktopPx]};
      `}
  }

  /* Widescreen breakpoint */
  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    ${({ theme, $widescreenPx }) =>
      $widescreenPx &&
      css`
        padding-left: ${theme.spacing[$widescreenPx]};
        padding-right: ${theme.spacing[$widescreenPx]};
      `}
  }
`

export default Container
