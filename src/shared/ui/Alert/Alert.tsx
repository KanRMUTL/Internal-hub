import { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { twMerge } from 'tailwind-merge'
import { clsx, type ClassValue } from 'clsx'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const alertVariants = cva('p-md rounded-md bg-white border-l-4 shadow-sm text-base font-medium dark:bg-grey-800', {
  variants: {
    type: {
      primary: 'text-primary border-primary',
      secondary: 'text-secondary border-secondary',
      success: 'text-success border-success',
      danger: 'text-danger border-danger',
      warning: 'text-warning border-warning',
      info: 'text-info border-info',
    },
  },
  defaultVariants: {
    type: 'info',
  },
})

export interface AlertProps extends ComponentProps<'div'>, VariantProps<typeof alertVariants> {
  width?: string
}

const Alert = ({ type, width, className, ...props }: AlertProps) => {
  const role = type === 'danger' ? 'alert' : 'status'

  return (
    <div
      role={role}
      className={cn(alertVariants({ type }), className)}
      style={{ width: width || 'fit-content' }}
      {...props}
    />
  )
}

export default Alert
