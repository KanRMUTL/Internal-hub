import { useMemo, useState } from 'react'
import shuffle from 'lodash/shuffle'
import { WHEEL_COLORS, SPIN_DURATION, SPINS_COUNT, POINTER_ANGLE, ANIMATION_EASING } from '../config'
import { useAnimationPerformance } from 'shared/hooks'

interface Member {
  id: string
  name: string
}

interface UseWheelOfFortuneProps {
  members: Member[]
  onSpinCompleted: (id: string) => void
}

export const useWheelOfFortune = ({ members, onSpinCompleted }: UseWheelOfFortuneProps) => {
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)

  const { startMonitoring, stopMonitoring } = useAnimationPerformance(spinning)

  const SEGMENT_ANGLE = 360 / Math.max(members.length, 1)

  const shuffledColors = useMemo(() => {
    const times = Math.ceil(members.length / WHEEL_COLORS.length)
    const extendedColors = Array(times).fill(WHEEL_COLORS).flat()
    return shuffle(extendedColors).slice(0, members.length)
  }, [members])

  const spin = () => {
    if (spinning || members.length === 0) return

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

  const wheelMotionProps = {
    animate: { rotate: rotation },
    transition: {
      duration: SPIN_DURATION,
      ease: ANIMATION_EASING,
    },
  }

  return {
    spinning,
    rotation,
    shuffledColors,
    SEGMENT_ANGLE,
    spin,
    wheelMotionProps,
  }
}
