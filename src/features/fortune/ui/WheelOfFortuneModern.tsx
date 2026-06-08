import { useMemo } from 'react'
import styled from 'styled-components'
import { motion } from 'motion/react'
import { MotionSpan } from 'shared/ui/MotionWrapper'
import { MODERN_WHEEL_RADIUS, MODERN_WHEEL_SPIN_DURATION } from './wheelModern'

export interface ModernWheelMember {
  id: string
  name: string
  /**
   * Per-member wheel-wedge fill color. Computed by the page (via
   * `memberWedgeFill` in entities/member) so the same person is the same color
   * here as on the chip, modal avatar, history row, and winner modal.
   */
  color: string
}

interface WheelOfFortuneModernProps {
  members: ModernWheelMember[]
  rotation: number
  spinning: boolean
  size?: 'md' | 'lg'
}

const SVG_SIZE = MODERN_WHEEL_RADIUS * 2

const Wrap = styled.div<{ $size: 'md' | 'lg' }>`
  position: relative;
  width: ${({ $size }) => ($size === 'lg' ? 'min(520px, 100%)' : 'min(420px, 100%)')};
  aspect-ratio: 1;
  margin: 0 auto;
  isolation: isolate;
`

// Brand mandate: no decorative halos. The wheel IS the brand moment; the
// chrome around it stays quiet (hairline border, no shadow, no gradient).
const WheelSvg = styled(motion.svg)`
  width: 100%;
  height: 100%;
  display: block;
  border-radius: 50%;
  background: ${({ theme }) => theme.background.surface};
  border: 1px solid ${({ theme }) => theme.colors.grey[200]};
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
  z-index: 2;
`

const HubDot = styled(MotionSpan)`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.danger};
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
  border-top: 22px solid ${({ theme }) => theme.colors.danger};
  z-index: 3;
`

const WheelOfFortuneModern = ({ members, rotation, spinning, size = 'lg' }: WheelOfFortuneModernProps) => {
  const segmentAngle = members.length > 0 ? 360 / members.length : 0
  const center = SVG_SIZE / 2

  const colorAssignments = useMemo(() => members.map((m) => m.color), [members])

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
    <Wrap $size={size} data-testid="wheel-container">
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
          // Center the label in the segment along the radial direction (not at
          // the rim) and shrink it inward as member count grows, so crowded
          // wheels don't push long names off the inner edge of the wedge.
          const labelR = MODERN_WHEEL_RADIUS * (members.length > 12 ? 0.48 : members.length > 8 ? 0.55 : 0.62)
          const fontSize = members.length > 12 ? 9 : members.length > 8 ? 10 : 11
          const tx = center + labelR * Math.cos(midRad)
          const ty = center + labelR * Math.sin(midRad)
          const rotationDeg = midAngle + 90
          const flip = rotationDeg > 90 && rotationDeg < 270
          // Left-rotate 90° from the current radial style so labels run along
          // the arc (tangential) instead of reading outward from the hub.
          const finalRotation = (flip ? rotationDeg + 180 : rotationDeg) - 90
          // Center each label on the segment midpoint. Rotation pivots around
          // (tx, ty) so the text spins about its own center.
          const anchorX = tx

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
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={fontSize}
                fontWeight="600"
                fill="rgba(255, 255, 255, 0.96)"
                stroke="rgba(20, 30, 35, 0.55)"
                strokeWidth="1.5"
                paintOrder="stroke fill"
                strokeLinejoin="round"
                transform={`rotate(${finalRotation} ${anchorX} ${ty})`}
                style={{ fontFeatureSettings: '"cv11", "ss01"' }}
              >
                {member.name}
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

// Spin lifecycle helpers live in ./wheelModern and are re-exported here for
// backward compatibility with existing imports of the form
// `import { pickWinnerIndex } from 'features/fortune'`.
export { pickWinnerIndex, computeNextRotation, MODERN_SPIN_DURATION_MS } from './wheelModern'

export default WheelOfFortuneModern
