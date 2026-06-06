// Backward-compatible re-export. The new component is controlled: the parent
// owns `rotation` and `spinning` and computes the winner via pickWinnerIndex
// after the spin animation completes. The new helpers `pickWinnerIndex`,
// `computeNextRotation`, and `MODERN_SPIN_DURATION_MS` cover the spin lifecycle.
//
// New code should import the modern component + helpers directly from
// './ui' or via 'features/fortune'.

export {
  default as WheelOfFortune,
  default,
  pickWinnerIndex,
  computeNextRotation,
  MODERN_SPIN_DURATION_MS,
  type ModernWheelMember,
} from './WheelOfFortuneModern'
