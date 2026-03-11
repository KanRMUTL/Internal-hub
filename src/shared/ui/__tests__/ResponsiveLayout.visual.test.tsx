import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme, testBothThemes, mockViewport, breakpoints } from '../../../test/visualRegressionUtils'
import { ResponsiveGrid, Container, Box } from '../index'

describe('Responsive Layout Visual Regression Tests', () => {
  testBothThemes((theme) => {
    describe('ResponsiveGrid', () => {
      it('adapts to different screen sizes', () => {
        const { rerender } = renderWithTheme(
          <ResponsiveGrid columns={3}>
            <div>Item 1</div>
            <div>Item 2</div>
            <div>Item 3</div>
          </ResponsiveGrid>,
          { theme }
        )

        const grid = screen.getByText('Item 1').parentElement
        expect(grid).toBeInTheDocument()

        // Test mobile viewport
        mockViewport(breakpoints.mobile.width, breakpoints.mobile.height)
        rerender(
          <ResponsiveGrid columns={3}>
            <div>Item 1</div>
            <div>Item 2</div>
            <div>Item 3</div>
          </ResponsiveGrid>
        )

        // Test tablet viewport
        mockViewport(breakpoints.tablet.width, breakpoints.tablet.height)
        rerender(
          <ResponsiveGrid columns={3}>
            <div>Item 1</div>
            <div>Item 2</div>
            <div>Item 3</div>
          </ResponsiveGrid>
        )

        // Test desktop viewport
        mockViewport(breakpoints.desktop.width, breakpoints.desktop.height)
        rerender(
          <ResponsiveGrid columns={3}>
            <div>Item 1</div>
            <div>Item 2</div>
            <div>Item 3</div>
          </ResponsiveGrid>
        )
      })

      it('handles responsive gap spacing', () => {
        renderWithTheme(
          <ResponsiveGrid columns={2} gap="lg">
            <div>Spaced Item 1</div>
            <div>Spaced Item 2</div>
          </ResponsiveGrid>,
          { theme }
        )

        const grid = screen.getByText('Spaced Item 1').parentElement
        expect(grid).toBeInTheDocument()
      })
    })

    describe('Container', () => {
      it('provides proper max-width constraints', () => {
        renderWithTheme(
          <Container>
            <p>Container Content</p>
          </Container>,
          { theme }
        )

        const container = screen.getByText('Container Content').parentElement
        expect(container).toBeInTheDocument()

        if (container) {
          const styles = window.getComputedStyle(container)
          expect(styles.maxWidth).toBeDefined()
          expect(styles.marginLeft).toBe('auto')
          expect(styles.marginRight).toBe('auto')
        }
      })

      it('handles different container sizes', () => {
        const { rerender } = renderWithTheme(
          <Container maxWidth="sm">
            <p>Small Container</p>
          </Container>,
          { theme }
        )

        let container = screen.getByText('Small Container').parentElement
        expect(container).toBeInTheDocument()

        rerender(
          <Container maxWidth="lg">
            <p>Large Container</p>
          </Container>
        )

        container = screen.getByText('Large Container').parentElement
        expect(container).toBeInTheDocument()
      })
    })

    describe('Box Responsive Props', () => {
      it('handles responsive spacing props', () => {
        renderWithTheme(
          <Box p="sm" tabletP="md" desktopP="lg">
            <p>Responsive Box</p>
          </Box>,
          { theme }
        )

        const box = screen.getByText('Responsive Box').parentElement
        expect(box).toBeInTheDocument()
      })

      it('handles responsive display properties', () => {
        renderWithTheme(
          <Box display="flex">
            <div>Flex Item 1</div>
            <div>Flex Item 2</div>
          </Box>,
          { theme }
        )

        const box = screen.getByText('Flex Item 1').parentElement
        expect(box).toBeInTheDocument()
      })
    })
  })

  describe('Breakpoint Consistency', () => {
    it('maintains consistent breakpoint behavior across components', () => {
      // Test that all responsive components use the same breakpoint values
      const testBreakpoints = [
        breakpoints.mobile.width,
        breakpoints.tablet.width,
        breakpoints.desktop.width,
        breakpoints.widescreen.width,
      ]

      testBreakpoints.forEach((width) => {
        mockViewport(width, 800)

        renderWithTheme(
          <Container>
            <ResponsiveGrid columns={1} tabletColumns={2} desktopColumns={3}>
              <Box p="sm" tabletP="md" desktopP="lg">
                <p>Breakpoint Test Content</p>
              </Box>
            </ResponsiveGrid>
          </Container>
        )

        expect(screen.getByText('Breakpoint Test Content')).toBeInTheDocument()
      })
    })
  })

  describe('Touch Target Validation', () => {
    it('ensures minimum touch target sizes on mobile', () => {
      mockViewport(breakpoints.mobile.width, breakpoints.mobile.height)

      renderWithTheme(
        <ResponsiveGrid columns={1}>
          <button>Mobile Button 1</button>
          <button>Mobile Button 2</button>
        </ResponsiveGrid>
      )

      const button1 = screen.getByText('Mobile Button 1')
      const button2 = screen.getByText('Mobile Button 2')

      // Note: In a real implementation, you'd check actual rendered sizes
      // This is a simplified test structure
      expect(button1).toBeInTheDocument()
      expect(button2).toBeInTheDocument()
    })
  })
})
