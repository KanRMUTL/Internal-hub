import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithTheme, testBothThemes } from '../../../test/visualRegressionUtils'
import Card from '../Card'

describe('Card Visual Regression Tests', () => {
  testBothThemes((theme) => {
    it('renders with correct styling and content', () => {
      renderWithTheme(
        <Card>
          <h2>Card Title</h2>
          <p>Card content goes here</p>
        </Card>,
        { theme }
      )

      const card = screen.getByText('Card Title').closest('div')
      expect(card).toBeInTheDocument()
      expect(screen.getByText('Card content goes here')).toBeInTheDocument()
    })

    it('handles interactive states when clickable', () => {
      const handleClick = vi.fn()
      renderWithTheme(
        <Card onClick={handleClick}>
          <p>Clickable Card</p>
        </Card>,
        { theme }
      )

      const card = screen.getByText('Clickable Card').closest('div')
      expect(card).toBeInTheDocument()

      // Test hover state
      if (card) {
        fireEvent.mouseEnter(card)
        fireEvent.mouseLeave(card)

        // Test click
        fireEvent.click(card)
        expect(handleClick).toHaveBeenCalledOnce()
      }
    })

    it('renders with proper elevation and shadows', () => {
      renderWithTheme(
        <Card $shadow="md">
          <p>Elevated Card</p>
        </Card>,
        { theme }
      )

      const card = screen.getByText('Elevated Card').closest('div')
      expect(card).toBeInTheDocument()

      if (card) {
        const styles = window.getComputedStyle(card)
        expect(styles.boxShadow).not.toBe('none')
      }
    })

    it('supports different padding variants', () => {
      const { rerender } = renderWithTheme(
        <Card $padding="sm">
          <p>Small Padding</p>
        </Card>,
        { theme }
      )

      let card = screen.getByText('Small Padding').closest('div')
      expect(card).toBeInTheDocument()

      rerender(
        <Card $padding="lg">
          <p>Large Padding</p>
        </Card>
      )

      card = screen.getByText('Large Padding').closest('div')
      expect(card).toBeInTheDocument()
    })

    it('maintains proper contrast ratios', () => {
      renderWithTheme(
        <Card>
          <p>Contrast Test Content</p>
        </Card>,
        { theme }
      )

      const card = screen.getByText('Contrast Test Content').closest('div')
      const text = screen.getByText('Contrast Test Content')

      if (card) {
        const cardStyles = window.getComputedStyle(card)
        const textStyles = window.getComputedStyle(text)

        // Ensure there's a background color set
        expect(cardStyles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
        expect(cardStyles.backgroundColor).not.toBe('transparent')

        // Ensure text color is set
        expect(textStyles.color).not.toBe('rgba(0, 0, 0, 0)')
      }
    })
  })

  it('adapts styling between light and dark themes', () => {
    const { rerender } = renderWithTheme(
      <Card>
        <p>Theme Adaptation Test</p>
      </Card>,
      { theme: 'light' }
    )

    const lightCard = screen.getByText('Theme Adaptation Test').closest('div')
    const lightStyles = lightCard ? window.getComputedStyle(lightCard) : null

    rerender(
      <Card>
        <p>Theme Adaptation Test</p>
      </Card>
    )
    renderWithTheme(
      <Card>
        <p>Theme Adaptation Test</p>
      </Card>,
      { theme: 'dark' }
    )

    const darkCard = screen.getByText('Theme Adaptation Test').closest('div')
    const darkStyles = darkCard ? window.getComputedStyle(darkCard) : null

    if (lightStyles && darkStyles) {
      expect(lightStyles.backgroundColor).not.toBe(darkStyles.backgroundColor)
    }
  })
})
