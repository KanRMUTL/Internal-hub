import { ReactNode, ButtonHTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'shared/lib/utils'
import Spinner from '../Spinner'

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-all duration-200 ease-out focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60 active:scale-95 hover:brightness-105 backface-hidden',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary/40',
        secondary:
          'bg-secondary text-white shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-secondary/40',
        success: 'bg-success text-white shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-success/40',
        danger: 'bg-danger text-white shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-danger/40',
        warning: 'bg-warning text-white shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-warning/40',
        info: 'bg-info text-white shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-info/40',
        ghost: 'bg-transparent text-current hover:bg-black/5 shadow-none',
        outline: 'bg-transparent border border-current text-current hover:bg-current/5 shadow-none',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg',
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full',
      },
      shadow: {
        none: 'shadow-none hover:shadow-none',
        sm: 'shadow-sm hover:shadow-md',
        md: 'shadow-md hover:shadow-lg',
        lg: 'shadow-lg hover:shadow-xl',
        xl: 'shadow-xl hover:shadow-2xl',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      rounded: 'md',
      shadow: 'md',
    },
  }
)

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  loading?: boolean
  loadingText?: string
  children: ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      rounded,
      shadow,
      fullWidth,
      loading = false,
      loadingText = 'Loading...',
      disabled,
      children,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(buttonVariants({ variant, size, rounded, shadow, fullWidth, className }))}
        aria-label={loading ? loadingText : ariaLabel}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <div className="absolute flex items-center justify-center" aria-hidden="true">
            <Spinner size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18} color="currentColor" />
          </div>
        )}
        <div
          className={cn(
            'flex items-center justify-center gap-2 transition-opacity duration-200 ease-out',
            loading ? 'opacity-0' : 'opacity-100'
          )}
        >
          {children}
        </div>
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
