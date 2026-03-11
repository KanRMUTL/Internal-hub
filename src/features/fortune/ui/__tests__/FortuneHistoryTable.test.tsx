import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import FortuneHistoryTable from '../FortuneHistoryTable'
import { ThemeProvider } from 'features/toggle-theme/providers/ThemeContext'
import { useFortuneHistory } from 'features/fortune/hooks'

vi.mock('features/fortune/hooks')

const mockHistory = [{ id: '1', winnerName: 'Winner 1', createdAt: new Date().toISOString() }]

describe('FortuneHistoryTable', () => {
  it('renders history entries', () => {
    ;(useFortuneHistory as any).mockReturnValue({
      history: mockHistory,
      loading: false,
      error: null,
      retry: vi.fn(),
    })

    render(
      <ThemeProvider>
        <FortuneHistoryTable roomId="1" />
      </ThemeProvider>
    )

    expect(screen.getByText('Winner 1')).toBeInTheDocument()
  })

  it('renders empty state when no history', () => {
    ;(useFortuneHistory as any).mockReturnValue({
      history: [],
      loading: false,
      error: null,
      retry: vi.fn(),
    })

    render(
      <ThemeProvider>
        <FortuneHistoryTable roomId="1" />
      </ThemeProvider>
    )

    expect(screen.queryByText('Winner 1')).not.toBeInTheDocument()
  })
})
