import styled, { css } from 'styled-components'
import { SpacingKeys } from 'shared/styles'

export interface ResponsiveSpacingProps {
  // Responsive padding
  $p?: SpacingKeys
  $tabletP?: SpacingKeys
  $desktopP?: SpacingKeys
  $widescreenP?: SpacingKeys

  // Responsive margin
  $m?: SpacingKeys
  $tabletM?: SpacingKeys
  $desktopM?: SpacingKeys
  $widescreenM?: SpacingKeys

  // Responsive padding top
  $pt?: SpacingKeys
  $tabletPt?: SpacingKeys
  $desktopPt?: SpacingKeys
  $widescreenPt?: SpacingKeys

  // Responsive padding bottom
  $pb?: SpacingKeys
  $tabletPb?: SpacingKeys
  $desktopPb?: SpacingKeys
  $widescreenPb?: SpacingKeys

  // Responsive padding left
  $pl?: SpacingKeys
  $tabletPl?: SpacingKeys
  $desktopPl?: SpacingKeys
  $widescreenPl?: SpacingKeys

  // Responsive padding right
  $pr?: SpacingKeys
  $tabletPr?: SpacingKeys
  $desktopPr?: SpacingKeys
  $widescreenPr?: SpacingKeys

  // Responsive padding horizontal
  $px?: SpacingKeys
  $tabletPx?: SpacingKeys
  $desktopPx?: SpacingKeys
  $widescreenPx?: SpacingKeys

  // Responsive padding vertical
  $py?: SpacingKeys
  $tabletPy?: SpacingKeys
  $desktopPy?: SpacingKeys
  $widescreenPy?: SpacingKeys

  // Responsive margin top
  $mt?: SpacingKeys
  $tabletMt?: SpacingKeys
  $desktopMt?: SpacingKeys
  $widescreenMt?: SpacingKeys

  // Responsive margin bottom
  $mb?: SpacingKeys
  $tabletMb?: SpacingKeys
  $desktopMb?: SpacingKeys
  $widescreenMb?: SpacingKeys

  // Responsive margin left
  $ml?: SpacingKeys
  $tabletMl?: SpacingKeys
  $desktopMl?: SpacingKeys
  $widescreenMl?: SpacingKeys

  // Responsive margin right
  $mr?: SpacingKeys
  $tabletMr?: SpacingKeys
  $desktopMr?: SpacingKeys
  $widescreenMr?: SpacingKeys

  // Responsive margin horizontal
  $mx?: SpacingKeys
  $tabletMx?: SpacingKeys
  $desktopMx?: SpacingKeys
  $widescreenMx?: SpacingKeys

  // Responsive margin vertical
  $my?: SpacingKeys
  $tabletMy?: SpacingKeys
  $desktopMy?: SpacingKeys
  $widescreenMy?: SpacingKeys
}

const ResponsiveSpacing = styled.div<ResponsiveSpacingProps>`
  /* Base mobile styles */
  ${({ theme, $p }) =>
    $p &&
    css`
      padding: ${theme.spacing[$p]};
    `}
  ${({ theme, $m }) =>
    $m &&
    css`
      margin: ${theme.spacing[$m]};
    `}
  
  ${({ theme, $pt }) =>
    $pt &&
    css`
      padding-top: ${theme.spacing[$pt]};
    `}
  ${({ theme, $pb }) =>
    $pb &&
    css`
      padding-bottom: ${theme.spacing[$pb]};
    `}
  ${({ theme, $pl }) =>
    $pl &&
    css`
      padding-left: ${theme.spacing[$pl]};
    `}
  ${({ theme, $pr }) =>
    $pr &&
    css`
      padding-right: ${theme.spacing[$pr]};
    `}
  
  ${({ theme, $px }) =>
    $px &&
    css`
      padding-left: ${theme.spacing[$px]};
      padding-right: ${theme.spacing[$px]};
    `}
  ${({ theme, $py }) =>
    $py &&
    css`
      padding-top: ${theme.spacing[$py]};
      padding-bottom: ${theme.spacing[$py]};
    `}
  
  ${({ theme, $mt }) =>
    $mt &&
    css`
      margin-top: ${theme.spacing[$mt]};
    `}
  ${({ theme, $mb }) =>
    $mb &&
    css`
      margin-bottom: ${theme.spacing[$mb]};
    `}
  ${({ theme, $ml }) =>
    $ml &&
    css`
      margin-left: ${theme.spacing[$ml]};
    `}
  ${({ theme, $mr }) =>
    $mr &&
    css`
      margin-right: ${theme.spacing[$mr]};
    `}
  
  ${({ theme, $mx }) =>
    $mx &&
    css`
      margin-left: ${theme.spacing[$mx]};
      margin-right: ${theme.spacing[$mx]};
    `}
  ${({ theme, $my }) =>
    $my &&
    css`
      margin-top: ${theme.spacing[$my]};
      margin-bottom: ${theme.spacing[$my]};
    `}
  
  /* Tablet breakpoint */
  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    ${({ theme, $tabletP }) =>
      $tabletP &&
      css`
        padding: ${theme.spacing[$tabletP]};
      `}
    ${({ theme, $tabletM }) =>
      $tabletM &&
      css`
        margin: ${theme.spacing[$tabletM]};
      `}
    
    ${({ theme, $tabletPt }) =>
      $tabletPt &&
      css`
        padding-top: ${theme.spacing[$tabletPt]};
      `}
    ${({ theme, $tabletPb }) =>
      $tabletPb &&
      css`
        padding-bottom: ${theme.spacing[$tabletPb]};
      `}
    ${({ theme, $tabletPl }) =>
      $tabletPl &&
      css`
        padding-left: ${theme.spacing[$tabletPl]};
      `}
    ${({ theme, $tabletPr }) =>
      $tabletPr &&
      css`
        padding-right: ${theme.spacing[$tabletPr]};
      `}
    
    ${({ theme, $tabletPx }) =>
      $tabletPx &&
      css`
        padding-left: ${theme.spacing[$tabletPx]};
        padding-right: ${theme.spacing[$tabletPx]};
      `}
    ${({ theme, $tabletPy }) =>
      $tabletPy &&
      css`
        padding-top: ${theme.spacing[$tabletPy]};
        padding-bottom: ${theme.spacing[$tabletPy]};
      `}
    
    ${({ theme, $tabletMt }) =>
      $tabletMt &&
      css`
        margin-top: ${theme.spacing[$tabletMt]};
      `}
    ${({ theme, $tabletMb }) =>
      $tabletMb &&
      css`
        margin-bottom: ${theme.spacing[$tabletMb]};
      `}
    ${({ theme, $tabletMl }) =>
      $tabletMl &&
      css`
        margin-left: ${theme.spacing[$tabletMl]};
      `}
    ${({ theme, $tabletMr }) =>
      $tabletMr &&
      css`
        margin-right: ${theme.spacing[$tabletMr]};
      `}
    
    ${({ theme, $tabletMx }) =>
      $tabletMx &&
      css`
        margin-left: ${theme.spacing[$tabletMx]};
        margin-right: ${theme.spacing[$tabletMx]};
      `}
    ${({ theme, $tabletMy }) =>
      $tabletMy &&
      css`
        margin-top: ${theme.spacing[$tabletMy]};
        margin-bottom: ${theme.spacing[$tabletMy]};
      `}
  }

  /* Desktop breakpoint */
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    ${({ theme, $desktopP }) =>
      $desktopP &&
      css`
        padding: ${theme.spacing[$desktopP]};
      `}
    ${({ theme, $desktopM }) =>
      $desktopM &&
      css`
        margin: ${theme.spacing[$desktopM]};
      `}
    
    ${({ theme, $desktopPt }) =>
      $desktopPt &&
      css`
        padding-top: ${theme.spacing[$desktopPt]};
      `}
    ${({ theme, $desktopPb }) =>
      $desktopPb &&
      css`
        padding-bottom: ${theme.spacing[$desktopPb]};
      `}
    ${({ theme, $desktopPl }) =>
      $desktopPl &&
      css`
        padding-left: ${theme.spacing[$desktopPl]};
      `}
    ${({ theme, $desktopPr }) =>
      $desktopPr &&
      css`
        padding-right: ${theme.spacing[$desktopPr]};
      `}
    
    ${({ theme, $desktopPx }) =>
      $desktopPx &&
      css`
        padding-left: ${theme.spacing[$desktopPx]};
        padding-right: ${theme.spacing[$desktopPx]};
      `}
    ${({ theme, $desktopPy }) =>
      $desktopPy &&
      css`
        padding-top: ${theme.spacing[$desktopPy]};
        padding-bottom: ${theme.spacing[$desktopPy]};
      `}
    
    ${({ theme, $desktopMt }) =>
      $desktopMt &&
      css`
        margin-top: ${theme.spacing[$desktopMt]};
      `}
    ${({ theme, $desktopMb }) =>
      $desktopMb &&
      css`
        margin-bottom: ${theme.spacing[$desktopMb]};
      `}
    ${({ theme, $desktopMl }) =>
      $desktopMl &&
      css`
        margin-left: ${theme.spacing[$desktopMl]};
      `}
    ${({ theme, $desktopMr }) =>
      $desktopMr &&
      css`
        margin-right: ${theme.spacing[$desktopMr]};
      `}
    
    ${({ theme, $desktopMx }) =>
      $desktopMx &&
      css`
        margin-left: ${theme.spacing[$desktopMx]};
        margin-right: ${theme.spacing[$desktopMx]};
      `}
    ${({ theme, $desktopMy }) =>
      $desktopMy &&
      css`
        margin-top: ${theme.spacing[$desktopMy]};
        margin-bottom: ${theme.spacing[$desktopMy]};
      `}
  }

  /* Widescreen breakpoint */
  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    ${({ theme, $widescreenP }) =>
      $widescreenP &&
      css`
        padding: ${theme.spacing[$widescreenP]};
      `}
    ${({ theme, $widescreenM }) =>
      $widescreenM &&
      css`
        margin: ${theme.spacing[$widescreenM]};
      `}
    
    ${({ theme, $widescreenPt }) =>
      $widescreenPt &&
      css`
        padding-top: ${theme.spacing[$widescreenPt]};
      `}
    ${({ theme, $widescreenPb }) =>
      $widescreenPb &&
      css`
        padding-bottom: ${theme.spacing[$widescreenPb]};
      `}
    ${({ theme, $widescreenPl }) =>
      $widescreenPl &&
      css`
        padding-left: ${theme.spacing[$widescreenPl]};
      `}
    ${({ theme, $widescreenPr }) =>
      $widescreenPr &&
      css`
        padding-right: ${theme.spacing[$widescreenPr]};
      `}
    
    ${({ theme, $widescreenPx }) =>
      $widescreenPx &&
      css`
        padding-left: ${theme.spacing[$widescreenPx]};
        padding-right: ${theme.spacing[$widescreenPx]};
      `}
    ${({ theme, $widescreenPy }) =>
      $widescreenPy &&
      css`
        padding-top: ${theme.spacing[$widescreenPy]};
        padding-bottom: ${theme.spacing[$widescreenPy]};
      `}
    
    ${({ theme, $widescreenMt }) =>
      $widescreenMt &&
      css`
        margin-top: ${theme.spacing[$widescreenMt]};
      `}
    ${({ theme, $widescreenMb }) =>
      $widescreenMb &&
      css`
        margin-bottom: ${theme.spacing[$widescreenMb]};
      `}
    ${({ theme, $widescreenMl }) =>
      $widescreenMl &&
      css`
        margin-left: ${theme.spacing[$widescreenMl]};
      `}
    ${({ theme, $widescreenMr }) =>
      $widescreenMr &&
      css`
        margin-right: ${theme.spacing[$widescreenMr]};
      `}
    
    ${({ theme, $widescreenMx }) =>
      $widescreenMx &&
      css`
        margin-left: ${theme.spacing[$widescreenMx]};
        margin-right: ${theme.spacing[$widescreenMx]};
      `}
    ${({ theme, $widescreenMy }) =>
      $widescreenMy &&
      css`
        margin-top: ${theme.spacing[$widescreenMy]};
        margin-bottom: ${theme.spacing[$widescreenMy]};
      `}
  }
`

export default ResponsiveSpacing
