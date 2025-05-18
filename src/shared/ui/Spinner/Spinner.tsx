import { motion } from 'framer-motion'

interface SpinnerProps {
  size?: number
  color?: string
  label?: string
}

const Spinner = ({ size = 40, color = '#4F46E5', label }: SpinnerProps) => {
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
          border: `${size * 0.12}px solid #E5E7EB`,
          borderTop: `${size * 0.12}px solid ${color}`,
          borderRadius: '50%',
        }}
      />
      {label && <span style={{ color: '#6B7280', fontSize: '14px' }}>{label}</span>}
    </div>
  )
}

export default Spinner
