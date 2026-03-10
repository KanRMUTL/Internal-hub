import { render, screen } from '@testing-library/react'
import FortuneHistoryTable from '../FortuneHistoryTable'
import { ThemeProvider } from 'features/toggle-theme/providers/ThemeContext'
import { useFortuneHistory } from 'features/fortune/hooks'

jest.mock('features/fortune/hooks')

const mockHistory = [{ id: '1', winnerName: 'Winner 1', createdAt: new Date().toISOString() }]

describe('FortuneHistoryTable', () => {
  it('renders history entries', () => {
    ;(useFortuneHistory as jest.Mock).mockReturnValue({
      history: mockHistory,
      loading: false,
      error: null,
      retry: jest.fn(),
    })

    render(
      <ThemeProvider>
        <FortuneHistoryTable roomId="1" />
      </ThemeProvider>
    )

    expect(screen.getByText('Winner 1')).toBeInTheDocument()
  })

  it('renders empty state when no history', () => {
    ;(useFortuneHistory as jest.Mock).mockReturnValue({
      history: [],
      loading: false,
      error: null,
      retry: jest.fn(),
    })

    render(
      <ThemeProvider>
        <FortuneHistoryTable roomId="1" />
      </ThemeProvider>
    )

    expect(screen.queryByText('Winner 1')).not.toBeInTheDocument()
  })
})
