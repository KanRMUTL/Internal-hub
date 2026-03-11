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
        xl: 'rounded-xl',
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
  width?: string
  $height?: string
  height?: string
  $rounded?: BorderRadiusKeys
  rounded?: BorderRadiusKeys
  $variant?: 'text' | 'rectangular' | 'circular'
  variant?: 'text' | 'rectangular' | 'circular'
  className?: string
}

const Skeleton = ({
  $width = '100%',
  width,
  $height = '1rem',
  height,
  $rounded = 'md',
  rounded,
  $variant = 'rectangular',
  variant,
  className,
  ...props
}: SkeletonProps) => {
  const finalWidth = width || $width
  const finalHeight = height || $height
  const finalRounded = rounded || $rounded
  const finalVariant = variant || $variant

  return (
    <div
      className={cn(skeletonVariants({ variant: finalVariant, rounded: finalRounded, className }))}
      style={{
        width: finalWidth,
        height: finalVariant === 'text' ? undefined : finalHeight,
      }}
      {...props}
    />
  )
}

export default Skeleton
