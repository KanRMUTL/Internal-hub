import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import styled from 'styled-components'
import { WHEEL_COLORS, SPIN_DURATION, RADIUS, CENTER } from 'features/fortune/config'
import { Button, Typography } from 'shared/ui'
import _ from 'lodash'

interface Member {
  id: string
  name: string
}

interface WheelOfFortuneProps {
  members: Member[]
  onSpinCompleted: (id: string) => void
}

export default function WheelOfFortune({ members, onSpinCompleted }: WheelOfFortuneProps) {
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)

  const SEGMENT_ANGLE = 360 / members.length

  const shuffledColors = useMemo(() => {
    const times = Math.ceil(members.length / WHEEL_COLORS.length)
    const extendedColors = Array(times).fill(WHEEL_COLORS).flat()
    return _.shuffle(extendedColors).slice(0, members.length)
  }, [members])

  const spin = () => {
    if (spinning) return
    setSpinning(true)

    const spins = 5
    const randomExtra = Math.random() * 360
    const angleToRotate = spins * 360 + randomExtra
    const finalRotation = rotation + angleToRotate

    setRotation(finalRotation)

    setTimeout(() => {
      const pointerAngle = 270
      const effectiveRotation = finalRotation % 360
      const pointerOnWheel = (360 + pointerAngle - effectiveRotation) % 360
      const winnerIndex = Math.floor(pointerOnWheel / SEGMENT_ANGLE)
      const winner = members[winnerIndex]

      setSpinning(false)
      onSpinCompleted(winner.id)
    }, SPIN_DURATION * 1000)
  }

  return (
    <WheelContainer>
      <Pointer />
      <StyledWheel
        width={RADIUS * 2}
        height={RADIUS * 2}
        viewBox={`0 0 ${RADIUS * 2} ${RADIUS * 2}`}
        animate={{ rotate: rotation }}
        transition={{
          duration: SPIN_DURATION,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{ originX: '50%', originY: '50%' }}
      >
        {members.map((member, index) => {
          const toRad = (deg: number) => (Math.PI / 180) * deg

          const startAngle = index * SEGMENT_ANGLE
          const endAngle = startAngle + SEGMENT_ANGLE
          const largeArcFlag = SEGMENT_ANGLE > 180 ? 1 : 0

          // ใช้ความละเอียดสูงในการคำนวณจุด
          const x1 = CENTER + RADIUS * Math.cos(toRad(startAngle))
          const y1 = CENTER + RADIUS * Math.sin(toRad(startAngle))
          const x2 = CENTER + RADIUS * Math.cos(toRad(endAngle))
          const y2 = CENTER + RADIUS * Math.sin(toRad(endAngle))

          // ตำแหน่ง label ให้อยู่กลาง segment
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
      </StyledWheel>

      <Controls>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.8 }}>
          <Button $variant="success" onClick={spin} disabled={spinning || members.length === 0}>
            <Typography $color="white" $size="lg" $weight="semibold" $pointer>
              🎯 Spin
            </Typography>
          </Button>
        </motion.div>
      </Controls>
    </WheelContainer>
  )
}

export const WheelContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`

export const Pointer = styled.div`
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-top: 20px solid red;
  position: absolute;
  top: -10px;
  z-index: 10;
`

export const StyledWheel = styled(motion.svg)`
  width: 600px;
  height: 600px;
  border-radius: 50%;
  box-shadow: ${({ theme }) => theme.shadow.md};
`

export const Controls = styled.div`
  margin-top: 1rem;
  text-align: center;
`

export const SpinButton = styled.button`
  padding: 0.6rem 1.2rem;
  font-size: 1.2rem;
  background: #ff6f00;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`

export const Winner = styled.div`
  margin-top: 1rem;
  font-size: 1.4rem;
  color: green;
  font-weight: bold;
`
