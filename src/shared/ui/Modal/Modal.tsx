import { ReactNode, MouseEvent, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { FocusTrap } from '../FocusTrap'
import { createInteractionProps, createPerformantMotionProps } from '../../styles/utils'
import { useMotionPreference } from '../../hooks'
import { X } from 'lucide-react'
import { cva } from 'class-variance-authority'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const modalVariants = cva(
  'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl relative overflow-hidden flex flex-col will-change-[transform,opacity] transform-gpu',
  {
    variants: {
      size: {
        sm: 'w-full max-w-[400px] rounded-lg max-h-[90vh]',
        md: 'w-full max-w-[500px] rounded-lg max-h-[90vh]',
        lg: 'w-full max-w-[700px] rounded-lg max-h-[90vh]',
        xl: 'w-full max-w-[900px] rounded-lg max-h-[90vh]',
        xxl: 'w-[1200px] max-w-[90vw] rounded-lg max-h-[90vh]',
        fullscreen: 'w-screen h-screen max-w-none max-h-none rounded-none m-0',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'fullscreen'
  title?: string
}

const Modal = ({ isOpen, onClose, children, size = 'md', title }: ModalProps) => {
  const prefersReducedMotion = useMotionPreference()

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const backdropProps = createPerformantMotionProps({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  })

  const modalProps = createPerformantMotionProps({
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 20 },
  })

  const closeButtonProps = createInteractionProps({
    whileHover: { scale: 1.1 },
    whileTap: { scale: 0.9 },
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'

      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        document.body.style.overflow = 'unset'
      }
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[999] p-4 isolate will-change-opacity transform-gpu"
          onClick={handleBackdropClick}
          {...backdropProps}
        >
          <FocusTrap isActive={isOpen} initialFocus={'[aria-label="Close modal"]'}>
            <motion.div
              className={cn(
                modalVariants({ size }),
                size !== 'fullscreen' &&
                  'max-md:w-screen max-md:h-screen max-md:max-w-none max-md:max-h-none max-md:rounded-none max-md:m-0'
              )}
              {...modalProps}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? 'modal-title' : undefined}
              aria-describedby={title ? undefined : 'modal-content'}
            >
              <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 mb-4">
                {title && (
                  <h2
                    id="modal-title"
                    className="m-0 text-xl font-semibold text-gray-900 dark:text-gray-100 leading-tight"
                  >
                    {title}
                  </h2>
                )}

                <motion.button
                  className="w-8 h-8 border-none bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md flex items-center justify-center justify-self-end text-xl font-bold cursor-pointer z-10 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200 focus:outline-none"
                  onClick={onClose}
                  aria-label="Close modal"
                  {...closeButtonProps}
                  transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.15 }}
                >
                  <X size={18} />
                </motion.button>
              </div>

              <div
                className={cn(
                  'overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800 hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500',
                  title ? 'px-6 pb-6 pt-0' : 'p-4'
                )}
                id={title ? undefined : 'modal-content'}
              >
                {children}
              </div>
            </motion.div>
          </FocusTrap>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Modal
