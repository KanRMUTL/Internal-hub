import { describe, it, expect } from 'vitest'
import {
  MEMBER_PRESET_COLORS,
  MEMBER_PRESET_TEXT_COLORS,
  MEMBER_PRESET_WEDGE_COLORS,
  memberPresetIndex,
  memberAvatarBackground,
  memberAvatarText,
  memberWedgeFill,
} from './memberColor'

describe('memberPresetIndex (hash)', () => {
  it('is deterministic — same name returns the same index', () => {
    expect(memberPresetIndex('Alice')).toBe(memberPresetIndex('Alice'))
    expect(memberPresetIndex('Bob')).toBe(memberPresetIndex('Bob'))
  })

  it('returns an index in [0, 9] for a sample of names', () => {
    const names = [
      'Alice',
      'Bob',
      'Charlie',
      'Dana',
      'Eve',
      'Frank',
      'Grace',
      'Heidi',
      'Ivan',
      'Judy',
      'Mallory',
      'Niaj',
      'Olivia',
      'Peggy',
      'Sybil',
      'Trent',
      'Victor',
      'Walter',
      '', // edge case
      'a',
      'A',
      'Member 1',
      'Member 2',
      'Kan',
      'ชาติ',
      '名前',
      '🎲',
    ]
    for (const name of names) {
      const i = memberPresetIndex(name)
      expect(i, `name=${JSON.stringify(name)}`).toBeGreaterThanOrEqual(0)
      expect(i, `name=${JSON.stringify(name)}`).toBeLessThan(MEMBER_PRESET_COLORS.length)
    }
  })

  it('returns 0 for an empty name', () => {
    expect(memberPresetIndex('')).toBe(0)
  })

  // Pinned values — if the hash formula ever changes, every existing member
  // in production would silently re-color. These tests are the tripwire.
  it('pins specific values (hash stability — do not change the formula)', () => {
    expect(memberPresetIndex('a')).toBe(7) // charCode('a')=97; 97%10=7
    expect(memberPresetIndex('Alice')).toBe(8) // pinned — see hash body
    expect(memberPresetIndex('Bob')).toBe(5) // pinned
    expect(memberPresetIndex('Kan')).toBe(2) // pinned
  })
})

describe('memberAvatarBackground', () => {
  it('returns the preset at the member\'s index', () => {
    expect(memberAvatarBackground('a')).toBe(MEMBER_PRESET_COLORS[7])
    expect(memberAvatarBackground('Alice')).toBe(MEMBER_PRESET_COLORS[8])
  })

  it('returns a valid oklch string', () => {
    expect(memberAvatarBackground('Bob')).toMatch(/^oklch\(\d+%\s+[\d.]+\s+\d+\)$/)
  })
})

describe('memberAvatarText', () => {
  it('returns the matching text preset at the same index', () => {
    const name = 'a'
    expect(memberAvatarText(name)).toBe(MEMBER_PRESET_TEXT_COLORS[memberPresetIndex(name)])
  })

  it('returns a valid oklch string with lower lightness than the background', () => {
    const text = memberAvatarText('Bob')
    const match = text.match(/^oklch\((\d+)%/)?.[1]
    const bgMatch = memberAvatarBackground('Bob').match(/^oklch\((\d+)%/)?.[1]
    expect(match).toBeDefined()
    expect(bgMatch).toBeDefined()
    expect(Number(match)).toBeLessThan(Number(bgMatch))
  })
})

describe('memberWedgeFill', () => {
  it('returns the matching wedge preset at the same index', () => {
    const name = 'a'
    expect(memberWedgeFill(name)).toBe(MEMBER_PRESET_WEDGE_COLORS[memberPresetIndex(name)])
  })

  it('shares the same hue as the avatar background (identity flows through)', () => {
    const names = ['Alice', 'Bob', 'Kan', 'Member 1', '🎲']
    for (const name of names) {
      const bgHue = memberAvatarBackground(name).match(/\d+\)$/)?.[0]
      const wedgeHue = memberWedgeFill(name).match(/\d+\)$/)?.[0]
      expect(bgHue, `name=${name}`).toBe(wedgeHue)
    }
  })

  it('returns a darker fill than the background so white labels read', () => {
    const name = 'Alice'
    const bgL = Number(memberAvatarBackground(name).match(/(\d+)%/)?.[1])
    const wedgeL = Number(memberWedgeFill(name).match(/(\d+)%/)?.[1])
    expect(wedgeL).toBeLessThan(bgL)
  })
})
