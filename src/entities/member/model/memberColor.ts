// 10 OKLCH preset background colors (78% L / 0.10 C). Hues are spread across
// the wheel with a teal-led cluster at 130–230° to preserve the Direction 7
// "restrained, teal-led" identity at the typical 4–6 member count. The
// remaining 5 hues (25, 50, 100, 280, 320) round out the palette for rooms
// with more members.
export const MEMBER_PRESET_COLORS = [
  'oklch(78% 0.10 178)', // teal
  'oklch(78% 0.10 200)', // sky
  'oklch(78% 0.10 230)', // blue
  'oklch(78% 0.10 280)', // purple
  'oklch(78% 0.10 320)', // magenta
  'oklch(78% 0.10 50)', // warm
  'oklch(78% 0.10 100)', // lime
  'oklch(78% 0.10 130)', // green
  'oklch(78% 0.10 158)', // teal-green
  'oklch(78% 0.10 25)', // orange
] as const

// 10 wedge-fill colors for the fortune wheel. Same hues as the avatar
// backgrounds, 70% L (darker for label legibility) and 0.12 C (slightly more
// saturated for fill-on-white contrast).
export const MEMBER_PRESET_WEDGE_COLORS = [
  'oklch(70% 0.12 178)',
  'oklch(70% 0.12 200)',
  'oklch(70% 0.12 230)',
  'oklch(70% 0.12 280)',
  'oklch(70% 0.12 320)',
  'oklch(70% 0.12 50)',
  'oklch(70% 0.12 100)',
  'oklch(70% 0.12 130)',
  'oklch(70% 0.12 158)',
  'oklch(70% 0.12 25)',
] as const

// 10 text colors for the avatar. Same hues, 30% L / 0.08 C — dark enough to
// read on the 78% L background.
export const MEMBER_PRESET_TEXT_COLORS = [
  'oklch(30% 0.08 178)',
  'oklch(30% 0.08 200)',
  'oklch(30% 0.08 230)',
  'oklch(30% 0.08 280)',
  'oklch(30% 0.08 320)',
  'oklch(30% 0.08 50)',
  'oklch(30% 0.08 100)',
  'oklch(30% 0.08 130)',
  'oklch(30% 0.08 158)',
  'oklch(30% 0.08 25)',
] as const

export type MemberPresetIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

/**
 * Deterministic name → preset index (0..9). Same name → same color, always.
 * Stable across builds and users (production data has no color field, so we
 * derive it client-side from the name).
 *
 * IMPORTANT: the hash formula must remain stable. If this function ever
 * changes, every existing member in production would silently re-color.
 * The test suite pins specific values to prevent that.
 */
export const memberPresetIndex = (name: string): MemberPresetIndex => {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % MEMBER_PRESET_COLORS.length
  return h as MemberPresetIndex
}

export const memberAvatarBackground = (name: string): string => MEMBER_PRESET_COLORS[memberPresetIndex(name)]

export const memberAvatarText = (name: string): string => MEMBER_PRESET_TEXT_COLORS[memberPresetIndex(name)]

export const memberWedgeFill = (name: string): string => MEMBER_PRESET_WEDGE_COLORS[memberPresetIndex(name)]
