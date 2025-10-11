import { describe, it, expect, vi, beforeEach, Mock } from 'vitest'
import { render } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import FortuneHistoryTable from '../FortuneHistoryTable'
import { useFortuneHistory } from '../../hooks'
import { TEST_ROOM_ID } from '../../../../test/fortuneHistoryTestUtils'
import { lightTheme } from 'shared/styles/config'

// Mock the fortune history hook
vi.mock('../../hooks')

// Mock FortuneHistoryDataBoundary
vi.mock('../FortuneHistoryDataBoundary', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="data-boundary">{children}</div>,
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <div {...props}>{children}</div>,
    table: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <table {...props}>{children}</table>
    ),
    tr: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <tr {...props}>{children}</tr>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

// Mock dayjs
vi.mock('dayjs', () => ({
  default: vi.fn(() => ({
    format: vi.fn(() => 'Dec 10, 2024 2:30 PM'),
  })),
}))

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>)
}

describe('FortuneHistoryTable', () => {
  const mockUseFortuneHistory = {
    history: [],
    loading: false,
    error: null,
    retry: vi.fn(),
    saveEntry: vi.fn(),
    clearHistory: vi.fn(),
    retryCount: 0,
    saveError: null,
    saving: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useFortuneHistory as Mock).mockReturnValue(mockUseFortuneHistory)
  })

  it('should call useFortuneHistory with correct roomId', () => {
    // Act
    renderWithTheme(<FortuneHistoryTable roomId={TEST_ROOM_ID} />)

    // Assert
    expect(useFortuneHistory).toHaveBeenCalledWith(TEST_ROOM_ID)
  })

  it('should render nothing when no history and not loading', () => {
    // Act
    const { container } = renderWithTheme(<FortuneHistoryTable roomId={TEST_ROOM_ID} />)

    // Assert
    expect(container.firstChild).toBeNull()
  })

  it('should render table when history exists', () => {
    // Arrange
    ;(useFortuneHistory as Mock).mockReturnValue({
      ...mockUseFortuneHistory,
      history: [
        {
          id: 'entry-1',
          winnerName: 'John Doe',
          winnerId: 'winner-1',
          roomId: TEST_ROOM_ID,
          createdAt: '2024-01-15T10:30:00.000Z',
        },
      ],
    })

    // Act
    const { container } = renderWithTheme(<FortuneHistoryTable roomId={TEST_ROOM_ID} />)

    // Assert
    expect(container.firstChild).not.toBeNull()
  })
})
