import { HTMLAttributes, forwardRef } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import { SpacingKeys } from '../../styles'

const responsiveSpacingVariants = cva('', {
  variants: {
    $p: {
      xxs: 'p-xxs',
      xs: 'p-xs',
      sm: 'p-sm',
      md: 'p-md',
      lg: 'p-lg',
      xl: 'p-xl',
      xxl: 'p-xxl',
    },
    $tabletP: {
      xxs: 'mobile:p-xxs',
      xs: 'mobile:p-xs',
      sm: 'mobile:p-sm',
      md: 'mobile:p-md',
      lg: 'mobile:p-lg',
      xl: 'mobile:p-xl',
      xxl: 'mobile:p-xxl',
    },
    $desktopP: {
      xxs: 'tablet:p-xxs',
      xs: 'tablet:p-xs',
      sm: 'tablet:p-sm',
      md: 'tablet:p-md',
      lg: 'tablet:p-lg',
      xl: 'tablet:p-xl',
      xxl: 'tablet:p-xxl',
    },
    $widescreenP: {
      xxs: 'desktop:p-xxs',
      xs: 'desktop:p-xs',
      sm: 'desktop:p-sm',
      md: 'desktop:p-md',
      lg: 'desktop:p-lg',
      xl: 'desktop:p-xl',
      xxl: 'desktop:p-xxl',
    },
    $m: {
      xxs: 'm-xxs',
      xs: 'm-xs',
      sm: 'm-sm',
      md: 'm-md',
      lg: 'm-lg',
      xl: 'm-xl',
      xxl: 'm-xxl',
    },
    $tabletM: {
      xxs: 'mobile:m-xxs',
      xs: 'mobile:m-xs',
      sm: 'mobile:m-sm',
      md: 'mobile:m-md',
      lg: 'mobile:m-lg',
      xl: 'mobile:m-xl',
      xxl: 'mobile:m-xxl',
    },
    $desktopM: {
      xxs: 'tablet:m-xxs',
      xs: 'tablet:m-xs',
      sm: 'tablet:m-sm',
      md: 'tablet:m-md',
      lg: 'tablet:m-lg',
      xl: 'tablet:m-xl',
      xxl: 'tablet:m-xxl',
    },
    $widescreenM: {
      xxs: 'desktop:m-xxs',
      xs: 'desktop:m-xs',
      sm: 'desktop:m-sm',
      md: 'desktop:m-md',
      lg: 'desktop:m-lg',
      xl: 'desktop:m-xl',
      xxl: 'desktop:m-xxl',
    },
    $pt: {
      xxs: 'pt-xxs',
      xs: 'pt-xs',
      sm: 'pt-sm',
      md: 'pt-md',
      lg: 'pt-lg',
      xl: 'pt-xl',
      xxl: 'pt-xxl',
    },
    $tabletPt: {
      xxs: 'mobile:pt-xxs',
      xs: 'mobile:pt-xs',
      sm: 'mobile:pt-sm',
      md: 'mobile:pt-md',
      lg: 'mobile:pt-lg',
      xl: 'mobile:pt-xl',
      xxl: 'mobile:pt-xxl',
    },
    $desktopPt: {
      xxs: 'tablet:pt-xxs',
      xs: 'tablet:pt-xs',
      sm: 'tablet:pt-sm',
      md: 'tablet:pt-md',
      lg: 'tablet:pt-lg',
      xl: 'tablet:pt-xl',
      xxl: 'tablet:pt-xxl',
    },
    $widescreenPt: {
      xxs: 'desktop:pt-xxs',
      xs: 'desktop:pt-xs',
      sm: 'desktop:pt-sm',
      md: 'desktop:pt-md',
      lg: 'desktop:pt-lg',
      xl: 'desktop:pt-xl',
      xxl: 'desktop:pt-xxl',
    },
    $pb: {
      xxs: 'pb-xxs',
      xs: 'pb-xs',
      sm: 'pb-sm',
      md: 'pb-md',
      lg: 'pb-lg',
      xl: 'pb-xl',
      xxl: 'pb-xxl',
    },
    $tabletPb: {
      xxs: 'mobile:pb-xxs',
      xs: 'mobile:pb-xs',
      sm: 'mobile:pb-sm',
      md: 'mobile:pb-md',
      lg: 'mobile:pb-lg',
      xl: 'mobile:pb-xl',
      xxl: 'mobile:pb-xxl',
    },
    $desktopPb: {
      xxs: 'tablet:pb-xxs',
      xs: 'tablet:pb-xs',
      sm: 'tablet:pb-sm',
      md: 'tablet:pb-md',
      lg: 'tablet:pb-lg',
      xl: 'tablet:pb-xl',
      xxl: 'tablet:pb-xxl',
    },
    $widescreenPb: {
      xxs: 'desktop:pb-xxs',
      xs: 'desktop:pb-xs',
      sm: 'desktop:pb-sm',
      md: 'desktop:pb-md',
      lg: 'desktop:pb-lg',
      xl: 'desktop:pb-xl',
      xxl: 'desktop:pb-xxl',
    },
    $pl: {
      xxs: 'pl-xxs',
      xs: 'pl-xs',
      sm: 'pl-sm',
      md: 'pl-md',
      lg: 'pl-lg',
      xl: 'pl-xl',
      xxl: 'pl-xxl',
    },
    $tabletPl: {
      xxs: 'mobile:pl-xxs',
      xs: 'mobile:pl-xs',
      sm: 'mobile:pl-sm',
      md: 'mobile:pl-md',
      lg: 'mobile:pl-lg',
      xl: 'mobile:pl-xl',
      xxl: 'mobile:pl-xxl',
    },
    $desktopPl: {
      xxs: 'tablet:pl-xxs',
      xs: 'tablet:pl-xs',
      sm: 'tablet:pl-sm',
      md: 'tablet:pl-md',
      lg: 'tablet:pl-lg',
      xl: 'tablet:pl-xl',
      xxl: 'tablet:pl-xxl',
    },
    $widescreenPl: {
      xxs: 'desktop:pl-xxs',
      xs: 'desktop:pl-xs',
      sm: 'desktop:pl-sm',
      md: 'desktop:pl-md',
      lg: 'desktop:pl-lg',
      xl: 'desktop:pl-xl',
      xxl: 'desktop:pl-xxl',
    },
    $pr: {
      xxs: 'pr-xxs',
      xs: 'pr-xs',
      sm: 'pr-sm',
      md: 'pr-md',
      lg: 'pr-lg',
      xl: 'pr-xl',
      xxl: 'pr-xxl',
    },
    $tabletPr: {
      xxs: 'mobile:pr-xxs',
      xs: 'mobile:pr-xs',
      sm: 'mobile:pr-sm',
      md: 'mobile:pr-md',
      lg: 'mobile:pr-lg',
      xl: 'mobile:pr-xl',
      xxl: 'mobile:pr-xxl',
    },
    $desktopPr: {
      xxs: 'tablet:pr-xxs',
      xs: 'tablet:pr-xs',
      sm: 'tablet:pr-sm',
      md: 'tablet:pr-md',
      lg: 'tablet:pr-lg',
      xl: 'tablet:pr-xl',
      xxl: 'tablet:pr-xxl',
    },
    $widescreenPr: {
      xxs: 'desktop:pr-xxs',
      xs: 'desktop:pr-xs',
      sm: 'desktop:pr-sm',
      md: 'desktop:pr-md',
      lg: 'desktop:pr-lg',
      xl: 'desktop:pr-xl',
      xxl: 'desktop:pr-xxl',
    },
    $px: {
      xxs: 'px-xxs',
      xs: 'px-xs',
      sm: 'px-sm',
      md: 'px-md',
      lg: 'px-lg',
      xl: 'px-xl',
      xxl: 'px-xxl',
    },
    $tabletPx: {
      xxs: 'mobile:px-xxs',
      xs: 'mobile:px-xs',
      sm: 'mobile:px-sm',
      md: 'mobile:px-md',
      lg: 'mobile:px-lg',
      xl: 'mobile:px-xl',
      xxl: 'mobile:px-xxl',
    },
    $desktopPx: {
      xxs: 'tablet:px-xxs',
      xs: 'tablet:px-xs',
      sm: 'tablet:px-sm',
      md: 'tablet:px-md',
      lg: 'tablet:px-lg',
      xl: 'tablet:px-xl',
      xxl: 'tablet:px-xxl',
    },
    $widescreenPx: {
      xxs: 'desktop:px-xxs',
      xs: 'desktop:px-xs',
      sm: 'desktop:px-sm',
      md: 'desktop:px-md',
      lg: 'desktop:px-lg',
      xl: 'desktop:px-xl',
      xxl: 'desktop:px-xxl',
    },
    $py: {
      xxs: 'py-xxs',
      xs: 'py-xs',
      sm: 'py-sm',
      md: 'py-md',
      lg: 'py-lg',
      xl: 'py-xl',
      xxl: 'py-xxl',
    },
    $tabletPy: {
      xxs: 'mobile:py-xxs',
      xs: 'mobile:py-xs',
      sm: 'mobile:py-sm',
      md: 'mobile:py-md',
      lg: 'mobile:py-lg',
      xl: 'mobile:py-xl',
      xxl: 'mobile:py-xxl',
    },
    $desktopPy: {
      xxs: 'tablet:py-xxs',
      xs: 'tablet:py-xs',
      sm: 'tablet:py-sm',
      md: 'tablet:py-md',
      lg: 'tablet:py-lg',
      xl: 'tablet:py-xl',
      xxl: 'tablet:py-xxl',
    },
    $widescreenPy: {
      xxs: 'desktop:py-xxs',
      xs: 'desktop:py-xs',
      sm: 'desktop:py-sm',
      md: 'desktop:py-md',
      lg: 'desktop:py-lg',
      xl: 'desktop:py-xl',
      xxl: 'desktop:py-xxl',
    },
    $mt: {
      xxs: 'mt-xxs',
      xs: 'mt-xs',
      sm: 'mt-sm',
      md: 'mt-md',
      lg: 'mt-lg',
      xl: 'mt-xl',
      xxl: 'mt-xxl',
    },
    $tabletMt: {
      xxs: 'mobile:mt-xxs',
      xs: 'mobile:mt-xs',
      sm: 'mobile:mt-sm',
      md: 'mobile:mt-md',
      lg: 'mobile:mt-lg',
      xl: 'mobile:mt-xl',
      xxl: 'mobile:mt-xxl',
    },
    $desktopMt: {
      xxs: 'tablet:mt-xxs',
      xs: 'tablet:mt-xs',
      sm: 'tablet:mt-sm',
      md: 'tablet:mt-md',
      lg: 'tablet:mt-lg',
      xl: 'tablet:mt-xl',
      xxl: 'tablet:mt-xxl',
    },
    $widescreenMt: {
      xxs: 'desktop:mt-xxs',
      xs: 'desktop:mt-xs',
      sm: 'desktop:mt-sm',
      md: 'desktop:mt-md',
      lg: 'desktop:mt-lg',
      xl: 'desktop:mt-xl',
      xxl: 'desktop:mt-xxl',
    },
    $mb: {
      xxs: 'mb-xxs',
      xs: 'mb-xs',
      sm: 'mb-sm',
      md: 'mb-md',
      lg: 'mb-lg',
      xl: 'mb-xl',
      xxl: 'mb-xxl',
    },
    $tabletMb: {
      xxs: 'mobile:mb-xxs',
      xs: 'mobile:mb-xs',
      sm: 'mobile:mb-sm',
      md: 'mobile:mb-md',
      lg: 'mobile:mb-lg',
      xl: 'mobile:mb-xl',
      xxl: 'mobile:mb-xxl',
    },
    $desktopMb: {
      xxs: 'tablet:mb-xxs',
      xs: 'tablet:mb-xs',
      sm: 'tablet:mb-sm',
      md: 'tablet:mb-md',
      lg: 'tablet:mb-lg',
      xl: 'tablet:mb-xl',
      xxl: 'tablet:mb-xxl',
    },
    $widescreenMb: {
      xxs: 'desktop:mb-xxs',
      xs: 'desktop:mb-xs',
      sm: 'desktop:mb-sm',
      md: 'desktop:mb-md',
      lg: 'desktop:mb-lg',
      xl: 'desktop:mb-xl',
      xxl: 'desktop:mb-xxl',
    },
    $ml: {
      xxs: 'ml-xxs',
      xs: 'ml-xs',
      sm: 'ml-sm',
      md: 'ml-md',
      lg: 'ml-lg',
      xl: 'ml-xl',
      xxl: 'ml-xxl',
    },
    $tabletMl: {
      xxs: 'mobile:ml-xxs',
      xs: 'mobile:ml-xs',
      sm: 'mobile:ml-sm',
      md: 'mobile:ml-md',
      lg: 'mobile:ml-lg',
      xl: 'mobile:ml-xl',
      xxl: 'mobile:ml-xxl',
    },
    $desktopMl: {
      xxs: 'tablet:ml-xxs',
      xs: 'tablet:ml-xs',
      sm: 'tablet:ml-sm',
      md: 'tablet:ml-md',
      lg: 'tablet:ml-lg',
      xl: 'tablet:ml-xl',
      xxl: 'tablet:ml-xxl',
    },
    $widescreenMl: {
      xxs: 'desktop:ml-xxs',
      xs: 'desktop:ml-xs',
      sm: 'desktop:ml-sm',
      md: 'desktop:ml-md',
      lg: 'desktop:ml-lg',
      xl: 'desktop:ml-xl',
      xxl: 'desktop:ml-xxl',
    },
    $mr: {
      xxs: 'mr-xxs',
      xs: 'mr-xs',
      sm: 'mr-sm',
      md: 'mr-md',
      lg: 'mr-lg',
      xl: 'mr-xl',
      xxl: 'mr-xxl',
    },
    $tabletMr: {
      xxs: 'mobile:mr-xxs',
      xs: 'mobile:mr-xs',
      sm: 'mobile:mr-sm',
      md: 'mobile:mr-md',
      lg: 'mobile:mr-lg',
      xl: 'mobile:mr-xl',
      xxl: 'mobile:mr-xxl',
    },
    $desktopMr: {
      xxs: 'tablet:mr-xxs',
      xs: 'tablet:mr-xs',
      sm: 'tablet:mr-sm',
      md: 'tablet:mr-md',
      lg: 'tablet:mr-lg',
      xl: 'tablet:mr-xl',
      xxl: 'tablet:mr-xxl',
    },
    $widescreenMr: {
      xxs: 'desktop:mr-xxs',
      xs: 'desktop:mr-xs',
      sm: 'desktop:mr-sm',
      md: 'desktop:mr-md',
      lg: 'desktop:mr-lg',
      xl: 'desktop:mr-xl',
      xxl: 'desktop:mr-xxl',
    },
    $mx: {
      xxs: 'mx-xxs',
      xs: 'mx-xs',
      sm: 'mx-sm',
      md: 'mx-md',
      lg: 'mx-lg',
      xl: 'mx-xl',
      xxl: 'mx-xxl',
    },
    $tabletMx: {
      xxs: 'mobile:mx-xxs',
      xs: 'mobile:mx-xs',
      sm: 'mobile:mx-sm',
      md: 'mobile:mx-md',
      lg: 'mobile:mx-lg',
      xl: 'mobile:mx-xl',
      xxl: 'mobile:mx-xxl',
    },
    $desktopMx: {
      xxs: 'tablet:mx-xxs',
      xs: 'tablet:mx-xs',
      sm: 'tablet:mx-sm',
      md: 'tablet:mx-md',
      lg: 'tablet:mx-lg',
      xl: 'tablet:mx-xl',
      xxl: 'tablet:mx-xxl',
    },
    $widescreenMx: {
      xxs: 'desktop:mx-xxs',
      xs: 'desktop:mx-xs',
      sm: 'desktop:mx-sm',
      md: 'desktop:mx-md',
      lg: 'desktop:mx-lg',
      xl: 'desktop:mx-xl',
      xxl: 'desktop:mx-xxl',
    },
    $my: {
      xxs: 'my-xxs',
      xs: 'my-xs',
      sm: 'my-sm',
      md: 'my-md',
      lg: 'my-lg',
      xl: 'my-xl',
      xxl: 'my-xxl',
    },
    $tabletMy: {
      xxs: 'mobile:my-xxs',
      xs: 'mobile:my-xs',
      sm: 'mobile:my-sm',
      md: 'mobile:my-md',
      lg: 'mobile:my-lg',
      xl: 'mobile:my-xl',
      xxl: 'mobile:my-xxl',
    },
    $desktopMy: {
      xxs: 'tablet:my-xxs',
      xs: 'tablet:my-xs',
      sm: 'tablet:my-sm',
      md: 'tablet:my-md',
      lg: 'tablet:my-lg',
      xl: 'tablet:my-xl',
      xxl: 'tablet:my-xxl',
    },
    $widescreenMy: {
      xxs: 'desktop:my-xxs',
      xs: 'desktop:my-xs',
      sm: 'desktop:my-sm',
      md: 'desktop:my-md',
      lg: 'desktop:my-lg',
      xl: 'desktop:my-xl',
      xxl: 'desktop:my-xxl',
    },
  },
})

export interface ResponsiveSpacingProps extends HTMLAttributes<HTMLDivElement> {
  $p?: SpacingKeys
  $tabletP?: SpacingKeys
  $desktopP?: SpacingKeys
  $widescreenP?: SpacingKeys

  $m?: SpacingKeys
  $tabletM?: SpacingKeys
  $desktopM?: SpacingKeys
  $widescreenM?: SpacingKeys

  $pt?: SpacingKeys
  $tabletPt?: SpacingKeys
  $desktopPt?: SpacingKeys
  $widescreenPt?: SpacingKeys

  $pb?: SpacingKeys
  $tabletPb?: SpacingKeys
  $desktopPb?: SpacingKeys
  $widescreenPb?: SpacingKeys

  $pl?: SpacingKeys
  $tabletPl?: SpacingKeys
  $desktopPl?: SpacingKeys
  $widescreenPl?: SpacingKeys

  $pr?: SpacingKeys
  $tabletPr?: SpacingKeys
  $desktopPr?: SpacingKeys
  $widescreenPr?: SpacingKeys

  $px?: SpacingKeys
  $tabletPx?: SpacingKeys
  $desktopPx?: SpacingKeys
  $widescreenPx?: SpacingKeys

  $py?: SpacingKeys
  $tabletPy?: SpacingKeys
  $desktopPy?: SpacingKeys
  $widescreenPy?: SpacingKeys

  $mt?: SpacingKeys
  $tabletMt?: SpacingKeys
  $desktopMt?: SpacingKeys
  $widescreenMt?: SpacingKeys

  $mb?: SpacingKeys
  $tabletMb?: SpacingKeys
  $desktopMb?: SpacingKeys
  $widescreenMb?: SpacingKeys

  $ml?: SpacingKeys
  $tabletMl?: SpacingKeys
  $desktopMl?: SpacingKeys
  $widescreenMl?: SpacingKeys

  $mr?: SpacingKeys
  $tabletMr?: SpacingKeys
  $desktopMr?: SpacingKeys
  $widescreenMr?: SpacingKeys

  $mx?: SpacingKeys
  $tabletMx?: SpacingKeys
  $desktopMx?: SpacingKeys
  $widescreenMx?: SpacingKeys

  $my?: SpacingKeys
  $tabletMy?: SpacingKeys
  $desktopMy?: SpacingKeys
  $widescreenMy?: SpacingKeys
}

const ResponsiveSpacing = forwardRef<HTMLDivElement, ResponsiveSpacingProps>(
  (
    {
      $p,
      $tabletP,
      $desktopP,
      $widescreenP,
      $m,
      $tabletM,
      $desktopM,
      $widescreenM,
      $pt,
      $tabletPt,
      $desktopPt,
      $widescreenPt,
      $pb,
      $tabletPb,
      $desktopPb,
      $widescreenPb,
      $pl,
      $tabletPl,
      $desktopPl,
      $widescreenPl,
      $pr,
      $tabletPr,
      $desktopPr,
      $widescreenPr,
      $px,
      $tabletPx,
      $desktopPx,
      $widescreenPx,
      $py,
      $tabletPy,
      $desktopPy,
      $widescreenPy,
      $mt,
      $tabletMt,
      $desktopMt,
      $widescreenMt,
      $mb,
      $tabletMb,
      $desktopMb,
      $widescreenMb,
      $ml,
      $tabletMl,
      $desktopMl,
      $widescreenMl,
      $mr,
      $tabletMr,
      $desktopMr,
      $widescreenMr,
      $mx,
      $tabletMx,
      $desktopMx,
      $widescreenMx,
      $my,
      $tabletMy,
      $desktopMy,
      $widescreenMy,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          responsiveSpacingVariants({
            $p,
            $tabletP,
            $desktopP,
            $widescreenP,
            $m,
            $tabletM,
            $desktopM,
            $widescreenM,
            $pt,
            $tabletPt,
            $desktopPt,
            $widescreenPt,
            $pb,
            $tabletPb,
            $desktopPb,
            $widescreenPb,
            $pl,
            $tabletPl,
            $desktopPl,
            $widescreenPl,
            $pr,
            $tabletPr,
            $desktopPr,
            $widescreenPr,
            $px,
            $tabletPx,
            $desktopPx,
            $widescreenPx,
            $py,
            $tabletPy,
            $desktopPy,
            $widescreenPy,
            $mt,
            $tabletMt,
            $desktopMt,
            $widescreenMt,
            $mb,
            $tabletMb,
            $desktopMb,
            $widescreenMb,
            $ml,
            $tabletMl,
            $desktopMl,
            $widescreenMl,
            $mr,
            $tabletMr,
            $desktopMr,
            $widescreenMr,
            $mx,
            $tabletMx,
            $desktopMx,
            $widescreenMx,
            $my,
            $tabletMy,
            $desktopMy,
            $widescreenMy,
          }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

ResponsiveSpacing.displayName = 'ResponsiveSpacing'

export default ResponsiveSpacing
