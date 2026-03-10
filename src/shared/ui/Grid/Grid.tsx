import { HTMLAttributes } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import { SpacingKeys } from '../../styles'

const gridVariants = cva('grid', {
  variants: {
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
    pointer: {
      true: 'cursor-pointer',
      false: 'cursor-auto',
    },
    gap: {
      xxs: 'gap-xxs',
      xs: 'gap-xs',
      sm: 'gap-sm',
      md: 'gap-md',
      lg: 'gap-lg',
      xl: 'gap-xl',
      xxl: 'gap-xxl',
    },
    rowGap: {
      xxs: 'gap-y-xxs',
      xs: 'gap-y-xs',
      sm: 'gap-y-sm',
      md: 'gap-y-md',
      lg: 'gap-y-lg',
      xl: 'gap-y-xl',
      xxl: 'gap-y-xxl',
    },
    columnGap: {
      xxs: 'gap-x-xxs',
      xs: 'gap-x-xs',
      sm: 'gap-x-sm',
      md: 'gap-x-md',
      lg: 'gap-x-lg',
      xl: 'gap-x-xl',
      xxl: 'gap-x-xxl',
    },
  },
  defaultVariants: {
    alignItems: 'stretch',
    justifyItems: 'stretch',
    pointer: false,
  },
})

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  $columns?: string
  $rows?: string
  $gap?: SpacingKeys
  $rowGap?: SpacingKeys
  $columnGap?: SpacingKeys
  $alignItems?: 'start' | 'center' | 'end' | 'stretch'
  $justifyItems?: 'start' | 'center' | 'end' | 'stretch'
  $pointer?: boolean
}

const Grid = ({
  $columns,
  $rows,
  $gap,
  $rowGap,
  $columnGap,
  $alignItems,
  $justifyItems,
  $pointer,
  className,
  style,
  ...props
}: GridProps) => {
  return (
    <div
      className={cn(
        gridVariants({
          alignItems: $alignItems,
          justifyItems: $justifyItems,
          pointer: $pointer,
          gap: $gap,
          rowGap: $rowGap,
          columnGap: $columnGap,
        }),
        className
      )}
      style={{
        gridTemplateColumns: $columns || 'none',
        gridTemplateRows: $rows || 'none',
        ...style,
      }}
      {...props}
    />
  )
}

export default Grid
