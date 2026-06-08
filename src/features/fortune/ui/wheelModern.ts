// Wheel wedge fills are now derived per member from entities/member
// (memberWedgeFill). The page threads `ModernWheelMember.color` through to
// the wheel, so the same person is the same color on the wheel as on the
// chip, modal avatar, history row, and winner modal.

export const MODERN_WHEEL_RADIUS = 156
export const MODERN_WHEEL_SPIN_DURATION = 5.6
export const MODERN_WHEEL_SPINS = 6

/** Pointer is at the top of the wheel (12 o'clock). */
export const POINTER_ANGLE_DEG = 270

/**
 * Pure helper: given the current rotation, pick the winning member index.
 * Used by the parent (e.g. RoomPage) after the spin animation completes.
 *
 * The wheel renders member i starting at angle (i * 360/N - 90) and sweeping
 * clockwise, so member i owns the half-open angle range
 * [i * 360/N - 90, (i+1) * 360/N - 90) mod 360. The pointer sits at
 * POINTER_ANGLE_DEG (= 270°, the top). After a clockwise rotation of
 * `effective` degrees, the unrotated angle now under the pointer is
 * (POINTER_ANGLE_DEG - effective) mod 360. Adding 90 to both sides maps each
 * segment's start to 0, letting us recover i with a single Math.floor.
 */
export const pickWinnerIndex = (rotation: number, memberCount: number): number => {
  if (memberCount === 0) return -1
  const effective = rotation % 360
  const segAngle = 360 / memberCount
  return Math.floor(((POINTER_ANGLE_DEG - effective + 90 + 360) % 360) / segAngle)
}

/**
 * Compute the next rotation value to spin to. The parent tracks the current
 * rotation and adds a fresh full-revolution + random offset to keep accumulating.
 */
export const computeNextRotation = (currentRotation: number): number => {
  return currentRotation + MODERN_WHEEL_SPINS * 360 + Math.random() * 360
}

export const MODERN_SPIN_DURATION_MS = MODERN_WHEEL_SPIN_DURATION * 1000
