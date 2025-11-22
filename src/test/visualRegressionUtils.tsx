import { render, RenderOptions } from '@testing-library/react'
import { ReactElement, ReactNode } from 'react'
import { ThemeProvider } from 'styled-components'
import { lightTheme, darkTheme } from 'shared/styles'
import { vi, describe } from 'vitest'

// Theme wrapper for testing
const ThemeWrapper = ({ children, theme }: { children: ReactNode; theme: 'light' | 'dark' }) => (
  <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>{children}</ThemeProvider>
)

// Custom render function with theme support
export const renderWithTheme = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { theme?: 'light' | 'dark' }
) => {
  const { theme = 'light', ...renderOptions } = options || {}

  return render(ui, {
    wrapper: ({ children }) => <ThemeWrapper theme={theme}>{children}</ThemeWrapper>,
    ...renderOptions,
  })
}

// Utility to test both themes
export const testBothThemes = (testFn: (theme: 'light' | 'dark') => void) => {
  describe('Light theme', () => {
    testFn('light')
  })

  describe('Dark theme', () => {
    testFn('dark')
  })
}

// Breakpoint testing utilities
export const breakpoints = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1024, height: 768 },
  widescreen: { width: 1408, height: 900 },
}

// Mock viewport for responsive testing
export const mockViewport = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  })
  window.dispatchEvent(new Event('resize'))
}

// Color contrast testing utility
export const getContrastRatio = (color1: string, color2: string): number => {
  // Simplified contrast ratio calculation for testing
  // In a real implementation, you'd use a proper color library
  const getLuminance = (color: string): number => {
    // This is a simplified version - in practice use a proper color library
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16) / 255
    const g = parseInt(hex.substr(2, 2), 16) / 255
    const b = parseInt(hex.substr(4, 2), 16) / 255

    const [rs, gs, bs] = [r, g, b].map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)))

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }

  const l1 = getLuminance(color1)
  const l2 = getLuminance(color2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)

  return (lighter + 0.05) / (darker + 0.05)
}

// Animation testing utilities
export const mockReducedMotion = (reduced: boolean = true) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: query === '(prefers-reduced-motion: reduce)' ? reduced : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

// Touch target size validation
export const validateTouchTarget = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect()
  const minSize = 44 // WCAG AA minimum touch target size
  return rect.width >= minSize && rect.height >= minSize
}

// Focus indicator validation
export const validateFocusIndicator = (element: HTMLElement): boolean => {
  element.focus()
  const styles = window.getComputedStyle(element)

  // Check for visible focus indicators
  return styles.outline !== 'none' || styles.boxShadow !== 'none' || styles.border !== 'none'
}
