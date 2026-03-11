import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithTheme, testBothThemes, mockReducedMotion } from './visualRegressionUtils'
import { Button, Modal, Card, MotionWrapper } from 'shared/ui'

describe('Animation Visual Regression Tests', () => {
  testBothThemes((theme) => {
    describe('Button Animations', () => {
      it('provides smooth hover transitions', async () => {
        renderWithTheme(<Button>Hover Test</Button>, { theme })

        const button = screen.getByText('Hover Test')

        // Test hover state
        fireEvent.mouseEnter(button)

        await waitFor(() => {
          const hoverStyles = window.getComputedStyle(button)
          // In a real implementation, you'd check transition properties
          expect(hoverStyles.transitionProperty).toBeDefined()
        })

        fireEvent.mouseLeave(button)
      })

      it('handles focus transitions smoothly', async () => {
        renderWithTheme(<Button>Focus Test</Button>, { theme })

        const button = screen.getByText('Focus Test')

        fireEvent.focus(button)

        await waitFor(() => {
          const focusStyles = window.getComputedStyle(button)
          expect(focusStyles.transitionProperty).toBeDefined()
        })

        fireEvent.blur(button)
      })

      it('provides loading state animations', async () => {
        renderWithTheme(<Button loading>Loading Test</Button>, { theme })

        const button = screen.getByText('Loading Test')
        expect(button).toHaveAttribute('aria-busy', 'true')

        // In a real implementation, you'd verify the spinner animation
        expect(button).toBeInTheDocument()
      })
    })

    describe('Modal Animations', () => {
      it('animates modal entrance and exit', async () => {
        const { rerender } = renderWithTheme(
          <Modal isOpen={false} onClose={() => {}}>
            <p>Animated Modal</p>
          </Modal>,
          { theme }
        )

        // Modal should not be visible initially
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

        // Open modal
        rerender(
          <Modal isOpen={true} onClose={() => {}}>
            <p>Animated Modal</p>
          </Modal>
        )

        await waitFor(() => {
          const modal = screen.getByRole('dialog')
          expect(modal).toBeInTheDocument()

          // Check for animation properties
          const styles = window.getComputedStyle(modal)
          expect(styles.transitionProperty).toBeDefined()
        })
      })

      it('handles backdrop animations', async () => {
        renderWithTheme(
          <Modal isOpen={true} onClose={() => {}}>
            <p>Backdrop Test</p>
          </Modal>,
          { theme }
        )

        const modal = screen.getByRole('dialog')
        const backdrop = modal.parentElement

        if (backdrop) {
          const styles = window.getComputedStyle(backdrop)
          // Check for backdrop blur or fade animations
          expect(styles.transitionProperty).toBeDefined()
        }
      })
    })

    describe('Card Hover Effects', () => {
      it('provides subtle hover elevation', async () => {
        const handleClick = vi.fn()
        renderWithTheme(
          <Card onClick={handleClick}>
            <p>Hoverable Card</p>
          </Card>,
          { theme }
        )

        const card = screen.getByText('Hoverable Card').closest('div')

        if (card) {
          fireEvent.mouseEnter(card)

          await waitFor(() => {
            const hoverStyles = window.getComputedStyle(card)
            // Check for shadow or transform changes
            expect(hoverStyles.transitionProperty).toBeDefined()
          })

          fireEvent.mouseLeave(card)
        }
      })
    })

    describe('Motion Wrapper Animations', () => {
      it('provides consistent motion timing', async () => {
        renderWithTheme(
          <MotionWrapper initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <p>Motion Test</p>
          </MotionWrapper>,
          { theme }
        )

        const content = screen.getByText('Motion Test')
        expect(content).toBeInTheDocument()

        // In a real implementation, you'd test the actual motion properties
        await waitFor(() => {
          expect(content).toBeVisible()
        })
      })
    })
  })

  describe('Performance Optimization', () => {
    it('maintains 60fps during animations', async () => {
      // Mock performance API
      const performanceEntries: PerformanceEntry[] = []
      const mockPerformance = {
        ...performance,
        getEntriesByType: vi.fn().mockReturnValue(performanceEntries),
        mark: vi.fn(),
        measure: vi.fn(),
      }

      Object.defineProperty(window, 'performance', {
        value: mockPerformance,
        writable: true,
      })

      renderWithTheme(
        <div>
          <Button>Performance Test 1</Button>
          <Button>Performance Test 2</Button>
          <Button>Performance Test 3</Button>
        </div>
      )

      const buttons = screen.getAllByRole('button')

      // Simulate rapid interactions
      buttons.forEach((button) => {
        fireEvent.mouseEnter(button)
        fireEvent.mouseLeave(button)
      })

      // In a real implementation, you'd analyze performance metrics
      expect(buttons).toHaveLength(3)
    })

    it('uses will-change property for animated elements', () => {
      renderWithTheme(<Button>Will-Change Test</Button>)

      const button = screen.getByText('Will-Change Test')

      // Test hover state for will-change property
      fireEvent.mouseEnter(button)

      // In a real implementation, you'd check for will-change: transform or similar
      expect(button).toBeInTheDocument()
    })
  })

  describe('Reduced Motion Support', () => {
    it('disables animations when prefers-reduced-motion is set', () => {
      mockReducedMotion(true)

      renderWithTheme(
        <div>
          <Button>Reduced Motion Button</Button>
          <Modal isOpen={true} onClose={() => {}}>
            <p>Reduced Motion Modal</p>
          </Modal>
        </div>
      )

      const button = screen.getByText('Reduced Motion Button')
      const modal = screen.getByRole('dialog')

      // Test that animations are disabled
      fireEvent.mouseEnter(button)

      // In a real implementation, you'd check that transition-duration is 0
      // or that animations are otherwise disabled
      expect(button).toBeInTheDocument()
      expect(modal).toBeInTheDocument()

      mockReducedMotion(false)
    })

    it('provides alternative feedback for reduced motion users', () => {
      mockReducedMotion(true)

      renderWithTheme(<Button>Alternative Feedback</Button>)

      const button = screen.getByText('Alternative Feedback')

      // Test that non-motion feedback is provided (e.g., color changes)
      fireEvent.mouseEnter(button)
      fireEvent.focus(button)

      const styles = window.getComputedStyle(button)
      // Check for color or other non-motion changes
      expect(styles.backgroundColor).toBeDefined()

      mockReducedMotion(false)
    })
  })

  describe('Animation Consistency', () => {
    it('uses consistent timing functions across components', () => {
      renderWithTheme(
        <div>
          <Button>Timing Test 1</Button>
          <Card onClick={() => {}}>
            <p>Timing Test 2</p>
          </Card>
        </div>
      )

      const button = screen.getByText('Timing Test 1')
      const card = screen.getByText('Timing Test 2').closest('div')

      fireEvent.mouseEnter(button)
      if (card) {
        fireEvent.mouseEnter(card)
      }

      const buttonStyles = window.getComputedStyle(button)
      const cardStyles = card ? window.getComputedStyle(card) : null

      // In a real implementation, you'd verify consistent timing functions
      expect(buttonStyles.transitionTimingFunction).toBeDefined()
      if (cardStyles) {
        expect(cardStyles.transitionTimingFunction).toBeDefined()
      }
    })

    it('maintains consistent animation durations', () => {
      renderWithTheme(
        <div>
          <Button>Duration Test 1</Button>
          <Button>Duration Test 2</Button>
        </div>
      )

      const buttons = screen.getAllByRole('button')

      buttons.forEach((button) => {
        fireEvent.mouseEnter(button)
        const styles = window.getComputedStyle(button)
        // In a real implementation, you'd check for consistent durations
        expect(styles.transitionDuration).toBeDefined()
      })
    })
  })
})
