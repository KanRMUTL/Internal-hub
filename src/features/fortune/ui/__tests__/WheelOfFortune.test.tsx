import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import WheelOfFortune from '../WheelOfFortune'
import { lightTheme } from 'shared/styles/config'
import { SPIN_DURATION } from 'features/fortune/config'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    svg: ({ children, ...props }: any) => <svg {...props}>{children}</svg>,
  },
}))

// Mock useAnimationPerformance
vi.mock('shared/hooks', () => ({
  useAnimationPerformance: () => ({
    startMonitoring: vi.fn(),
    stopMonitoring: vi.fn(),
  }),
}))

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>)
}

describe('WheelOfFortune', () => {
  const mockMembers = [
    { id: '1', name: 'Member 1' },
    { id: '2', name: 'Member 2' },
    { id: '3', name: 'Member 3' },
  ]

  const mockOnSpinCompleted = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should render the wheel with members', () => {
    renderWithTheme(<WheelOfFortune members={mockMembers} onSpinCompleted={mockOnSpinCompleted} />)

    expect(screen.getByText('Member 1')).toBeInTheDocument()
    expect(screen.getByText('Member 2')).toBeInTheDocument()
    expect(screen.getByText('Member 3')).toBeInTheDocument()
    expect(screen.getByText('🎯 Spin')).toBeInTheDocument()
  })

  it('should disable spin button when spinning', () => {
    renderWithTheme(<WheelOfFortune members={mockMembers} onSpinCompleted={mockOnSpinCompleted} />)

    const spinButton = screen.getByText('🎯 Spin').closest('button')
    fireEvent.click(spinButton!)

    expect(spinButton).toBeDisabled()
  })

  it('should call onSpinCompleted after spin duration', () => {
    renderWithTheme(<WheelOfFortune members={mockMembers} onSpinCompleted={mockOnSpinCompleted} />)

    const spinButton = screen.getByText('🎯 Spin').closest('button')
    fireEvent.click(spinButton!)

    act(() => {
      vi.advanceTimersByTime(SPIN_DURATION * 1000)
    })

    expect(mockOnSpinCompleted).toHaveBeenCalled()
  })

  it('should select a winner based on random rotation', () => {
    // Mock Math.random to return a predictable value
    // With 3 members, segments are 120 degrees.
    // 0-120: Member 1, 120-240: Member 2, 240-360: Member 3 (depending on start angle)
    // The logic in component:
    // angleToRotate = spins * 360 + randomExtra
    // finalRotation = rotation + angleToRotate
    // effectiveRotation = finalRotation % 360
    // pointerOnWheel = (360 + POINTER_ANGLE - effectiveRotation) % 360
    // winnerIndex = Math.floor(pointerOnWheel / SEGMENT_ANGLE)

    // Let's mock random to 0. This means randomExtra = 0.
    // angleToRotate = 5 * 360 = 1800.
    // finalRotation = 0 + 1800 = 1800.
    // effectiveRotation = 0.
    // pointerOnWheel = (360 + 270 - 0) % 360 = 630 % 360 = 270.
    // SEGMENT_ANGLE = 120.
    // winnerIndex = floor(270 / 120) = 2.
    // Winner should be members[2] -> Member 3.

    vi.spyOn(Math, 'random').mockReturnValue(0)

    renderWithTheme(<WheelOfFortune members={mockMembers} onSpinCompleted={mockOnSpinCompleted} />)

    const spinButton = screen.getByText('🎯 Spin').closest('button')
    fireEvent.click(spinButton!)

    act(() => {
      vi.advanceTimersByTime(SPIN_DURATION * 1000)
    })

    expect(mockOnSpinCompleted).toHaveBeenCalledWith('3')
  })
})
