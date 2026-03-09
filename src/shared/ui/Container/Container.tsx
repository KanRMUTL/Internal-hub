import { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { twMerge } from 'tailwind-merge'
import { clsx, type ClassValue } from 'clsx'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const containerVariants = cva('w-full', {
  variants: {
    maxWidth: {
      sm: 'max-w-screen-sm',
      md: 'max-w-screen-md',
      lg: 'max-w-screen-lg',
      xl: 'max-w-screen-xl',
      full: 'max-w-full',
    },
    centered: {
      true: 'mx-auto',
      false: '',
    },
    px: {
      none: 'px-0',
      xs: 'px-xs',
      sm: 'px-sm',
      md: 'px-md',
      lg: 'px-lg',
      xl: 'px-xl',
    },
    touchTargets: {
      true: '[&>*]:min-h-[44px] [&_button]:min-h-[44px] [&_button]:min-w-[44px] [&_[role="button"]]:min-h-[44px] [&_[role="button"]]:min-w-[44px] [&_a]:min-h-[44px] [&_a]:min-w-[44px] [&_input[type="button"]]:min-h-[44px] [&_input[type="submit"]]:min-h-[44px]',
      false: '',
    },
  },
  defaultVariants: {
    maxWidth: 'xl',
    centered: true,
    px: 'md',
    touchTargets: false,
  },
})

export interface ContainerProps extends ComponentProps<'div'>, VariantProps<typeof containerVariants> {
  fluid?: boolean
}

const Container = ({ maxWidth, centered, px, touchTargets, fluid, className, ...props }: ContainerProps) => {
  return (
    <div
      className={cn(
        containerVariants({
          maxWidth: fluid ? 'full' : maxWidth,
          centered,
          px,
          touchTargets,
        }),
        className
      )}
      {...props}
    />
  )
}

export default Container
