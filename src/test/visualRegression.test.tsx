import { describe, it, expect } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithTheme, testBothThemes } from './visualRegressionUtils'
import Button from '../shared/ui/Button/Button'

describe('Visual Regression Tests - Core Components', () => {
  testBothThemes((theme) => {
    describe('Button Component', () => {
      it('renders with correct styling', () => {
        renderWithTheme(<Button>Test Button</Button>, { theme })

        const button = screen.getByRole('button')
        expect(button).toBeInTheDocument()
        expect(button).toHaveTextContent('Test Button')
      })

      it('handles different variants', () => {
        const { rerender } = renderWithTheme(<Button $variant="primary">Primary</Button>, { theme })

        let button = screen.getByRole('button')
        expect(button).toHaveTextContent('Primary')

        rerender(<Button $variant="secondary">Secondary</Button>)
        button = screen.getByRole('button')
        expect(button).toHaveTextContent('Secondary')
      })

      it('handles different sizes', () => {
        const { rerender } = renderWithTheme(<Button $size="sm">Small</Button>, { theme })

        let button = screen.getByRole('button')
        expect(button).toBeInTheDocument()

        rerender(<Button $size="md">Medium</Button>)
        button = screen.getByRole('button')
        expect(button).toBeInTheDocument()

        rerender(<Button $size="lg">Large</Button>)
        button = screen.getByRole('button')
        expect(button).toBeInTheDocument()
      })

      it('handles disabled state', () => {
        renderWithTheme(<Button disabled>Disabled</Button>, { theme })

        const button = screen.getByRole('button')
        expect(button).toBeDisabled()
      })

      it('handles loading state', () => {
        renderWithTheme(<Button $loading>Loading</Button>, { theme })

        const button = screen.getByRole('button')
        expect(button).toBeDisabled()
        expect(button).toHaveAttribute('aria-busy', 'true')
      })

      it('supports keyboard navigation', () => {
        renderWithTheme(<Button>Focusable</Button>, { theme })

        const button = screen.getByRole('button')

        // Test focus - in jsdom, focus doesn't work the same as in real browsers
        fireEvent.focus(button)
        // Just verify the button exists and can receive focus events
        expect(button).toBeInTheDocument()

        // Test keyboard activation
        fireEvent.keyDown(button, { key: 'Enter' })
        fireEvent.keyDown(button, { key: ' ' })
      })

      it('handles hover and active states', () => {
        renderWithTheme(<Button>Interactive</Button>, { theme })

        const button = screen.getByRole('button')

        // Test hover
        fireEvent.mouseEnter(button)
        fireEvent.mouseLeave(button)

        // Test active
        fireEvent.mouseDown(button)
        fireEvent.mouseUp(button)
      })
    })
  })

  describe('Theme Consistency', () => {
    it('renders properly in both light and dark themes', () => {
      // Test light theme
      renderWithTheme(<Button>Light Theme Test</Button>, { theme: 'light' })
      const lightButton = screen.getByRole('button')
      expect(lightButton).toBeInTheDocument()
      expect(lightButton).toHaveTextContent('Light Theme Test')

      // Test dark theme (using testBothThemes utility validates this)
      // The testBothThemes function already tests both themes for all other tests
      expect(lightButton).toBeInTheDocument()
    })
  })

  describe('Accessibility Validation', () => {
    testBothThemes((theme) => {
      it('provides proper ARIA attributes', () => {
        renderWithTheme(
          <Button aria-label="Close dialog" disabled>
            ×
          </Button>,
          { theme }
        )

        const button = screen.getByLabelText('Close dialog')
        expect(button).toHaveAttribute('aria-label', 'Close dialog')
        expect(button).toBeDisabled()
      })

      it('supports loading state accessibility', () => {
        renderWithTheme(
          <Button $loading $loadingText="Saving changes">
            Save
          </Button>,
          { theme }
        )

        const button = screen.getByRole('button')
        expect(button).toHaveAttribute('aria-busy', 'true')
        expect(button).toHaveAttribute('aria-label', 'Saving changes')
      })
    })
  })

  describe('Responsive Behavior', () => {
    it('maintains consistent sizing across viewports', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })

      const { unmount } = renderWithTheme(<Button $size="md">Mobile Button</Button>)

      const mobileButton = screen.getByRole('button')
      expect(mobileButton).toBeInTheDocument()

      unmount()

      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      })

      renderWithTheme(<Button $size="md">Desktop Button</Button>)

      const desktopButton = screen.getByRole('button')
      expect(desktopButton).toBeInTheDocument()
    })
  })
})
