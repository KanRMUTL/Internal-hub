import { useEffect, useRef, useState, useCallback } from 'react'

interface PerformanceMetrics {
  fps: number
  frameTime: number
  isPerformant: boolean
  droppedFrames: number
}

/**
 * Hook to monitor animation performance
 * Tracks FPS and provides performance metrics
 */
export const useAnimationPerformance = (enabled = false) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    frameTime: 16.67,
    isPerformant: true,
    droppedFrames: 0,
  })

  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const animationIdRef = useRef<number | undefined>(undefined)
  const droppedFramesRef = useRef(0)

  const measurePerformance = useCallback(() => {
    const currentTime = performance.now()
    const deltaTime = currentTime - lastTimeRef.current

    frameCountRef.current++

    // Calculate frame time
    const frameTime = deltaTime

    // Detect dropped frames (frame time > 20ms indicates dropped frames)
    if (frameTime > 20) {
      droppedFramesRef.current++
    }

    // Calculate FPS every second
    if (deltaTime >= 1000) {
      const fps = Math.round((frameCountRef.current * 1000) / deltaTime)
      const avgFrameTime = deltaTime / frameCountRef.current
      const isPerformant = fps >= 50 && droppedFramesRef.current < 5

      setMetrics({
        fps,
        frameTime: avgFrameTime,
        isPerformant,
        droppedFrames: droppedFramesRef.current,
      })

      // Reset counters
      frameCountRef.current = 0
      droppedFramesRef.current = 0
      lastTimeRef.current = currentTime

      // Log performance warnings in development
      if (process.env.NODE_ENV === 'development') {
        if (fps < 30) {
          console.warn(`🐌 Low FPS detected: ${fps} FPS`)
        }
        if (droppedFramesRef.current > 10) {
          console.warn(`⚠️ High dropped frame count: ${droppedFramesRef.current}`)
        }
      }
    }

    if (enabled) {
      animationIdRef.current = requestAnimationFrame(measurePerformance)
    }
  }, [enabled])

  useEffect(() => {
    if (enabled) {
      lastTimeRef.current = performance.now()
      animationIdRef.current = requestAnimationFrame(measurePerformance)
    }

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [enabled, measurePerformance])

  const startMonitoring = useCallback(() => {
    if (!enabled) {
      lastTimeRef.current = performance.now()
      animationIdRef.current = requestAnimationFrame(measurePerformance)
    }
  }, [enabled, measurePerformance])

  const stopMonitoring = useCallback(() => {
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current)
      animationIdRef.current = undefined
    }
  }, [])

  return {
    metrics,
    startMonitoring,
    stopMonitoring,
    isMonitoring: !!animationIdRef.current,
  }
}

/**
 * Hook to detect device performance capabilities
 */
export const useDeviceCapabilities = () => {
  const [capabilities, setCapabilities] = useState({
    supportsHardwareAcceleration: false,
    devicePixelRatio: 1,
    isLowEndDevice: false,
    maxTextureSize: 0,
  })

  useEffect(() => {
    const detectCapabilities = () => {
      // Test for hardware acceleration support
      const testElement = document.createElement('div')
      testElement.style.transform = 'translate3d(0,0,0)'
      const supportsHardwareAcceleration = testElement.style.transform !== ''

      // Get device pixel ratio
      const devicePixelRatio = window.devicePixelRatio || 1

      // Detect low-end devices based on various factors
      const isLowEndDevice = devicePixelRatio < 2 && navigator.hardwareConcurrency <= 2 && !supportsHardwareAcceleration

      // Try to get WebGL context for texture size
      let maxTextureSize = 0
      try {
        const canvas = document.createElement('canvas')
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
        if (gl && 'getParameter' in gl && 'MAX_TEXTURE_SIZE' in gl) {
          maxTextureSize = (gl as WebGLRenderingContext).getParameter((gl as WebGLRenderingContext).MAX_TEXTURE_SIZE)
        }
      } catch {
        // WebGL not supported
      }

      setCapabilities({
        supportsHardwareAcceleration,
        devicePixelRatio,
        isLowEndDevice,
        maxTextureSize,
      })
    }

    detectCapabilities()
  }, [])

  return capabilities
}

/**
 * Hook that automatically adjusts animation settings based on performance
 */
export const useAdaptiveAnimations = () => {
  const { metrics } = useAnimationPerformance(true)
  const { isLowEndDevice } = useDeviceCapabilities()

  const getAnimationConfig = useCallback(() => {
    // Reduce animation complexity on low-end devices or poor performance
    if (isLowEndDevice || !metrics.isPerformant) {
      return {
        duration: 'fast' as const,
        easing: 'easeOut' as const,
        reduceComplexity: true,
        disableParallax: true,
        simplifyTransforms: true,
      }
    }

    // Full animations for capable devices
    return {
      duration: 'medium' as const,
      easing: 'easeInOut' as const,
      reduceComplexity: false,
      disableParallax: false,
      simplifyTransforms: false,
    }
  }, [isLowEndDevice, metrics.isPerformant])

  return {
    ...metrics,
    isLowEndDevice,
    animationConfig: getAnimationConfig(),
  }
}
