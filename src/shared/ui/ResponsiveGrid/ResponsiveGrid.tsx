import { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { twMerge } from 'tailwind-merge'
import { clsx, type ClassValue } from 'clsx'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const responsiveGridVariants = cva('grid', {
  variants: {
    columns: {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
      12: 'grid-cols-12',
      none: 'grid-cols-none',
    },
    gap: {
      none: 'gap-0',
      xs: 'gap-xs',
      sm: 'gap-sm',
      md: 'gap-md',
      lg: 'gap-lg',
      xl: 'gap-xl',
    },
    alignItems: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    },
    justifyItems: {
      start: 'justify-items-start',
      center: 'justify-items-center',
      end: 'justify-items-end',
      stretch: 'justify-items-stretch',
    },
    touchTargets: {
      true: '[&>*]:min-h-[44px] [&>*]:min-w-[44px]',
      false: '',
    },
  },
  defaultVariants: {
    columns: 1,
    gap: 'md',
    alignItems: 'stretch',
    justifyItems: 'stretch',
    touchTargets: false,
  },
})

export interface ResponsiveGridProps extends ComponentProps<'div'>, VariantProps<typeof responsiveGridVariants> {
  tabletColumns?: ResponsiveGridProps['columns']
  desktopColumns?: ResponsiveGridProps['columns']
  widescreenColumns?: ResponsiveGridProps['columns']
}

const ResponsiveGrid = ({
  columns,
  gap,
  alignItems,
  justifyItems,
  touchTargets,
  tabletColumns,
  desktopColumns,
  widescreenColumns,
  className,
  ...props
}: ResponsiveGridProps) => {
  return (
    <div
      className={cn(
        responsiveGridVariants({
          columns,
          gap,
          alignItems,
          justifyItems,
          touchTargets,
        }),
        // Map responsive columns manually since CVA doesn't handle nested responsive objects easily without more boilerplate
        tabletColumns && `md:grid-cols-${tabletColumns}`,
        desktopColumns && `lg:grid-cols-${desktopColumns}`,
        widescreenColumns && `xl:grid-cols-${widescreenColumns}`,
        className
      )}
      {...props}
    />
  )
}

export default ResponsiveGrid
