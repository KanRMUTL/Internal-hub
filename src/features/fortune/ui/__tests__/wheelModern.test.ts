import { describe, it, expect, vi } from 'vitest'
import { pickWinnerIndex, computeNextRotation, MODERN_SPIN_DURATION_MS } from '../wheelModern'

describe('pickWinnerIndex (pure helper)', () => {
  it('returns -1 for empty member list', () => {
    expect(pickWinnerIndex(0, 0)).toBe(-1)
  })

  it('returns index 0 when rotation is 0 (member 0 starts at the pointer)', () => {
    // The wheel renders member 0 starting at the top (angle 270°, where the
    // pointer sits) and sweeps clockwise. So at rotation 0, member 0 is under
    // the pointer. The previous test asserted 2 here, which reflected a stale
    // mental model where slices were numbered from angle 0 — that didn't match
    // the rendered wheel and produced the "winner doesn't match the pointer"
    // bug.
    expect(pickWinnerIndex(0, 3)).toBe(0)
  })

  it('returns the same index for full-revolution rotations', () => {
    const a = pickWinnerIndex(360, 3)
    const b = pickWinnerIndex(720, 3)
    const c = pickWinnerIndex(1080, 3)
    expect(a).toBe(b)
    expect(b).toBe(c)
  })

  it('agrees with the wheel rendering for every offset and member count', () => {
    // Property-style test: for every (N, offset) pair, the index returned by
    // pickWinnerIndex must match the member whose SVG segment is under the
    // pointer after that offset. This is exactly the consistency between
    // pickWinnerIndex and WheelOfFortuneModern's segment drawing that the
    // user-reported bug violated.
    for (const N of [2, 3, 4, 5, 6, 7, 8, 12]) {
      const segAngle = 360 / N
      for (const rotation of [0, 30, 47, 90, 137, 180, 200, 270, 359]) {
        const effective = rotation % 360
        // The angle in the unrotated wheel frame that lands under the pointer
        // (at POINTER_ANGLE_DEG = 270°). When the wheel rotates by `effective`
        // clockwise, the content at (POINTER_ANGLE_DEG - effective) moves to
        // the pointer position.
        const unrotatedAtPointer = ((270 - effective) + 360) % 360
        // WheelOfFortuneModern draws member i starting at (i * segAngle - 90)
        // and sweeping clockwise. So member i owns angles in the half-open
        // range [i * segAngle - 90, (i+1) * segAngle - 90) mod 360.
        const expected = Math.floor(((unrotatedAtPointer + 90) % 360) / segAngle)
        const actual = pickWinnerIndex(rotation, N)
        expect(actual, `N=${N} rotation=${rotation} effective=${effective}`).toBe(expected)
      }
    }
  })
})

describe('computeNextRotation', () => {
  it('adds 6 full rotations plus a random offset', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    const next = computeNextRotation(0)
    // 6 * 360 = 2160 + 0.5 * 360 = 2340
    expect(next).toBe(2340)
  })

  it('accumulates from current rotation (not from zero)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const next = computeNextRotation(1000)
    // 6 * 360 = 2160 + 0 = 2160, plus 1000 = 3160
    expect(next).toBe(3160)
  })
})

describe('MODERN_SPIN_DURATION_MS', () => {
  it('is 5.6 seconds (the modern Direction 7 duration)', () => {
    expect(MODERN_SPIN_DURATION_MS).toBe(5600)
  })
})
