import styled, { css } from 'styled-components'
import { SpacingKeys, ShadowKeys, BorderRadiusKeys, BackgroundKeys } from 'shared/styles'

export interface BoxProps {
  // Base spacing
  $p?: SpacingKeys
  $m?: SpacingKeys

  // Responsive padding
  $tabletP?: SpacingKeys
  $desktopP?: SpacingKeys
  $widescreenP?: SpacingKeys

  // Responsive margin
  $tabletM?: SpacingKeys
  $desktopM?: SpacingKeys
  $widescreenM?: SpacingKeys

  // Directional padding
  $pt?: SpacingKeys
  $pb?: SpacingKeys
  $pl?: SpacingKeys
  $pr?: SpacingKeys
  $px?: SpacingKeys
  $py?: SpacingKeys

  // Responsive directional padding
  $tabletPt?: SpacingKeys
  $tabletPb?: SpacingKeys
  $tabletPl?: SpacingKeys
  $tabletPr?: SpacingKeys
  $tabletPx?: SpacingKeys
  $tabletPy?: SpacingKeys

  $desktopPt?: SpacingKeys
  $desktopPb?: SpacingKeys
  $desktopPl?: SpacingKeys
  $desktopPr?: SpacingKeys
  $desktopPx?: SpacingKeys
  $desktopPy?: SpacingKeys

  // Directional margin
  $mt?: SpacingKeys
  $mb?: SpacingKeys
  $ml?: SpacingKeys
  $mr?: SpacingKeys
  $mx?: SpacingKeys
  $my?: SpacingKeys

  // Responsive directional margin
  $tabletMt?: SpacingKeys
  $tabletMb?: SpacingKeys
  $tabletMl?: SpacingKeys
  $tabletMr?: SpacingKeys
  $tabletMx?: SpacingKeys
  $tabletMy?: SpacingKeys

  $desktopMt?: SpacingKeys
  $desktopMb?: SpacingKeys
  $desktopMl?: SpacingKeys
  $desktopMr?: SpacingKeys
  $desktopMx?: SpacingKeys
  $desktopMy?: SpacingKeys

  // Visual properties
  $bg?: BackgroundKeys
  $radius?: BorderRadiusKeys
  $shadow?: ShadowKeys

  // Layout properties
  $flex?: boolean
  $direction?: 'row' | 'column'
  $align?: 'flex-start' | 'center' | 'flex-end' | 'stretch'
  $justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'
  $flexWrap?: 'no-wrap' | 'wrap' | 'wrap-reverse'
  $gap?: SpacingKeys

  // Responsive layout
  $tabletDirection?: 'row' | 'column'
  $desktopDirection?: 'row' | 'column'
  $tabletAlign?: 'flex-start' | 'center' | 'flex-end' | 'stretch'
  $desktopAlign?: 'flex-start' | 'center' | 'flex-end' | 'stretch'
  $tabletJustify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'
  $desktopJustify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'
  $tabletGap?: SpacingKeys
  $desktopGap?: SpacingKeys

  // Grid properties
  $grid?: boolean
  $gridColumns?: string
  $gridRows?: string
  $tabletGridColumns?: string
  $desktopGridColumns?: string
  $tabletGridRows?: string
  $desktopGridRows?: string

  // Sizing
  $width?: string
  $height?: string
  $minWidth?: string
  $minHeight?: string
  $maxWidth?: string
  $maxHeight?: string

  // Responsive sizing
  $tabletWidth?: string
  $desktopWidth?: string
  $tabletHeight?: string
  $desktopHeight?: string

  // Display and visibility
  $display?: 'block' | 'inline' | 'inline-block' | 'flex' | 'grid' | 'none'
  $tabletDisplay?: 'block' | 'inline' | 'inline-block' | 'flex' | 'grid' | 'none'
  $desktopDisplay?: 'block' | 'inline' | 'inline-block' | 'flex' | 'grid' | 'none'

  // Position
  $position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky'
  $top?: string
  $right?: string
  $bottom?: string
  $left?: string
  $zIndex?: number

  // Overflow
  $overflow?: 'visible' | 'hidden' | 'scroll' | 'auto'
  $overflowX?: 'visible' | 'hidden' | 'scroll' | 'auto'
  $overflowY?: 'visible' | 'hidden' | 'scroll' | 'auto'

  // Touch targets
  $touchTargets?: boolean

  // Interaction
  $pointer?: boolean
}

export default styled.div<BoxProps>`
  /* Base styles */
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
  
  /* Directional padding */
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
  
  /* Directional margin */
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
  
  /* Visual properties */
  ${({ theme, $bg }) =>
    $bg &&
    css`
      background: ${theme.background[$bg]};
    `}
  ${({ theme, $radius }) =>
    $radius &&
    css`
      border-radius: ${theme.borderRadius[$radius]};
    `}
  ${({ theme, $shadow }) =>
    $shadow &&
    css`
      box-shadow: ${theme.shadow[$shadow]};
    `}
  
  /* Layout properties */
  ${({ $display }) =>
    $display &&
    css`
      display: ${$display};
    `}
  ${({ $flex, $grid }) => {
    if ($grid)
      return css`
        display: grid;
      `
    if ($flex)
      return css`
        display: flex;
      `
    return ''
  }}
  
  ${({ $direction }) =>
    $direction &&
    css`
      flex-direction: ${$direction};
    `}
  ${({ $align }) =>
    $align &&
    css`
      align-items: ${$align};
    `}
  ${({ $justify }) =>
    $justify &&
    css`
      justify-content: ${$justify};
    `}
  ${({ $flexWrap }) =>
    $flexWrap &&
    css`
      flex-wrap: ${$flexWrap};
    `}
  ${({ theme, $gap }) =>
    $gap &&
    css`
      gap: ${theme.spacing[$gap]};
    `}
  
  /* Grid properties */
  ${({ $gridColumns }) =>
    $gridColumns &&
    css`
      grid-template-columns: ${$gridColumns};
    `}
  ${({ $gridRows }) =>
    $gridRows &&
    css`
      grid-template-rows: ${$gridRows};
    `}
  
  /* Sizing */
  ${({ $width }) =>
    $width &&
    css`
      width: ${$width};
    `}
  ${({ $height }) =>
    $height &&
    css`
      height: ${$height};
    `}
  ${({ $minWidth }) =>
    $minWidth &&
    css`
      min-width: ${$minWidth};
    `}
  ${({ $minHeight }) =>
    $minHeight &&
    css`
      min-height: ${$minHeight};
    `}
  ${({ $maxWidth }) =>
    $maxWidth &&
    css`
      max-width: ${$maxWidth};
    `}
  ${({ $maxHeight }) =>
    $maxHeight &&
    css`
      max-height: ${$maxHeight};
    `}
  
  /* Position */
  ${({ $position }) =>
    $position &&
    css`
      position: ${$position};
    `}
  ${({ $top }) =>
    $top &&
    css`
      top: ${$top};
    `}
  ${({ $right }) =>
    $right &&
    css`
      right: ${$right};
    `}
  ${({ $bottom }) =>
    $bottom &&
    css`
      bottom: ${$bottom};
    `}
  ${({ $left }) =>
    $left &&
    css`
      left: ${$left};
    `}
  ${({ $zIndex }) =>
    $zIndex &&
    css`
      z-index: ${$zIndex};
    `}
  
  /* Overflow */
  ${({ $overflow }) =>
    $overflow &&
    css`
      overflow: ${$overflow};
    `}
  ${({ $overflowX }) =>
    $overflowX &&
    css`
      overflow-x: ${$overflowX};
    `}
  ${({ $overflowY }) =>
    $overflowY &&
    css`
      overflow-y: ${$overflowY};
    `}
  
  /* Interaction */
  ${({ $pointer }) =>
    $pointer &&
    css`
      cursor: pointer;
    `}
  
  /* Touch targets for mobile */
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
    
    /* Tablet directional padding */
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
    
    /* Tablet directional margin */
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
    
    /* Tablet layout */
    ${({ $tabletDisplay }) =>
      $tabletDisplay &&
      css`
        display: ${$tabletDisplay};
      `}
    ${({ $tabletDirection }) =>
      $tabletDirection &&
      css`
        flex-direction: ${$tabletDirection};
      `}
    ${({ $tabletAlign }) =>
      $tabletAlign &&
      css`
        align-items: ${$tabletAlign};
      `}
    ${({ $tabletJustify }) =>
      $tabletJustify &&
      css`
        justify-content: ${$tabletJustify};
      `}
    ${({ theme, $tabletGap }) =>
      $tabletGap &&
      css`
        gap: ${theme.spacing[$tabletGap]};
      `}
    
    /* Tablet grid */
    ${({ $tabletGridColumns }) =>
      $tabletGridColumns &&
      css`
        grid-template-columns: ${$tabletGridColumns};
      `}
    ${({ $tabletGridRows }) =>
      $tabletGridRows &&
      css`
        grid-template-rows: ${$tabletGridRows};
      `}
    
    /* Tablet sizing */
    ${({ $tabletWidth }) =>
      $tabletWidth &&
      css`
        width: ${$tabletWidth};
      `}
    ${({ $tabletHeight }) =>
      $tabletHeight &&
      css`
        height: ${$tabletHeight};
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
    
    /* Desktop directional padding */
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
    
    /* Desktop directional margin */
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
    
    /* Desktop layout */
    ${({ $desktopDisplay }) =>
      $desktopDisplay &&
      css`
        display: ${$desktopDisplay};
      `}
    ${({ $desktopDirection }) =>
      $desktopDirection &&
      css`
        flex-direction: ${$desktopDirection};
      `}
    ${({ $desktopAlign }) =>
      $desktopAlign &&
      css`
        align-items: ${$desktopAlign};
      `}
    ${({ $desktopJustify }) =>
      $desktopJustify &&
      css`
        justify-content: ${$desktopJustify};
      `}
    ${({ theme, $desktopGap }) =>
      $desktopGap &&
      css`
        gap: ${theme.spacing[$desktopGap]};
      `}
    
    /* Desktop grid */
    ${({ $desktopGridColumns }) =>
      $desktopGridColumns &&
      css`
        grid-template-columns: ${$desktopGridColumns};
      `}
    ${({ $desktopGridRows }) =>
      $desktopGridRows &&
      css`
        grid-template-rows: ${$desktopGridRows};
      `}
    
    /* Desktop sizing */
    ${({ $desktopWidth }) =>
      $desktopWidth &&
      css`
        width: ${$desktopWidth};
      `}
    ${({ $desktopHeight }) =>
      $desktopHeight &&
      css`
        height: ${$desktopHeight};
      `}
  }
`
