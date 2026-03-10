import { motion } from 'framer-motion'
import { cva } from 'class-variance-authority'

interface QuizTimerProps {
  progress: number
}

const timerBarContainerVariants = cva('w-full h-2 bg-white/20 rounded-lg mb-8 overflow-hidden')

const timerFillVariants = cva('h-full bg-warning-bg rounded-lg')

export const QuizTimer = ({ progress }: QuizTimerProps) => {
  return (
    <div className={timerBarContainerVariants()}>
      <motion.div
        className={timerFillVariants()}
        initial={{ width: '100%' }}
        animate={{ width: `${progress}%` }}
        transition={{ ease: 'linear', duration: 0.1 }}
      />
    </div>
  )
}
