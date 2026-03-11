import { motion } from 'framer-motion'
import { Typography, CircularButton } from 'shared/ui'
import { X, Edit, User, UserCheck } from 'lucide-react'
import { ReactNode } from 'react'
import { cva } from 'class-variance-authority'

interface MemberItemProps {
  id: string
  name: string
  description?: ReactNode
  onClick?: (id: string) => void
  onEdit?: (id: string) => void
  showDelete?: boolean
  onDelete?: (id: string) => void

  active?: boolean
}

const styledCardVariants = cva(
  'transition-all duration-200 cursor-pointer hover:translate-y-[-2px] hover:shadow-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-focus p-4 rounded-lg shadow-sm border border-thin',
  {
    variants: {
      active: {
        true: 'bg-surface-light dark:bg-surface-dark border-primary',
        false: 'bg-gray-50 dark:bg-gray-800 border-gray-300',
      },
    },
    defaultVariants: {
      active: true,
    },
  }
)

const actionButtonsVariants = cva(
  'flex gap-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-auto sm:opacity-100 sm:visible'
)

const actionButtonVariants = cva(
  'flex items-center justify-center w-8 h-8 rounded-md text-white transition-all duration-200 hover:brightness-110 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-focus active:scale-95',
  {
    variants: {
      variant: {
        edit: 'bg-secondary',
        delete: 'bg-danger',
      },
    },
  }
)

const MemberItem = ({
  id,
  name,
  description = null,
  onClick,
  onEdit,
  showDelete = false,
  onDelete,

  active = true,
}: MemberItemProps) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      transition={{
        duration: 0.25,
        ease: [0.4, 0.0, 0.2, 1],
      }}
      layout
      className="relative w-full min-w-[280px] max-w-[400px] group"
    >
      <div className={styledCardVariants({ active })} onClick={() => onClick?.(id)}>
        <div className="flex items-center gap-4 w-full min-h-[44px]">
          <CircularButton variant={active ? 'success' : 'secondary'}>
            {active ? <UserCheck size={16} /> : <User size={16} />}
          </CircularButton>

          <div className="flex flex-col gap-[2px] flex-1 min-w-0">
            <Typography size="lg" weight="semibold" color={active ? 'primary' : 'muted'} pointer>
              {name}
            </Typography>

            {description}
          </div>

          <div className={actionButtonsVariants()}>
            {onEdit && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={actionButtonVariants({ variant: 'edit' })}
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(id)
                }}
                aria-label={`Edit ${name}`}
                title={`Edit ${name}`}
              >
                <Edit size={14} />
              </motion.button>
            )}

            {showDelete && onDelete && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={actionButtonVariants({ variant: 'delete' })}
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(id)
                }}
                aria-label={`Delete ${name}`}
                title={`Delete ${name}`}
              >
                <X size={14} />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default MemberItem
