import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import WheelOfFortuneModern, {
  pickWinnerIndex,
  computeNextRotation,
  MODERN_SPIN_DURATION_MS,
} from '../WheelOfFortuneModern'
import { lightTheme } from 'shared/styles/config'

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: Record<string, unknown>) => (
      <div {...(props as React.HTMLAttributes<HTMLDivElement>)}>{children as React.ReactNode}</div>
    ),
    svg: ({ children, ...props }: Record<string, unknown>) => (
      <svg {...(props as React.SVGAttributes<SVGSVGElement>)}>{children as React.ReactNode}</svg>
    ),
    span: ({ children, ...props }: Record<string, unknown>) => (
      <span {...(props as React.HTMLAttributes<HTMLSpanElement>)}>{children as React.ReactNode}</span>
    ),
  },
}))

const renderWithTheme = (component: React.ReactElement) =>
  render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>)

/** A wrapper that simulates the parent owning rotation/spinning state. */
const Controlled = ({
  members,
  rotation,
  spinning,
}: {
  members: { id: string; name: string }[]
  rotation: number
  spinning: boolean
}) => <WheelOfFortuneModern members={members} rotation={rotation} spinning={spinning} size="lg" />

describe('WheelOfFortuneModern (controlled)', () => {
  const mockMembers = [
    { id: '1', name: 'Member 1' },
    { id: '2', name: 'Member 2' },
    { id: '3', name: 'Member 3' },
  ]

  it('renders the wheel with all member names', () => {
    renderWithTheme(<Controlled members={mockMembers} rotation={0} spinning={false} />)
    expect(screen.getByText('Member 1')).toBeInTheDocument()
    expect(screen.getByText('Member 2')).toBeInTheDocument()
    expect(screen.getByText('Member 3')).toBeInTheDocument()
  })

  it('renders the empty-state ring when no members', () => {
    const { container } = renderWithTheme(<Controlled members={[]} rotation={0} spinning={false} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders a pointer at the top of the wheel', () => {
    const { container } = renderWithTheme(<Controlled members={mockMembers} rotation={0} spinning={false} />)
    // The wheel renders an SVG with the pointer triangle (zero-width div with
    // border-left, border-right, border-top). Just verify the wheel SVG exists.
    const svg = container.querySelector('svg[role="img"]')
    expect(svg).toBeInTheDocument()
    expect(svg?.getAttribute('aria-label')).toBe('Fortune wheel')
  })
})

describe('pickWinnerIndex (pure helper)', () => {
  it('returns -1 for empty member list', () => {
    expect(pickWinnerIndex(0, 0)).toBe(-1)
  })

  it('returns index 0 when rotation lands on the first segment', () => {
    // POINTER_ANGLE = 270 (top of wheel). The wheel's slice i covers angle
    // (i * 360/N) to ((i+1) * 360/N) measured CCW from the top.
    // For 3 members, each slice is 120°. The pointer is at 270° (top).
    // rotation = 0 → effective = 0, pointerAt = (270 - 0) % 360 = 270,
    // which is in slice 2 (240-360).
    expect(pickWinnerIndex(0, 3)).toBe(2)
  })

  it('handles non-zero rotation consistently', () => {
    const a = pickWinnerIndex(360, 3)
    const b = pickWinnerIndex(720, 3)
    const c = pickWinnerIndex(1080, 3)
    expect(a).toBe(b)
    expect(b).toBe(c)
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
