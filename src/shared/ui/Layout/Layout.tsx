import styled, { css } from 'styled-components'
import { SpacingKeys } from 'shared/styles'

export interface LayoutProps {
  // Layout type
  $type?: 'single' | 'sidebar' | 'three-column'

  // Responsive behavior
  $stackOnMobile?: boolean
  $sidebarCollapsible?: boolean

  // Spacing
  $gap?: SpacingKeys
  $tabletGap?: SpacingKeys
  $desktopGap?: SpacingKeys

  // Sidebar width (for sidebar layout)
  $sidebarWidth?: string
  $sidebarMinWidth?: string

  // Touch targets
  $touchTargets?: boolean
}

const Layout = styled.div<LayoutProps>`
  display: grid;
  width: 100%;
  min-height: 100vh;

  /* Base mobile styles - always stack on mobile */
  grid-template-columns: 1fr;
  gap: ${({ theme, $gap }) => ($gap ? theme.spacing[$gap] : theme.spacing.md)};

  /* Touch target sizing for mobile */
  ${({ $touchTargets }) =>
    $touchTargets &&
    css`
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
    ${({ $type, $sidebarMinWidth }) => {
      if ($type === 'sidebar') {
        return css`
          grid-template-columns: ${$sidebarMinWidth || '250px'} 1fr;
        `
      }
      if ($type === 'three-column') {
        return css`
          grid-template-columns: 1fr 2fr 1fr;
        `
      }
      return css`
        grid-template-columns: 1fr;
      `
    }}

    ${({ theme, $tabletGap }) =>
      $tabletGap &&
      css`
        gap: ${theme.spacing[$tabletGap]};
      `}
  }

  /* Desktop breakpoint */
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    ${({ $type, $sidebarWidth }) => {
      if ($type === 'sidebar') {
        return css`
          grid-template-columns: ${$sidebarWidth || '300px'} 1fr;
        `
      }
      if ($type === 'three-column') {
        return css`
          grid-template-columns: 1fr 2fr 1fr;
        `
      }
      return css`
        grid-template-columns: 1fr;
      `
    }}

    ${({ theme, $desktopGap }) =>
      $desktopGap &&
      css`
        gap: ${theme.spacing[$desktopGap]};
      `}
  }
`

export const LayoutSection = styled.section<{
  $order?: number
  $tabletOrder?: number
  $desktopOrder?: number
  $p?: SpacingKeys
  $tabletP?: SpacingKeys
  $desktopP?: SpacingKeys
}>`
  /* Base mobile styles */
  order: ${({ $order }) => $order || 0};
  padding: ${({ theme, $p }) => ($p ? theme.spacing[$p] : '0')};

  /* Tablet breakpoint */
  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    order: ${({ $tabletOrder, $order }) => $tabletOrder || $order || 0};
    ${({ theme, $tabletP }) =>
      $tabletP &&
      css`
        padding: ${theme.spacing[$tabletP]};
      `}
  }

  /* Desktop breakpoint */
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    order: ${({ $desktopOrder, $tabletOrder, $order }) => $desktopOrder || $tabletOrder || $order || 0};
    ${({ theme, $desktopP }) =>
      $desktopP &&
      css`
        padding: ${theme.spacing[$desktopP]};
      `}
  }
`

export default Layout
