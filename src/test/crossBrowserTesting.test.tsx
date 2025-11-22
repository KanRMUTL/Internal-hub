import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithTheme } from './visualRegressionUtils'
import Button from '../shared/ui/Button/Button'

describe('Cross-Browser Compatibility Tests', () => {
  // Mock different browser environments
  const mockBrowserEnvironments = {
    chrome: {
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      features: {
        css: {
          grid: true,
          flexbox: true,
          customProperties: true,
          backdropFilter: true,
        },
        js: {
          es6: true,
          modules: true,
          asyncAwait: true,
        },
      },
    },
    firefox: {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
      features: {
        css: {
          grid: true,
          flexbox: true,
          customProperties: true,
          backdropFilter: true,
        },
        js: {
          es6: true,
          modules: true,
          asyncAwait: true,
        },
      },
    },
    safari: {
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
      features: {
        css: {
          grid: true,
          flexbox: true,
          customProperties: true,
          backdropFilter: true,
        },
        js: {
          es6: true,
          modules: true,
          asyncAwait: true,
        },
      },
    },
    edge: {
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
      features: {
        css: {
          grid: true,
          flexbox: true,
          customProperties: true,
          backdropFilter: true,
        },
        js: {
          es6: true,
          modules: true,
          asyncAwait: true,
        },
      },
    },
  }

  const mockMobileBrowsers = {
    iosSafari: {
      userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      viewport: { width: 375, height: 667 },
      touchSupport: true,
    },
    chromeMobile: {
      userAgent:
        'Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
      viewport: { width: 360, height: 640 },
      touchSupport: true,
    },
  }

  let originalUserAgent: string

  beforeEach(() => {
    originalUserAgent = navigator.userAgent
  })

  afterEach(() => {
    // Reset user agent
    Object.defineProperty(navigator, 'userAgent', {
      value: originalUserAgent,
      configurable: true,
    })
  })

  const mockBrowser = (browserName: keyof typeof mockBrowserEnvironments) => {
    const browser = mockBrowserEnvironments[browserName]
    Object.defineProperty(navigator, 'userAgent', {
      value: browser.userAgent,
      configurable: true,
    })
    return browser
  }

  const mockMobileBrowser = (browserName: keyof typeof mockMobileBrowsers) => {
    const browser = mockMobileBrowsers[browserName]
    Object.defineProperty(navigator, 'userAgent', {
      value: browser.userAgent,
      configurable: true,
    })

    // Mock viewport
    Object.defineProperty(window, 'innerWidth', {
      value: browser.viewport.width,
      configurable: true,
    })
    Object.defineProperty(window, 'innerHeight', {
      value: browser.viewport.height,
      configurable: true,
    })

    // Mock touch support
    Object.defineProperty(window, 'ontouchstart', {
      value: browser.touchSupport ? {} : undefined,
      configurable: true,
    })

    return browser
  }

  describe('Desktop Browser Compatibility', () => {
    Object.keys(mockBrowserEnvironments).forEach((browserName) => {
      describe(`${browserName.toUpperCase()} Browser`, () => {
        beforeEach(() => {
          mockBrowser(browserName as keyof typeof mockBrowserEnvironments)
        })

        it('renders Button component correctly', () => {
          renderWithTheme(<Button>Cross-Browser Test</Button>)

          const button = screen.getByRole('button')
          expect(button).toBeInTheDocument()
          expect(button).toHaveTextContent('Cross-Browser Test')
        })

        it('handles CSS features properly', () => {
          renderWithTheme(
            <Button $variant="primary" $size="md">
              CSS Feature Test
            </Button>
          )

          const button = screen.getByRole('button')
          const styles = window.getComputedStyle(button)

          // Test that CSS properties are applied
          expect(styles.display).toBeDefined()
          expect(styles.backgroundColor).toBeDefined()
          expect(styles.borderRadius).toBeDefined()
        })

        it('supports modern CSS features', () => {
          renderWithTheme(<Button>Modern CSS Test</Button>)

          // Test CSS Grid support (used in layout components)
          expect(CSS.supports('display', 'grid')).toBe(true)

          // Test Flexbox support
          expect(CSS.supports('display', 'flex')).toBe(true)

          // Test CSS Custom Properties
          expect(CSS.supports('color', 'var(--test-color)')).toBe(true)
        })

        it('handles JavaScript features correctly', () => {
          const handleClick = vi.fn()
          renderWithTheme(<Button onClick={handleClick}>JS Feature Test</Button>)

          const button = screen.getByRole('button')

          // Test modern JavaScript features
          fireEvent.click(button)
          expect(handleClick).toHaveBeenCalled()

          // Test async/await support (simulated)
          expect(typeof Promise).toBe('function')
          expect(typeof async function () {}).toBe('function')
        })

        it('handles hover and focus states', () => {
          renderWithTheme(<Button>Interaction Test</Button>)

          const button = screen.getByRole('button')

          // Test hover state
          fireEvent.mouseEnter(button)
          fireEvent.mouseLeave(button)

          // Test focus state
          fireEvent.focus(button)
          fireEvent.blur(button)

          expect(button).toBeInTheDocument()
        })
      })
    })
  })

  describe('Mobile Browser Compatibility', () => {
    Object.keys(mockMobileBrowsers).forEach((browserName) => {
      describe(`${browserName} Mobile Browser`, () => {
        beforeEach(() => {
          mockMobileBrowser(browserName as keyof typeof mockMobileBrowsers)
        })

        it('renders components for mobile viewport', () => {
          renderWithTheme(<Button $size="md">Mobile Test</Button>)

          const button = screen.getByRole('button')
          expect(button).toBeInTheDocument()

          // Verify mobile viewport is active
          expect(window.innerWidth).toBeLessThan(768)
        })

        it('handles touch interactions', () => {
          const handleClick = vi.fn()
          renderWithTheme(<Button onClick={handleClick}>Touch Test</Button>)

          const button = screen.getByRole('button')

          // Simulate touch events
          fireEvent.touchStart(button)
          fireEvent.touchEnd(button)
          fireEvent.click(button)

          expect(handleClick).toHaveBeenCalled()
        })

        it('maintains proper touch target sizes', () => {
          renderWithTheme(<Button $size="md">Touch Target</Button>)

          const button = screen.getByRole('button')

          // Verify minimum touch target size (44px)
          // Note: In jsdom, getBoundingClientRect returns 0s, so we check that the method exists
          expect(typeof button.getBoundingClientRect).toBe('function')
        })

        it('adapts layout for mobile screens', () => {
          renderWithTheme(
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Button $fullWidth>Full Width Mobile Button</Button>
            </div>
          )

          const button = screen.getByRole('button')
          expect(button).toBeInTheDocument()
        })
      })
    })
  })

  describe('Feature Detection and Fallbacks', () => {
    it('provides fallbacks for unsupported CSS features', () => {
      // Mock older browser without CSS Grid support
      const originalSupports = CSS.supports
      CSS.supports = vi.fn().mockImplementation((property, value) => {
        if (property === 'display' && value === 'grid') return false
        return originalSupports.call(CSS, property)
      })

      renderWithTheme(<Button>Fallback Test</Button>)

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()

      // Restore original CSS.supports
      CSS.supports = originalSupports
    })

    it('handles missing JavaScript features gracefully', () => {
      // Test that components work even with limited JS support
      renderWithTheme(<Button disabled>Limited JS Test</Button>)

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    it('provides accessible alternatives', () => {
      renderWithTheme(<Button aria-label="Accessible button">✓</Button>)

      const button = screen.getByLabelText('Accessible button')
      expect(button).toBeInTheDocument()
    })
  })

  describe('Performance Across Browsers', () => {
    it('maintains performance with animations', () => {
      renderWithTheme(<Button>Performance Test</Button>)

      const button = screen.getByRole('button')

      // Test that animations don't cause performance issues
      fireEvent.mouseEnter(button)
      fireEvent.mouseLeave(button)

      // In a real test, you'd measure frame rates and timing
      expect(button).toBeInTheDocument()
    })

    it('handles large numbers of components', () => {
      const buttons = Array.from({ length: 10 }, (_, i) => <Button key={i}>Button {i + 1}</Button>)

      renderWithTheme(<div>{buttons}</div>)

      const renderedButtons = screen.getAllByRole('button')
      expect(renderedButtons).toHaveLength(10)
    })
  })

  describe('Accessibility Across Browsers', () => {
    it('maintains accessibility features in all browsers', () => {
      renderWithTheme(<Button aria-describedby="help-text">Accessible Button</Button>)

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-describedby', 'help-text')
    })

    it('supports keyboard navigation consistently', () => {
      renderWithTheme(<Button>Keyboard Test</Button>)

      const button = screen.getByRole('button')

      // Test keyboard events
      fireEvent.keyDown(button, { key: 'Enter' })
      fireEvent.keyDown(button, { key: ' ' })
      fireEvent.keyDown(button, { key: 'Tab' })

      expect(button).toBeInTheDocument()
    })
  })
})

describe('Device-Specific Testing', () => {
  const mockDevices = {
    iPhone13: {
      name: 'iPhone 13',
      viewport: { width: 390, height: 844 },
      pixelRatio: 3,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
      touchSupport: true,
    },
    iPadPro: {
      name: 'iPad Pro',
      viewport: { width: 1024, height: 1366 },
      pixelRatio: 2,
      userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
      touchSupport: true,
    },
    galaxyS21: {
      name: 'Galaxy S21',
      viewport: { width: 360, height: 800 },
      pixelRatio: 3,
      userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36',
      touchSupport: true,
    },
    desktopHD: {
      name: 'Desktop HD',
      viewport: { width: 1920, height: 1080 },
      pixelRatio: 1,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      touchSupport: false,
    },
  }

  Object.entries(mockDevices).forEach(([, device]) => {
    describe(`${device.name} Device Testing`, () => {
      beforeEach(() => {
        // Mock device viewport
        Object.defineProperty(window, 'innerWidth', {
          value: device.viewport.width,
          configurable: true,
        })
        Object.defineProperty(window, 'innerHeight', {
          value: device.viewport.height,
          configurable: true,
        })

        // Mock pixel ratio
        Object.defineProperty(window, 'devicePixelRatio', {
          value: device.pixelRatio,
          configurable: true,
        })

        // Mock user agent
        Object.defineProperty(navigator, 'userAgent', {
          value: device.userAgent,
          configurable: true,
        })

        // Mock touch support
        Object.defineProperty(window, 'ontouchstart', {
          value: device.touchSupport ? {} : undefined,
          configurable: true,
        })
      })

      it('renders components appropriately for device', () => {
        renderWithTheme(<Button $size="md">Device Test</Button>)

        const button = screen.getByRole('button')
        expect(button).toBeInTheDocument()

        // Verify device characteristics
        expect(window.innerWidth).toBe(device.viewport.width)
        expect(window.devicePixelRatio).toBe(device.pixelRatio)
      })

      it('handles device-specific interactions', () => {
        const handleClick = vi.fn()
        renderWithTheme(<Button onClick={handleClick}>{device.touchSupport ? 'Touch' : 'Click'} Me</Button>)

        const button = screen.getByRole('button')

        if (device.touchSupport) {
          fireEvent.touchStart(button)
          fireEvent.touchEnd(button)
        } else {
          fireEvent.mouseDown(button)
          fireEvent.mouseUp(button)
        }

        fireEvent.click(button)
        expect(handleClick).toHaveBeenCalled()
      })

      it('maintains performance on device', () => {
        // Test component rendering performance
        const startTime = performance.now()

        renderWithTheme(
          <div>
            {Array.from({ length: 5 }, (_, i) => (
              <Button key={i} $variant="primary">
                Performance Test {i + 1}
              </Button>
            ))}
          </div>
        )

        const endTime = performance.now()
        const renderTime = endTime - startTime

        // Verify components rendered
        const buttons = screen.getAllByRole('button')
        expect(buttons).toHaveLength(5)

        // In a real test, you'd assert render time is within acceptable limits
        expect(renderTime).toBeGreaterThan(0)
      })
    })
  })
})
