import { ReactNode, forwardRef, HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'shared/lib/utils'

const typographyVariants = cva('m-0 transition-colors duration-200', {
  variants: {
    $color: {
      default: 'text-current',
      primary: 'text-primary',
      secondary: 'text-secondary',
      success: 'text-success',
      danger: 'text-danger',
      warning: 'text-warning',
      info: 'text-info',
      white: 'text-white',
      black: 'text-black',
      muted: 'text-grey-500',
    },
    $size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
      '5xl': 'text-5xl',
    },
    $weight: {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      bold: 'font-bold',
    },
    $align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
    $inline: {
      true: 'inline',
      false: 'block',
    },
    $pointer: {
      true: 'cursor-pointer',
    },
    $noWrap: {
      true: 'whitespace-nowrap',
    },
  },
  defaultVariants: {
    $color: 'default',
    $size: 'base',
    $weight: 'normal',
    $align: 'left',
    $inline: false,
  },
})

export interface TypographyProps extends HTMLAttributes<HTMLParagraphElement>, VariantProps<typeof typographyVariants> {
  children: ReactNode
}

const Typography = forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ className, $color, $size, $weight, $align, $inline, $pointer, $noWrap, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(typographyVariants({ $color, $size, $weight, $align, $inline, $pointer, $noWrap, className }))}
        {...props}
      />
    )
  }
)

Typography.displayName = 'Typography'

export default Typography
