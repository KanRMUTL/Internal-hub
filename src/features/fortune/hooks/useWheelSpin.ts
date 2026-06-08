import { useState, useMemo, useCallback } from 'react'
import { pickWinnerIndex, computeNextRotation, MODERN_SPIN_DURATION_MS } from '../ui/wheelModern'
import type { ModernWheelMember } from '../ui/WheelOfFortuneModern'

interface UseWheelSpinOptions {
  members: ModernWheelMember[]
  disabled?: boolean
}

interface UseWheelSpinReturn {
  rotation: number
  spinning: boolean
  winner: ModernWheelMember | null
  showWinnerModal: boolean
  startSpin: () => void
  dismissWinner: () => void
}

/**
 * Owns the spin lifecycle for the wheel of fortune. The page passes the
 * eligible members; the hook returns rotation/spinning/winner state plus
 * start/dismiss/spin-again handlers. The setTimeout that reveals the winner
 * after the spin lands lives here, so the page doesn't have to.
 */
export const useWheelSpin = ({ members, disabled = false }: UseWheelSpinOptions): UseWheelSpinReturn => {
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [winnerId, setWinnerId] = useState<string | null>(null)
  const [showWinnerModal, setShowWinnerModal] = useState(false)

  const winner = useMemo(
    () => (winnerId ? (members.find((m) => m.id === winnerId) ?? null) : null),
    [winnerId, members]
  )

  const startSpin = useCallback(() => {
    if (spinning || members.length < 2 || showWinnerModal || disabled) return
    setShowWinnerModal(false)
    setWinnerId(null)
    const nextRotation = computeNextRotation(rotation)
    setRotation(nextRotation)
    const idx = pickWinnerIndex(nextRotation, members.length)
    const picked = members[idx]
    if (!picked) {
      setSpinning(false)
      return
    }
    setSpinning(true)
    window.setTimeout(() => {
      setSpinning(false)
      setWinnerId(picked.id)
      setShowWinnerModal(true)
    }, MODERN_SPIN_DURATION_MS)
  }, [spinning, members, showWinnerModal, disabled, rotation])

  const dismissWinner = useCallback(() => {
    setShowWinnerModal(false)
    setWinnerId(null)
  }, [])

  return { rotation, spinning, winner, showWinnerModal, startSpin, dismissWinner }
}
