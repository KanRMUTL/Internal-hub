import { InputHTMLAttributes, forwardRef, useState, useId } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/lib/utils'

const inputVariants = cva(
  'w-full text-base rounded-md transition-colors duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-400 dark:disabled:bg-gray-800 dark:disabled:border-gray-700 dark:disabled:text-gray-500 placeholder:text-gray-400 placeholder:transition-opacity focus:placeholder:opacity-70 dark:placeholder:text-gray-500',
  {
    variants: {
      variant: {
        default: 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-2',
        filled: 'bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-none focus-visible:ring-inset',
      },
      hasError: {
        true: 'border-danger focus:border-danger focus-visible:ring-danger/20',
        false: 'border-gray-300 dark:border-gray-600 focus:border-primary',
      },
      floatingLabel: {
        true: 'px-3 pt-6 pb-2',
        false: 'p-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      hasError: false,
      floatingLabel: false,
    },
  }
)

interface InputProps extends InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {
  label?: string
  error?: string
  helperText?: string
  $floatingLabel?: boolean
  $variant?: 'default' | 'filled'
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      name,
      $floatingLabel = false,
      $variant = 'default',
      value,
      defaultValue,
      placeholder,
      ...rest
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false)
    const inputId = useId()
    const errorId = useId()
    const helperTextId = useId()
    const finalId = name || inputId

    const hasValue = Boolean(value || defaultValue)
    const shouldFloatLabel = $floatingLabel && (isFocused || hasValue)

    const describedBy = []
    if (error) describedBy.push(errorId)
    if (helperText) describedBy.push(helperTextId)
    const ariaDescribedBy = describedBy.length > 0 ? describedBy.join(' ') : undefined

    return (
      <div className={cn('flex flex-col w-full', className)}>
        <div className="relative flex items-center">
          <input
            id={finalId}
            name={name}
            className={cn(inputVariants({ variant: $variant, hasError: !!error, floatingLabel: $floatingLabel }))}
            value={value}
            defaultValue={defaultValue}
            placeholder={$floatingLabel ? '' : placeholder}
            aria-invalid={!!error}
            aria-describedby={ariaDescribedBy}
            onFocus={(e) => {
              setIsFocused(true)
              rest.onFocus?.(e)
            }}
            onBlur={(e) => {
              setIsFocused(false)
              rest.onBlur?.(e)
            }}
            ref={ref}
            {...rest}
          />

          {label && (
            <label
              htmlFor={finalId}
              className={cn(
                'font-medium transition-all duration-300 ease-out',
                !!error ? 'text-danger' : isFocused ? 'text-primary' : 'text-gray-900 dark:text-gray-100',
                $floatingLabel
                  ? 'absolute left-3 pointer-events-none z-10 bg-white dark:bg-gray-900 px-1'
                  : 'block mb-2',
                $floatingLabel && shouldFloatLabel ? 'text-sm -top-2 translate-y-0' : '',
                $floatingLabel && !shouldFloatLabel ? 'text-base top-1/2 -translate-y-1/2' : ''
              )}
            >
              {label}
            </label>
          )}

          {$floatingLabel && placeholder && shouldFloatLabel && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none opacity-70 z-0">
              {placeholder}
            </span>
          )}
        </div>

        {helperText && !error && (
          <span id={helperTextId} className="text-gray-500 text-sm font-normal mt-2 block">
            {helperText}
          </span>
        )}

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -5, height: 0 }}
              transition={{ duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }}
            >
              <span
                id={errorId}
                role="alert"
                aria-live="polite"
                className="text-danger text-sm font-normal mt-2 flex items-center gap-1 before:content-['⚠'] before:text-sm"
              >
                {error}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
