import { ReactNode, HTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'shared/lib/utils'

const boxVariants = cva('transition-all duration-200 ease-out', {
  variants: {
    p: { none: 'p-0', xs: 'p-xs', sm: 'p-sm', md: 'p-md', lg: 'p-lg', xl: 'p-xl' },
    pt: { none: 'pt-0', xs: 'pt-xs', sm: 'pt-sm', md: 'pt-md', lg: 'pt-lg', xl: 'pt-xl' },
    pb: { none: 'pb-0', xs: 'pb-xs', sm: 'pb-sm', md: 'pb-md', lg: 'pb-lg', xl: 'pb-xl' },
    pl: { none: 'pl-0', xs: 'pl-xs', sm: 'pl-sm', md: 'pl-md', lg: 'pl-lg', xl: 'pl-xl' },
    pr: { none: 'pr-0', xs: 'pr-xs', sm: 'pr-sm', md: 'pr-md', lg: 'pr-lg', xl: 'pr-xl' },
    px: { none: 'px-0', xs: 'px-xs', sm: 'px-sm', md: 'px-md', lg: 'px-lg', xl: 'px-xl' },
    py: { none: 'py-0', xs: 'py-xs', sm: 'py-sm', md: 'py-md', lg: 'py-lg', xl: 'py-xl' },
    m: { none: 'm-0', xs: 'm-xs', sm: 'm-sm', md: 'm-md', lg: 'm-lg', xl: 'm-xl' },
    mt: { none: 'mt-0', xs: 'mt-xs', sm: 'mt-sm', md: 'mt-md', lg: 'mt-lg', xl: 'mt-xl' },
    mb: { none: 'mb-0', xs: 'mb-xs', sm: 'mb-xs', md: 'mb-md', lg: 'mb-lg', xl: 'mb-xl' },
    ml: { none: 'ml-0', xs: 'ml-xs', sm: 'ml-sm', md: 'ml-md', lg: 'ml-lg', xl: 'ml-xl' },
    mr: { none: 'mr-0', xs: 'mr-xs', sm: 'mr-sm', md: 'mr-md', lg: 'mr-lg', xl: 'mr-xl' },
    mx: { none: 'mx-0', xs: 'mx-xs', sm: 'mx-sm', md: 'mx-md', lg: 'mx-lg', xl: 'mx-xl' },
    my: { none: 'my-0', xs: 'my-xs', sm: 'my-sm', md: 'my-md', lg: 'my-lg', xl: 'my-xl' },
    display: {
      block: 'block',
      inline: 'inline',
      'inline-block': 'inline-block',
      flex: 'flex',
      grid: 'grid',
      none: 'hidden',
      'flex | none': 'flex sm:hidden',
      'none | flex': 'hidden sm:flex',
    },
    flex: { true: 'flex' },
    grid: { true: 'grid' },
    direction: { row: 'flex-row', column: 'flex-col' },
    align: {
      'flex-start': 'items-start',
      center: 'items-center',
      'flex-end': 'items-end',
      stretch: 'items-stretch',
    },
    justify: {
      'flex-start': 'justify-start',
      center: 'justify-center',
      'flex-end': 'justify-end',
      'space-between': 'justify-between',
      'space-around': 'justify-around',
      'space-evenly': 'justify-evenly',
    },
    gap: { none: 'gap-0', xs: 'gap-xs', sm: 'gap-sm', md: 'gap-md', lg: 'gap-lg', xl: 'gap-xl' },
    bg: {
      surfaceLight: 'bg-surface-light',
      surfaceDark: 'bg-surface-dark',
      primary: 'bg-primary',
      secondary: 'bg-secondary',
      white: 'bg-white',
      black: 'bg-black',
      transparent: 'bg-transparent',
      elevated: 'shadow-md bg-white dark:bg-surface-dark',
    },
    radius: { none: 'rounded-none', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', full: 'rounded-full' },
    shadow: { none: 'shadow-none', sm: 'shadow-sm', md: 'shadow-md', lg: 'shadow-lg', xl: 'shadow-xl' },
    pointer: { true: 'cursor-pointer' },
    width: {
      full: 'w-full',
      half: 'w-1/2',
      auto: 'w-auto',
      '100%': 'w-full',
      '200px': 'w-[200px]',
      '150px': 'w-[150px]',
    },
    height: { full: 'h-full', screen: 'h-screen', auto: 'h-auto' },
    position: { static: 'static', relative: 'relative', absolute: 'absolute', fixed: 'fixed', sticky: 'sticky' },
    maxWidth: {
      none: 'max-w-none',
      xs: 'max-w-xs',
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl',
      '3xl': 'max-w-3xl',
      '4xl': 'max-w-4xl',
      '5xl': 'max-w-5xl',
      full: 'max-w-full',
      '1200px': 'max-w-[1200px]',
      '1000px': 'max-w-[1000px]',
      '800px': 'max-w-[800px]',
      '600px': 'max-w-[600px]',
      '400px': 'max-w-[400px]',
    },
  },
  defaultVariants: {
    display: 'block',
  },
})

export interface BoxProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof boxVariants> {
  children?: ReactNode
  minHeight?: string
  maxHeight?: string
  overflowY?: string
  tabletP?: string
  desktopP?: string
  tabletDisplay?: string
  tabletDirection?: 'row' | 'column'
  gridColumns?: string
  tabletGridColumns?: string
  desktopGridColumns?: string
  tabletGap?: string
  desktopGap?: string
  tabletP_?: string
  desktopP_?: string
  as?: React.ElementType
  touchTargets?: boolean
  overflow?: string
}

const Box = forwardRef<HTMLElement, BoxProps>(
  (
    {
      className,
      p,
      pt,
      pb,
      pl,
      pr,
      px,
      py,
      m,
      mt,
      mb,
      ml,
      mr,
      mx,
      my,
      display,
      flex,
      grid,
      direction,
      align,
      justify,
      gap,
      bg,
      radius,
      shadow,
      pointer,
      width,
      height,
      position,
      maxWidth,
      minHeight,
      maxHeight,
      overflowY,
      tabletP,
      desktopP,
      tabletDisplay,
      tabletDirection,
      gridColumns,
      tabletGridColumns,
      desktopGridColumns,
      tabletGap,
      desktopGap,
      touchTargets,
      overflow,
      as: Component = 'div',
      ...props
    },
    ref
  ) => {
    return (
      <Component
        ref={ref}
        className={cn(
          boxVariants({
            p,
            pt,
            pb,
            pl,
            pr,
            px,
            py,
            m,
            mt,
            mb,
            ml,
            mr,
            mx,
            my,
            display,
            flex,
            grid,
            direction,
            align,
            justify,
            gap,
            bg,
            radius,
            shadow,
            pointer,
            width,
            height,
            position,
            maxWidth,
            className,
          }),
          tabletDirection === 'row' && 'sm:flex-row',
          tabletDirection === 'column' && 'sm:flex-col',
          tabletDisplay && `sm:${tabletDisplay}`,
          touchTargets && '[&>*]:min-h-[44px] [&_button]:min-h-[44px]',
          gridColumns && `grid-cols-${gridColumns}`,
          tabletGridColumns && `sm:grid-cols-${tabletGridColumns}`,
          desktopGridColumns && `lg:grid-cols-${desktopGridColumns}`
        )}
        style={{
          minHeight,
          maxHeight,
          overflowY: overflowY || overflow,
          ...props.style,
        }}
        {...props}
      />
    )
  }
)

Box.displayName = 'Box'

export default Box
