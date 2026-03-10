import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import {
  WHEEL_COLORS,
  SPIN_DURATION,
  RADIUS,
  CENTER,
  SPINS_COUNT,
  POINTER_ANGLE,
  ANIMATION_EASING,
} from 'features/fortune/config'
import { Button, Typography, Box } from 'shared/ui'
import { useAnimationPerformance } from 'shared/hooks'
import _ from 'lodash'
import { cn } from 'shared/utils'

interface Member {
  id: string
  name: string
}

interface WheelOfFortuneProps {
  members: Member[]
  onSpinCompleted: (id: string) => void
}

const wheelContainerVariants = cva('relative flex flex-col items-center gap-8 p-4 md:p-8')

const pointerVariants = cva(
  'absolute z-10 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[24px] border-t-danger top-[-10px] drop-shadow-[0_4px_4px_rgba(255,255,255,0.4)]'
)

const wheelVariants = cva(
  'w-full h-auto max-w-[80vh] max-h-[80vh] aspect-square rounded-full shadow-xl bg-surface-light dark:bg-surface-dark border-[4px] border-gray-300 md:max-w-[min(60vh,400px)] md:max-h-[min(60vh,400px)] sm:max-w-[min(50vh,300px)] sm:max-h-[min(50vh,300px)]'
)

export default function WheelOfFortune({ members, onSpinCompleted }: WheelOfFortuneProps) {
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)

  const { startMonitoring, stopMonitoring } = useAnimationPerformance(spinning)

  const wheelMotionProps = {
    animate: { rotate: rotation },
    transition: {
      duration: SPIN_DURATION,
      ease: ANIMATION_EASING,
    },
  }

  const SEGMENT_ANGLE = 360 / members.length

  const shuffledColors = useMemo(() => {
    const times = Math.ceil(members.length / WHEEL_COLORS.length)
    const extendedColors = Array(times).fill(WHEEL_COLORS).flat()
    return _.shuffle(extendedColors).slice(0, members.length)
  }, [members])

  const spin = () => {
    if (spinning) return

    startMonitoring()
    setSpinning(true)

    const randomExtra = Math.random() * 360
    const angleToRotate = SPINS_COUNT * 360 + randomExtra
    const finalRotation = rotation + angleToRotate

    setRotation(finalRotation)

    setTimeout(() => {
      const effectiveRotation = finalRotation % 360
      const pointerOnWheel = (360 + POINTER_ANGLE - effectiveRotation) % 360
      const winnerIndex = Math.floor(pointerOnWheel / SEGMENT_ANGLE)
      const winner = members[winnerIndex]

      setSpinning(false)
      stopMonitoring()
      onSpinCompleted(winner.id)
    }, SPIN_DURATION * 1000)
  }

  return (
    <div className={wheelContainerVariants()}>
      <div className={pointerVariants()} />
      <motion.svg
        width={RADIUS * 2}
        height={RADIUS * 2}
        viewBox={`0 0 ${RADIUS * 2} ${RADIUS * 2}`}
        className={wheelVariants()}
        {...wheelMotionProps}
        style={{
          originX: '50%',
          originY: '50%',
          willChange: spinning ? 'transform' : 'auto',
        }}
      >
        {members.map((member, index) => {
          const toRad = (deg: number) => (Math.PI / 180) * deg

          const startAngle = index * SEGMENT_ANGLE
          const endAngle = startAngle + SEGMENT_ANGLE
          const largeArcFlag = SEGMENT_ANGLE > 180 ? 1 : 0

          const x1 = CENTER + RADIUS * Math.cos(toRad(startAngle))
          const y1 = CENTER + RADIUS * Math.sin(toRad(startAngle))
          const x2 = CENTER + RADIUS * Math.cos(toRad(endAngle))
          const y2 = CENTER + RADIUS * Math.sin(toRad(endAngle))

          const labelAngle = startAngle + SEGMENT_ANGLE / 2
          const labelRad = toRad(labelAngle)
          const textX = CENTER + RADIUS * 0.65 * Math.cos(labelRad)
          const textY = CENTER + RADIUS * 0.65 * Math.sin(labelRad)

          return (
            <g key={index}>
              <path
                d={`M${CENTER},${CENTER} L${x1},${y1} A${RADIUS},${RADIUS} 0 ${largeArcFlag} 1 ${x2},${y2} Z`}
                fill={shuffledColors[index]}
                stroke="#fff"
                strokeWidth="0.5"
              />
              <defs>
                <filter id="white-shadow" x="-50%" y="-50%" width="180%" height="180%">
                  <feDropShadow dx="0" dy="0" stdDeviation="1.3" floodColor="white" />
                </filter>
              </defs>
              <text
                x={textX}
                y={textY}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fill="#211d1d"
                transform={`rotate(${labelAngle} ${textX} ${textY})`}
                filter="url(#white-shadow)"
              >
                {member.name}
              </text>
            </g>
          )
        })}
      </motion.svg>

      <div className="flex justify-center">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.8 }}>
          <Button $variant="success" onClick={spin} disabled={spinning || members.length === 0}>
            <Typography $color="white" $size="lg" $weight="semibold" $pointer>
              🎯 Spin
            </Typography>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
