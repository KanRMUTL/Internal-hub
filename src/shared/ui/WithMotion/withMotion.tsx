import { motion } from 'motion/react'
import React from 'react'

const withMotion = (children: React.ReactNode) => (
  <motion.div
    initial={{ scale: 0.5, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 1.1 }}
  >
    {children}
  </motion.div>
)

export default withMotion
