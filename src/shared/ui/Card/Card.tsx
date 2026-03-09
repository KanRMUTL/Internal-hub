import { ReactNode, ComponentProps } from 'react'
import { motion, HTMLMotionProps } from 'motion/react'
import { cva, type VariantProps } from 'class-variance-authority'
import { twMerge } from 'tailwind-merge'
import { clsx, type ClassValue } from 'clsx'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const cardVariants = cva(
  'relative bg-white border border-grey-200 transition-all duration-200 dark:bg-surface-dark dark:border-grey-700',
  {
    variants: {
      shadow: {
        none: 'shadow-none',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full',
      },
      padding: {
        none: 'p-0',
        sm: 'p-sm',
        md: 'p-md',
        lg: 'p-lg',
      },
      interactive: {
        true: 'cursor-pointer hover:filter hover:brightness-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary active:shadow-sm dark:hover:border-grey-600',
        false: '',
      },
    },
    defaultVariants: {
      shadow: 'md',
      rounded: 'lg',
      padding: 'md',
      interactive: false,
    },
  }
)

export interface CardProps extends Omit<ComponentProps<'div'>, 'onClick'>, VariantProps<typeof cardVariants> {
  children?: ReactNode
  className?: string
  onClick?: () => void
}

const Card = ({ shadow, rounded, padding, interactive, children, className, onClick, ...props }: CardProps) => {
  const Component = interactive ? motion.div : 'div'

  const motionProps = interactive
    ? {
        whileHover: {
          scale: 1.01,
          transition: { duration: 0.15, ease: [0, 0, 0.2, 1] },
        },
        whileTap: {
          scale: 0.99,
          transition: { duration: 0.1, ease: [0.4, 0, 1, 1] },
        },
      }
    : {}

  return (
    <Component
      className={cn(cardVariants({ shadow, rounded, padding, interactive }), className)}
      onClick={onClick}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? 'button' : undefined}
      onKeyDown={(e) => {
        if (interactive && onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onClick()
        }
      }}
      {...(motionProps as HTMLMotionProps<'div'>)}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Card
