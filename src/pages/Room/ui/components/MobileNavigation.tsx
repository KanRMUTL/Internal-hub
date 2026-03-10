import { Users, History } from 'lucide-react'
import { Typography } from 'shared/ui'
import { cva } from 'class-variance-authority'
import { cn } from 'shared/utils'

interface MobileNavigationProps {
  activeMobileSection: 'wheel' | 'history'
  onSectionChange: (section: 'wheel' | 'history') => void
  onMembersClick: () => void
}

const navContainerVariants = cva(
  'flex gap-1 mb-4 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 md:hidden'
)

const navButtonVariants = cva(
  'flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all duration-200 min-h-[44px] cursor-pointer hover:bg-white dark:hover:bg-gray-700 hover:translate-y-[-1px] hover:shadow-sm active:translate-y-0 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
  {
    variants: {
      active: {
        true: 'bg-primary text-white hover:bg-primary shadow-sm',
        false: 'bg-transparent text-gray-800 dark:text-gray-200',
      },
    },
    defaultVariants: {
      active: false,
    },
  }
)

const MobileNavigation = ({ activeMobileSection, onSectionChange, onMembersClick }: MobileNavigationProps) => {
  return (
    <div className={navContainerVariants()}>
      <button
        className={navButtonVariants({ active: activeMobileSection === 'wheel' })}
        onClick={() => onSectionChange('wheel')}
      >
        <Typography $size="sm" $weight="medium" $inline $color={activeMobileSection === 'wheel' ? 'white' : 'inherit'}>
          Wheel
        </Typography>
      </button>
      <button className={navButtonVariants({ active: false })} onClick={onMembersClick}>
        <Users size={16} />
        <Typography $size="sm" $weight="medium" $inline>
          Members
        </Typography>
      </button>
      <button
        className={navButtonVariants({ active: activeMobileSection === 'history' })}
        onClick={() => onSectionChange('history')}
      >
        <History size={16} />
        <Typography
          $size="sm"
          $weight="medium"
          $inline
          $color={activeMobileSection === 'history' ? 'white' : 'inherit'}
        >
          History
        </Typography>
      </button>
    </div>
  )
}

export default MobileNavigation
