import styled, { css } from 'styled-components'
import { SpacingKeys } from 'shared/styles'

export interface ResponsiveGridProps {
  // Mobile-first responsive columns
  $columns?: number | string
  $tabletColumns?: number | string
  $desktopColumns?: number | string
  $widescreenColumns?: number | string

  // Responsive gaps
  $gap?: SpacingKeys
  $tabletGap?: SpacingKeys
  $desktopGap?: SpacingKeys
  $widescreenGap?: SpacingKeys

  // Responsive row gaps
  $rowGap?: SpacingKeys
  $tabletRowGap?: SpacingKeys
  $desktopRowGap?: SpacingKeys
  $widescreenRowGap?: SpacingKeys

  // Responsive column gaps
  $columnGap?: SpacingKeys
  $tabletColumnGap?: SpacingKeys
  $desktopColumnGap?: SpacingKeys
  $widescreenColumnGap?: SpacingKeys

  // Grid alignment
  $alignItems?: 'start' | 'center' | 'end' | 'stretch'
  $justifyItems?: 'start' | 'center' | 'end' | 'stretch'
  $justifyContent?: 'start' | 'center' | 'end' | 'stretch' | 'space-between' | 'space-around' | 'space-evenly'

  // Auto-fit and auto-fill options
  $autoFit?: boolean
  $autoFill?: boolean
  $minColumnWidth?: string
  $maxColumnWidth?: string

  // Touch target sizing
  $touchTargets?: boolean
}

const getColumnsValue = (
  columns: number | string | undefined,
  autoFit?: boolean,
  autoFill?: boolean,
  minWidth?: string,
  maxWidth?: string
) => {
  if (autoFit && minWidth) {
    return `repeat(auto-fit, minmax(${minWidth}, ${maxWidth || '1fr'}))`
  }
  if (autoFill && minWidth) {
    return `repeat(auto-fill, minmax(${minWidth}, ${maxWidth || '1fr'}))`
  }
  if (typeof columns === 'number') {
    return `repeat(${columns}, 1fr)`
  }
  return columns || 'none'
}

const ResponsiveGrid = styled.div<ResponsiveGridProps>`
  display: grid;

  /* Base mobile styles */
  grid-template-columns: ${({ $columns, $autoFit, $autoFill, $minColumnWidth, $maxColumnWidth }) =>
    getColumnsValue($columns, $autoFit, $autoFill, $minColumnWidth, $maxColumnWidth)};

  gap: ${({ theme, $gap }) => ($gap ? theme.spacing[$gap] : theme.spacing.md)};
  row-gap: ${({ theme, $rowGap, $gap }) =>
    $rowGap ? theme.spacing[$rowGap] : $gap ? theme.spacing[$gap] : theme.spacing.md};
  column-gap: ${({ theme, $columnGap, $gap }) =>
    $columnGap ? theme.spacing[$columnGap] : $gap ? theme.spacing[$gap] : theme.spacing.md};

  align-items: ${({ $alignItems }) => $alignItems || 'stretch'};
  justify-items: ${({ $justifyItems }) => $justifyItems || 'stretch'};
  justify-content: ${({ $justifyContent }) => $justifyContent || 'stretch'};

  /* Touch target sizing for mobile */
  ${({ $touchTargets }) =>
    $touchTargets &&
    css`
      & > * {
        min-height: 44px;
        min-width: 44px;
      }
    `}

  /* Tablet breakpoint */
  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    ${({ $tabletColumns, $autoFit, $autoFill, $minColumnWidth, $maxColumnWidth }) =>
      $tabletColumns &&
      css`
        grid-template-columns: ${getColumnsValue(
          $tabletColumns,
          $autoFit,
          $autoFill,
          $minColumnWidth,
          $maxColumnWidth
        )};
      `}

    ${({ theme, $tabletGap }) =>
      $tabletGap &&
      css`
        gap: ${theme.spacing[$tabletGap]};
      `}
    
    ${({ theme, $tabletRowGap }) =>
      $tabletRowGap &&
      css`
        row-gap: ${theme.spacing[$tabletRowGap]};
      `}
    
    ${({ theme, $tabletColumnGap }) =>
      $tabletColumnGap &&
      css`
        column-gap: ${theme.spacing[$tabletColumnGap]};
      `}
  }

  /* Desktop breakpoint */
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    ${({ $desktopColumns, $autoFit, $autoFill, $minColumnWidth, $maxColumnWidth }) =>
      $desktopColumns &&
      css`
        grid-template-columns: ${getColumnsValue(
          $desktopColumns,
          $autoFit,
          $autoFill,
          $minColumnWidth,
          $maxColumnWidth
        )};
      `}

    ${({ theme, $desktopGap }) =>
      $desktopGap &&
      css`
        gap: ${theme.spacing[$desktopGap]};
      `}
    
    ${({ theme, $desktopRowGap }) =>
      $desktopRowGap &&
      css`
        row-gap: ${theme.spacing[$desktopRowGap]};
      `}
    
    ${({ theme, $desktopColumnGap }) =>
      $desktopColumnGap &&
      css`
        column-gap: ${theme.spacing[$desktopColumnGap]};
      `}
  }

  /* Widescreen breakpoint */
  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    ${({ $widescreenColumns, $autoFit, $autoFill, $minColumnWidth, $maxColumnWidth }) =>
      $widescreenColumns &&
      css`
        grid-template-columns: ${getColumnsValue(
          $widescreenColumns,
          $autoFit,
          $autoFill,
          $minColumnWidth,
          $maxColumnWidth
        )};
      `}

    ${({ theme, $widescreenGap }) =>
      $widescreenGap &&
      css`
        gap: ${theme.spacing[$widescreenGap]};
      `}
    
    ${({ theme, $widescreenRowGap }) =>
      $widescreenRowGap &&
      css`
        row-gap: ${theme.spacing[$widescreenRowGap]};
      `}
    
    ${({ theme, $widescreenColumnGap }) =>
      $widescreenColumnGap &&
      css`
        column-gap: ${theme.spacing[$widescreenColumnGap]};
      `}
  }
`

export default ResponsiveGrid
