import { Users } from 'lucide-react'
import { CircularButton, withMotion } from 'shared/ui'
import { cva } from 'class-variance-authority'

interface FloatingActionButtonProps {
  onClick: () => void
}

const fabContainerVariants = cva('hidden lg:block fixed bottom-8 right-8 lg:right-4 xl:right-8 z-[100]')

const FloatingActionButton = ({ onClick }: FloatingActionButtonProps) => {
  return (
    <div className={fabContainerVariants()}>
      {withMotion(
        <CircularButton $size={56} $variant="info" onClick={onClick} aria-label="Manage members">
          <Users size={24} />
        </CircularButton>
      )}
    </div>
  )
}

export default FloatingActionButton
