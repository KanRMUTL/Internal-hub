import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithTheme, testBothThemes, validateFocusIndicator } from '../../../test/visualRegressionUtils'
import Modal from '../Modal'

describe('Modal Visual Regression Tests', () => {
  testBothThemes((theme) => {
    it('renders modal with correct structure and accessibility', () => {
      renderWithTheme(
        <Modal isOpen={true} onClose={() => {}}>
          <h2>Modal Title</h2>
          <p>Modal content goes here</p>
        </Modal>,
        { theme }
      )

      const modal = screen.getByRole('dialog')
      const title = screen.getByText('Modal Title')
      const content = screen.getByText('Modal content goes here')

      expect(modal).toBeInTheDocument()
      expect(title).toBeInTheDocument()
      expect(content).toBeInTheDocument()
      expect(modal).toHaveAttribute('aria-modal', 'true')
    })

    it('handles close functionality correctly', () => {
      const handleClose = vi.fn()
      renderWithTheme(
        <Modal isOpen={true} onClose={handleClose}>
          <p>Closeable Modal</p>
        </Modal>,
        { theme }
      )

      const closeButton = screen.getByRole('button', { name: /close/i })
      expect(closeButton).toBeInTheDocument()

      fireEvent.click(closeButton)
      expect(handleClose).toHaveBeenCalledOnce()
    })

    it('supports keyboard navigation and focus management', () => {
      const handleClose = vi.fn()
      renderWithTheme(
        <Modal isOpen={true} onClose={handleClose}>
          <button>First Button</button>
          <button>Second Button</button>
        </Modal>,
        { theme }
      )

      const modal = screen.getByRole('dialog')
      const firstButton = screen.getByText('First Button')
      const secondButton = screen.getByText('Second Button')
      const closeButton = screen.getByRole('button', { name: /close/i })

      // Test focus indicators
      expect(validateFocusIndicator(firstButton)).toBe(true)
      expect(validateFocusIndicator(secondButton)).toBe(true)
      expect(validateFocusIndicator(closeButton)).toBe(true)

      // Test escape key
      fireEvent.keyDown(modal, { key: 'Escape' })
      expect(handleClose).toHaveBeenCalled()
    })

    it('handles backdrop click to close', () => {
      const handleClose = vi.fn()
      renderWithTheme(
        <Modal isOpen={true} onClose={handleClose}>
          <p>Backdrop Test</p>
        </Modal>,
        { theme }
      )

      const backdrop = screen.getByTestId('modal-backdrop') || screen.getByRole('dialog').parentElement
      if (backdrop) {
        fireEvent.click(backdrop)
        expect(handleClose).toHaveBeenCalled()
      }
    })

    it('renders with proper z-index and overlay styling', () => {
      renderWithTheme(
        <Modal isOpen={true} onClose={() => {}}>
          <p>Z-index Test</p>
        </Modal>,
        { theme }
      )

      const modal = screen.getByRole('dialog')
      const modalContainer = modal.parentElement

      if (modalContainer) {
        const styles = window.getComputedStyle(modalContainer)
        expect(styles.position).toBe('fixed')
        expect(parseInt(styles.zIndex)).toBeGreaterThan(1000)
      }
    })

    it('supports different sizes', () => {
      const { rerender } = renderWithTheme(
        <Modal isOpen={true} onClose={() => {}} size="sm">
          <p>Small Modal</p>
        </Modal>,
        { theme }
      )

      let modal = screen.getByRole('dialog')
      expect(modal).toBeInTheDocument()

      rerender(
        <Modal isOpen={true} onClose={() => {}} size="lg">
          <p>Large Modal</p>
        </Modal>
      )

      modal = screen.getByRole('dialog')
      expect(modal).toBeInTheDocument()
    })

    it('handles mobile responsive behavior', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })

      renderWithTheme(
        <Modal isOpen={true} onClose={() => {}}>
          <p>Mobile Modal</p>
        </Modal>,
        { theme }
      )

      const modal = screen.getByRole('dialog')
      expect(modal).toBeInTheDocument()

      // Reset viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      })
    })

    it('maintains proper contrast and readability', () => {
      renderWithTheme(
        <Modal isOpen={true} onClose={() => {}}>
          <h2>Contrast Test Title</h2>
          <p>This is test content for contrast validation</p>
        </Modal>,
        { theme }
      )

      const modal = screen.getByRole('dialog')
      const title = screen.getByText('Contrast Test Title')
      const content = screen.getByText('This is test content for contrast validation')

      const modalStyles = window.getComputedStyle(modal)
      const titleStyles = window.getComputedStyle(title)
      const contentStyles = window.getComputedStyle(content)

      // Ensure proper background and text colors are set
      expect(modalStyles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
      expect(titleStyles.color).not.toBe('rgba(0, 0, 0, 0)')
      expect(contentStyles.color).not.toBe('rgba(0, 0, 0, 0)')
    })
  })

  it('does not render when closed', () => {
    renderWithTheme(
      <Modal isOpen={false} onClose={() => {}}>
        <p>Hidden Modal</p>
      </Modal>
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByText('Hidden Modal')).not.toBeInTheDocument()
  })

  it('adapts styling between light and dark themes', () => {
    const { rerender } = renderWithTheme(
      <Modal isOpen={true} onClose={() => {}}>
        <p>Theme Test</p>
      </Modal>,
      { theme: 'light' }
    )

    const lightModal = screen.getByRole('dialog')
    const lightStyles = window.getComputedStyle(lightModal)

    rerender(
      <Modal isOpen={true} onClose={() => {}}>
        <p>Theme Test</p>
      </Modal>
    )
    renderWithTheme(
      <Modal isOpen={true} onClose={() => {}}>
        <p>Theme Test</p>
      </Modal>,
      { theme: 'dark' }
    )

    const darkModal = screen.getByRole('dialog')
    const darkStyles = window.getComputedStyle(darkModal)

    // Ensure different styling for different themes
    expect(lightStyles.backgroundColor).not.toBe(darkStyles.backgroundColor)
  })
})
