// Modern restrained wheel palette. 6 colors at matched chroma/lightness, teal-led.
// Cycles when there are more than 6 members.
export const WHEEL_COLORS = [
  'oklch(72% 0.14 178)',
  'oklch(70% 0.12 200)',
  'oklch(72% 0.13 158)',
  'oklch(74% 0.12 230)',
  'oklch(70% 0.13 130)',
  'oklch(73% 0.12 50)',
] as const

export const SPIN_DURATION = 12
export const RADIUS = 150
export const CENTER = RADIUS
export const SPINS_COUNT = 5
export const POINTER_ANGLE = 270
export const ANIMATION_EASING = [0.22, 1, 0.36, 1]
