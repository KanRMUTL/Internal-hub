import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock matchMedia for tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock CSS.supports for cross-browser testing
Object.defineProperty(window, 'CSS', {
  value: {
    supports: vi.fn().mockImplementation((property: string, value: string) => {
      // Mock support for modern CSS features
      const supportedFeatures = {
        display: ['grid', 'flex', 'block', 'inline-block'],
        color: ['var(--test-color)', 'rgb(255, 255, 255)', '#ffffff'],
        'backdrop-filter': ['blur(10px)'],
        'border-radius': ['10px'],
      }

      return supportedFeatures[property as keyof typeof supportedFeatures]?.includes(value) ?? false
    }),
  },
  writable: true,
})
