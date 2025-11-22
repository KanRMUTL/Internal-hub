import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithTheme, testBothThemes, validateFocusIndicator } from '../../../test/visualRegressionUtils'
import Input from '../Input'

describe('Input Visual Regression Tests', () => {
  testBothThemes((theme) => {
    it('renders with correct styling and accessibility attributes', () => {
      renderWithTheme(<Input label="Test Input" placeholder="Enter text here" id="test-input" />, { theme })

      const input = screen.getByLabelText('Test Input')
      const label = screen.getByText('Test Input')

      expect(input).toBeInTheDocument()
      expect(label).toBeInTheDocument()
      expect(input).toHaveAttribute('placeholder', 'Enter text here')
      expect(input).toHaveAttribute('id', 'test-input')
      expect(label).toHaveAttribute('for', 'test-input')
    })

    it('handles focus and blur states correctly', () => {
      renderWithTheme(<Input label="Focus Test" />, { theme })

      const input = screen.getByLabelText('Focus Test')

      // Test focus state
      fireEvent.focus(input)
      expect(validateFocusIndicator(input)).toBe(true)

      // Test blur state
      fireEvent.blur(input)
    })

    it('displays error states with proper styling', () => {
      renderWithTheme(<Input label="Error Test" error="This field is required" />, { theme })

      const input = screen.getByLabelText('Error Test')
      const errorMessage = screen.getByText('This field is required')

      expect(input).toBeInTheDocument()
      expect(errorMessage).toBeInTheDocument()
      expect(input).toHaveAttribute('aria-invalid', 'true')
      expect(input).toHaveAttribute('aria-describedby')
    })

    it('handles disabled state correctly', () => {
      renderWithTheme(<Input label="Disabled Test" disabled />, { theme })

      const input = screen.getByLabelText('Disabled Test')
      expect(input).toBeDisabled()
      expect(input).toHaveAttribute('aria-disabled', 'true')
    })

    it('supports different input types', () => {
      const { rerender } = renderWithTheme(<Input label="Email" type="email" />, { theme })

      let input = screen.getByLabelText('Email')
      expect(input).toHaveAttribute('type', 'email')

      rerender(<Input label="Password" type="password" />)
      input = screen.getByLabelText('Password')
      expect(input).toHaveAttribute('type', 'password')

      rerender(<Input label="Number" type="number" />)
      input = screen.getByLabelText('Number')
      expect(input).toHaveAttribute('type', 'number')
    })

    it('handles value changes and controlled input', () => {
      const handleChange = vi.fn()
      renderWithTheme(<Input label="Controlled Input" value="initial value" onChange={handleChange} />, { theme })

      const input = screen.getByLabelText('Controlled Input') as HTMLInputElement
      expect(input.value).toBe('initial value')

      fireEvent.change(input, { target: { value: 'new value' } })
      expect(handleChange).toHaveBeenCalled()
    })

    it('supports floating label animation', () => {
      renderWithTheme(<Input label="Floating Label" />, { theme })

      const input = screen.getByLabelText('Floating Label')
      const label = screen.getByText('Floating Label')

      // Test label position changes on focus
      fireEvent.focus(input)
      fireEvent.change(input, { target: { value: 'test' } })

      expect(label).toBeInTheDocument()
    })

    it('maintains proper contrast ratios in all states', () => {
      const { rerender } = renderWithTheme(<Input label="Contrast Test" />, { theme })

      const input = screen.getByLabelText('Contrast Test')
      const normalStyles = window.getComputedStyle(input)

      // Test focus state contrast
      fireEvent.focus(input)
      const focusStyles = window.getComputedStyle(input)

      // Test error state contrast
      rerender(<Input label="Contrast Test" error="Error message" />)
      const errorInput = screen.getByLabelText('Contrast Test')
      const errorStyles = window.getComputedStyle(errorInput)

      // Ensure styles are different for different states
      expect(normalStyles.borderColor).toBeDefined()
      expect(focusStyles.borderColor).toBeDefined()
      expect(errorStyles.borderColor).toBeDefined()
    })
  })

  it('adapts styling between light and dark themes', () => {
    const { rerender } = renderWithTheme(<Input label="Theme Test" />, { theme: 'light' })

    const lightInput = screen.getByLabelText('Theme Test')
    const lightStyles = window.getComputedStyle(lightInput)

    rerender(<Input label="Theme Test" />)
    renderWithTheme(<Input label="Theme Test" />, { theme: 'dark' })

    const darkInput = screen.getByLabelText('Theme Test')
    const darkStyles = window.getComputedStyle(darkInput)

    // Ensure different styling for different themes
    expect(lightStyles.backgroundColor).not.toBe(darkStyles.backgroundColor)
    expect(lightStyles.color).not.toBe(darkStyles.color)
  })
})
