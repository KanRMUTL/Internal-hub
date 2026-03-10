import { motion } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'shared/utils'

interface OptionButtonProps extends VariantProps<typeof optionButtonVariants> {
  text: string
  color: string // This seems to be a dynamic hex or tailwind class
  selected?: boolean
  disabled?: boolean
  onClick: () => void
  className?: string
}

const optionButtonVariants = cva(
  'w-full p-6 rounded-2xl text-white text-xl font-bold relative overflow-hidden min-h-[80px] flex items-center justify-center text-center transition-all duration-200 border-none shadow-[0_4px_0_rgba(0,0,0,0.2)]',
  {
    variants: {
      selected: {
        true: 'translate-y-1 shadow-none ring-4 ring-white',
        false: '',
      },
      disabled: {
        true: 'cursor-default',
        false: 'cursor-pointer active:translate-y-1 active:shadow-none',
      },
    },
    defaultVariants: {
      selected: false,
      disabled: false,
    },
  }
)

export const OptionButton = ({ text, color, selected, disabled, onClick, className }: OptionButtonProps) => {
  return (
    <motion.button
      className={cn(optionButtonVariants({ selected, disabled }), className)}
      style={{
        backgroundColor: color,
        opacity: disabled && !selected ? 0.3 : 1,
      }}
      onClick={disabled ? undefined : onClick}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
    >
      {text}
    </motion.button>
  )
}
