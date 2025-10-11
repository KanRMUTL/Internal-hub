import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import LuckyModal from '../LuckyModal'
import { RoomMember } from 'entities/room'
import { lightTheme } from 'shared/styles/config'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <div {...props}>{children}</div>,
  },
}))

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>)
}

describe('LuckyModal - Core Functionality', () => {
  const mockWinner: RoomMember = {
    id: 'winner-123',
    name: 'John Doe',
    isEligibleRandom: true,
    joinAt: '2024-01-15T10:30:00.000Z',
    createdAt: '2024-01-15T10:30:00.000Z',
    updatedAt: '2024-01-15T10:30:00.000Z',
  }

  const mockProps = {
    winner: mockWinner,
    onAccept: vi.fn(),
    onDiscard: vi.fn(),
    onSaveFortuneHistory: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render winner name and action buttons', () => {
    // Act
    renderWithTheme(<LuckyModal {...mockProps} />)

    // Assert
    expect(screen.getByText(/John Doe/)).toBeInTheDocument()
    expect(screen.getByText('🔄 Discard')).toBeInTheDocument()
    expect(screen.getByText('✅ Accept')).toBeInTheDocument()
  })

  it('should call onDiscard when discard button is clicked', () => {
    // Act
    renderWithTheme(<LuckyModal {...mockProps} />)

    const discardButton = screen.getByText('🔄 Discard')
    fireEvent.click(discardButton)

    // Assert
    expect(mockProps.onDiscard).toHaveBeenCalledTimes(1)
  })

  it('should call onAccept when no onSaveFortuneHistory provided', () => {
    // Arrange
    const propsWithoutSave = {
      winner: mockWinner,
      onAccept: vi.fn(),
      onDiscard: vi.fn(),
    }

    // Act
    renderWithTheme(<LuckyModal {...propsWithoutSave} />)

    const acceptButton = screen.getByText('✅ Accept')
    fireEvent.click(acceptButton)

    // Assert
    expect(propsWithoutSave.onAccept).toHaveBeenCalledTimes(1)
  })

  it('should save fortune history and call onAccept on successful save', async () => {
    // Arrange
    mockProps.onSaveFortuneHistory.mockResolvedValue(undefined)

    // Act
    renderWithTheme(<LuckyModal {...mockProps} />)

    const acceptButton = screen.getByText('✅ Accept')
    fireEvent.click(acceptButton)

    // Assert
    await waitFor(() => {
      expect(mockProps.onSaveFortuneHistory).toHaveBeenCalledWith('winner-123', 'John Doe')
      expect(mockProps.onAccept).toHaveBeenCalledTimes(1)
    })
  })

  it('should show saving state during fortune history save', async () => {
    // Arrange
    mockProps.onSaveFortuneHistory.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)))

    // Act
    renderWithTheme(<LuckyModal {...mockProps} />)

    const acceptButton = screen.getByText('✅ Accept')
    fireEvent.click(acceptButton)

    // Assert - Should show saving state
    expect(screen.getByText('Saving...')).toBeInTheDocument()

    // Wait for save to complete
    await waitFor(() => {
      expect(screen.getByText('✅ Accept')).toBeInTheDocument()
    })
  })

  it('should handle save errors and display error message', async () => {
    // Arrange
    const saveError = new Error('Network connection failed')
    mockProps.onSaveFortuneHistory.mockRejectedValue(saveError)

    // Act
    renderWithTheme(<LuckyModal {...mockProps} />)

    const acceptButton = screen.getByText('✅ Accept')
    fireEvent.click(acceptButton)

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/Network connection failed/)).toBeInTheDocument()
    })

    // Should not call onAccept when save fails
    expect(mockProps.onAccept).not.toHaveBeenCalled()

    // Should show try again button
    expect(screen.getByText('Try Again')).toBeInTheDocument()
  })

  it('should provide retry functionality after save error', async () => {
    // Arrange
    const saveError = new Error('Temporary network error')
    mockProps.onSaveFortuneHistory
      .mockRejectedValueOnce(saveError) // First attempt fails
      .mockResolvedValueOnce(undefined) // Second attempt succeeds

    // Act
    renderWithTheme(<LuckyModal {...mockProps} />)

    // First attempt
    const acceptButton = screen.getByText('✅ Accept')
    fireEvent.click(acceptButton)

    // Wait for error to appear (error gets transformed to network message)
    await waitFor(() => {
      expect(screen.getByText(/Network connection failed/)).toBeInTheDocument()
    })

    // Retry
    const retryButton = screen.getByText('Try Again')
    fireEvent.click(retryButton)

    // Assert
    await waitFor(() => {
      expect(mockProps.onSaveFortuneHistory).toHaveBeenCalledTimes(2)
      expect(mockProps.onAccept).toHaveBeenCalledTimes(1)
    })
  })

  it('should format network errors with user-friendly message', async () => {
    // Arrange
    const networkError = new Error('Network request failed')
    mockProps.onSaveFortuneHistory.mockRejectedValue(networkError)

    // Act
    renderWithTheme(<LuckyModal {...mockProps} />)

    const acceptButton = screen.getByText('✅ Accept')
    fireEvent.click(acceptButton)

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/Network connection failed/)).toBeInTheDocument()
    })
  })

  it('should format permission errors with appropriate message', async () => {
    // Arrange
    const permissionError = new Error('Permission denied')
    mockProps.onSaveFortuneHistory.mockRejectedValue(permissionError)

    // Act
    renderWithTheme(<LuckyModal {...mockProps} />)

    const acceptButton = screen.getByText('✅ Accept')
    fireEvent.click(acceptButton)

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/You do not have permission to save fortune history./)).toBeInTheDocument()
    })
  })

  it('should show generic error message for unknown errors', async () => {
    // Arrange
    const unknownError = new Error('Some unexpected error')
    mockProps.onSaveFortuneHistory.mockRejectedValue(unknownError)

    // Act
    renderWithTheme(<LuckyModal {...mockProps} />)

    const acceptButton = screen.getByText('✅ Accept')
    fireEvent.click(acceptButton)

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/Failed to save fortune history. Please try again./)).toBeInTheDocument()
    })
  })

  it('should handle winner with special characters in name', () => {
    // Arrange
    const specialWinner: RoomMember = {
      ...mockWinner,
      name: "🎉 José María O'Connor-Smith & Co. 中文 العربية 🏆",
    }

    // Act
    renderWithTheme(<LuckyModal {...mockProps} winner={specialWinner} />)

    // Assert
    expect(screen.getByText(/José María O'Connor-Smith & Co. 中文 العربية/)).toBeInTheDocument()
  })
})
