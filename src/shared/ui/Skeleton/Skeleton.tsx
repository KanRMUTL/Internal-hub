import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'shared/lib/utils'
import { BorderRadiusKeys } from 'shared/styles'

const skeletonVariants = cva(
  'inline-block bg-[length:200px_100%] bg-no-repeat bg-gradient-to-r from-grey-200 via-grey-100 to-grey-200 dark:from-grey-700 dark:via-grey-600 dark:to-grey-700 animate-shimmer motion-reduce:animate-none motion-reduce:bg-none motion-reduce:bg-grey-200 dark:motion-reduce:bg-grey-700',
  {
    variants: {
      variant: {
        text: 'h-[1em] rounded',
        rectangular: '',
        circular: 'rounded-full',
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'rectangular',
      rounded: 'md',
    },
  }
)

interface SkeletonProps extends VariantProps<typeof skeletonVariants> {
  $width?: string
  $height?: string
  $rounded?: BorderRadiusKeys
  $variant?: 'text' | 'rectangular' | 'circular'
  className?: string
}

const Skeleton = ({
  $width = '100%',
  $height = '1rem',
  $rounded = 'md',
  $variant = 'rectangular',
  className,
  ...props
}: SkeletonProps) => {
  return (
    <div
      className={cn(skeletonVariants({ variant: $variant, rounded: $rounded, className }))}
      style={{
        width: $width,
        height: $variant === 'text' ? undefined : $height,
      }}
      {...props}
    />
  )
}

export default Skeleton
