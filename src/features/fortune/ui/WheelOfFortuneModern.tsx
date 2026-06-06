import { useMemo } from 'react'
import styled from 'styled-components'
import { motion } from 'motion/react'
import { MODERN_WHEEL_COLORS, MODERN_WHEEL_RADIUS, MODERN_WHEEL_SPIN_DURATION, MODERN_WHEEL_SPINS } from './wheelModern'

export interface ModernWheelMember {
  id: string
  name: string
}

interface WheelOfFortuneModernProps {
  members: ModernWheelMember[]
  rotation: number
  spinning: boolean
  size?: 'md' | 'lg'
}

const SVG_SIZE = MODERN_WHEEL_RADIUS * 2
const POINTER_ANGLE_DEG = 270 // top of the wheel

const Wrap = styled.div<{ $size: 'md' | 'lg' }>`
  position: relative;
  width: ${({ $size }) => ($size === 'lg' ? 'min(520px, 100%)' : 'min(420px, 100%)')};
  aspect-ratio: 1;
  margin: 0 auto;
  isolation: isolate;
`

const OuterRing = styled(motion.div)`
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    ${({ theme }) => theme.colors.primary} 0deg,
    ${({ theme }) => theme.colors.secondary} 120deg,
    ${({ theme }) => theme.colors.success} 240deg,
    ${({ theme }) => theme.colors.primary} 360deg
  );
  opacity: 0.18;
  filter: blur(8px);
  z-index: -1;
`

const WheelSvg = styled(motion.svg)`
  width: 100%;
  height: 100%;
  display: block;
  border-radius: 50%;
  background: ${({ theme }) => theme.background.surface};
  box-shadow:
    0 1px 0 ${({ theme }) => theme.colors.grey[200]},
    0 12px 32px rgba(0, 0, 0, 0.06);
`

const Hub = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${({ theme }) => theme.background.surface};
  border: 1px solid ${({ theme }) => theme.colors.grey[200]};
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  z-index: 2;
`

const HubDot = styled(motion.span)`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
`

const Pointer = styled.div`
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 14px solid transparent;
  border-right: 14px solid transparent;
  border-top: 22px solid ${({ theme }) => theme.colors.primary};
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.18));
  z-index: 3;
`

const WheelOfFortuneModern = ({ members, rotation, spinning, size = 'lg' }: WheelOfFortuneModernProps) => {
  const segmentAngle = members.length > 0 ? 360 / members.length : 0
  const center = SVG_SIZE / 2

  const colorAssignments = useMemo(() => {
    return members.map((_, i) => MODERN_WHEEL_COLORS[i % MODERN_WHEEL_COLORS.length])
  }, [members])

  if (members.length === 0) {
    return (
      <Wrap $size={size}>
        <svg width="100%" height="100%" viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`} aria-hidden="true">
          <circle
            cx={center}
            cy={center}
            r={MODERN_WHEEL_RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.15"
          />
          <circle
            cx={center}
            cy={center}
            r={MODERN_WHEEL_RADIUS - 16}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.1"
          />
        </svg>
      </Wrap>
    )
  }

  return (
    <Wrap $size={size}>
      <OuterRing
        animate={spinning ? { rotate: 360 } : { rotate: 0 }}
        transition={spinning ? { duration: 8, repeat: Infinity, ease: 'linear' } : { duration: 0.6 }}
        aria-hidden="true"
      />
      <Pointer aria-hidden="true" />
      <WheelSvg
        viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
        animate={{ rotate: rotation }}
        transition={{ duration: MODERN_WHEEL_SPIN_DURATION, ease: [0.22, 1, 0.36, 1] }}
        style={{ originX: '50%', originY: '50%', willChange: spinning ? 'transform' : 'auto' }}
        role="img"
        aria-label="Fortune wheel"
      >
        {members.map((member, i) => {
          const startAngle = i * segmentAngle - 90
          const endAngle = startAngle + segmentAngle
          const toRad = (deg: number) => (Math.PI / 180) * deg
          const x1 = center + MODERN_WHEEL_RADIUS * Math.cos(toRad(startAngle))
          const y1 = center + MODERN_WHEEL_RADIUS * Math.sin(toRad(startAngle))
          const x2 = center + MODERN_WHEEL_RADIUS * Math.cos(toRad(endAngle))
          const y2 = center + MODERN_WHEEL_RADIUS * Math.sin(toRad(endAngle))
          const largeArc = segmentAngle > 180 ? 1 : 0
          const midAngle = startAngle + segmentAngle / 2
          const midRad = toRad(midAngle)
          const labelR = MODERN_WHEEL_RADIUS * 0.72
          const tx = center + labelR * Math.cos(midRad)
          const ty = center + labelR * Math.sin(midRad)
          const rotationDeg = midAngle + 90
          const flip = rotationDeg > 90 && rotationDeg < 270
          const finalRotation = flip ? rotationDeg + 180 : rotationDeg
          const anchorX = flip ? tx + 4 : tx - 4
          const shortName = member.name.length > 10 ? member.name.slice(0, 9) + '…' : member.name
          return (
            <g key={member.id}>
              <path
                d={`M${center},${center} L${x1},${y1} A${MODERN_WHEEL_RADIUS},${MODERN_WHEEL_RADIUS} 0 ${largeArc} 1 ${x2},${y2} Z`}
                fill={colorAssignments[i]}
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1.5"
              />
              <text
                x={anchorX}
                y={ty}
                textAnchor={flip ? 'start' : 'end'}
                dominantBaseline="middle"
                fontSize="11"
                fontWeight="600"
                fill="rgba(20, 30, 35, 0.9)"
                transform={`rotate(${finalRotation} ${anchorX} ${ty})`}
                style={{ fontFeatureSettings: '"cv11", "ss01"' }}
              >
                {shortName}
              </text>
            </g>
          )
        })}
      </WheelSvg>
      <Hub aria-hidden="true">
        <HubDot
          animate={spinning ? { scale: [1, 0.5, 1] } : { scale: 1 }}
          transition={spinning ? { duration: 0.6, repeat: Infinity } : { duration: 0.2 }}
        />
      </Hub>
    </Wrap>
  )
}

/**
 * Pure helper: given the current rotation, pick the winning member index.
 * Used by the parent (e.g. RoomPage) after the spin animation completes.
 */
export const pickWinnerIndex = (rotation: number, memberCount: number): number => {
  if (memberCount === 0) return -1
  const effective = rotation % 360
  const pointerAt = (360 + POINTER_ANGLE_DEG - effective + 360) % 360
  const segAngle = 360 / memberCount
  return Math.floor(pointerAt / segAngle)
}

/**
 * Compute the next rotation value to spin to. The parent tracks the current
 * rotation and adds a fresh full-revolution + random offset to keep accumulating.
 */
export const computeNextRotation = (currentRotation: number): number => {
  return currentRotation + MODERN_WHEEL_SPINS * 360 + Math.random() * 360
}

export const MODERN_SPIN_DURATION_MS = MODERN_WHEEL_SPIN_DURATION * 1000

export default WheelOfFortuneModern
