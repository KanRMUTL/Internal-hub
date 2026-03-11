import { ComponentProps, forwardRef } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from 'shared/lib/utils'
import Button from '../Button'

const circularButtonVariants = cva('p-0 rounded-full flex items-center justify-center flex-shrink-0', {
  variants: {},
  defaultVariants: {},
})

interface CircularButtonProps extends Omit<ComponentProps<typeof Button>, 'size'> {
  size?: number
}

const CircularButton = forwardRef<HTMLButtonElement, CircularButtonProps>(
  ({ size = 36, className, style, variant = 'primary', ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        className={cn(circularButtonVariants({ className }))}
        style={{ width: size, height: size, ...style }}
        {...props}
      />
    )
  }
)

CircularButton.displayName = 'CircularButton'

export default CircularButton
