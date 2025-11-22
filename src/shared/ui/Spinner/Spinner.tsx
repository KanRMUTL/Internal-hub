import { motion } from 'motion/react'

interface SpinnerProps {
  size?: number
  color?: string
  label?: string
}

const Spinner = ({ size = 40, color = 'currentColor', label }: SpinnerProps) => {
  const borderWidth = Math.max(2, size * 0.12)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: 'linear',
        }}
        style={{
          width: size,
          height: size,
          border: `${borderWidth}px solid transparent`,
          borderTop: `${borderWidth}px solid ${color}`,
          borderRadius: '50%',
          opacity: 0.8,
        }}
      />
      {label && <span style={{ color: '#6B7280', fontSize: '14px' }}>{label}</span>}
    </div>
  )
}

export default Spinner
