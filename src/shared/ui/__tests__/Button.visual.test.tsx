import { describe, it, expect } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import {
  renderWithTheme,
  testBothThemes,
  validateTouchTarget,
  validateFocusIndicator,
} from '../../../test/visualRegressionUtils'
import Button from '../Button'

describe('Button Visual Regression Tests', () => {
  testBothThemes((theme) => {
    it('renders with correct styling in all variants', () => {
      const { rerender } = renderWithTheme(<Button>Default Button</Button>, { theme })

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('Default Button')

      // Test primary variant
      rerender(<Button $variant="primary">Primary Button</Button>)
      expect(screen.getByRole('button')).toHaveTextContent('Primary Button')

      // Test secondary variant
      rerender(<Button $variant="secondary">Secondary Button</Button>)
      expect(screen.getByRole('button')).toHaveTextContent('Secondary Button')

      // Test danger variant
      rerender(<Button $variant="danger">Danger Button</Button>)
      expect(screen.getByRole('button')).toHaveTextContent('Danger Button')
    })

    it('renders with correct sizes', () => {
      const { rerender } = renderWithTheme(<Button $size="sm">Small</Button>, { theme })

      let button = screen.getByRole('button')
      expect(button).toBeInTheDocument()

      // Test medium size
      rerender(<Button $size="md">Medium</Button>)
      button = screen.getByRole('button')
      expect(validateTouchTarget(button)).toBe(true)

      // Test large size
      rerender(<Button $size="lg">Large</Button>)
      button = screen.getByRole('button')
      expect(validateTouchTarget(button)).toBe(true)
    })

    it('handles disabled state correctly', () => {
      renderWithTheme(<Button disabled>Disabled Button</Button>, { theme })

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveAttribute('aria-disabled', 'true')
    })

    it('handles loading state correctly', () => {
      renderWithTheme(<Button $loading>Loading Button</Button>, { theme })

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveAttribute('aria-busy', 'true')
    })

    it('supports keyboard navigation and focus indicators', () => {
      renderWithTheme(<Button>Focusable Button</Button>, { theme })

      const button = screen.getByRole('button')
      expect(validateFocusIndicator(button)).toBe(true)

      // Test keyboard activation
      fireEvent.keyDown(button, { key: 'Enter' })
      fireEvent.keyDown(button, { key: ' ' })
    })

    it('handles hover and active states', () => {
      renderWithTheme(<Button>Interactive Button</Button>, { theme })

      const button = screen.getByRole('button')

      // Test hover state
      fireEvent.mouseEnter(button)
      fireEvent.mouseLeave(button)

      // Test active state
      fireEvent.mouseDown(button)
      fireEvent.mouseUp(button)
    })
  })

  it('maintains consistent styling across theme changes', () => {
    const { rerender } = renderWithTheme(<Button>Theme Test</Button>, { theme: 'light' })

    const lightButton = screen.getByRole('button')
    const lightStyles = window.getComputedStyle(lightButton)

    rerender(<Button>Theme Test</Button>)
    renderWithTheme(<Button>Theme Test</Button>, { theme: 'dark' })

    const darkButton = screen.getByRole('button')
    const darkStyles = window.getComputedStyle(darkButton)

    // Ensure different background colors for different themes
    expect(lightStyles.backgroundColor).not.toBe(darkStyles.backgroundColor)
  })
})
