import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useAnimationPerformance, useDeviceCapabilities } from 'shared/hooks'
import Typography from '../Typography'

interface PerformanceMonitorProps {
  enabled?: boolean
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  showDetails?: boolean
}

/**
 * Development tool for monitoring animation performance
 * Only renders in development mode
 */
const PerformanceMonitor = ({
  enabled = process.env.NODE_ENV === 'development',
  position = 'top-right',
  showDetails = false,
}: PerformanceMonitorProps) => {
  const { metrics, startMonitoring, stopMonitoring } = useAnimationPerformance(enabled)
  const capabilities = useDeviceCapabilities()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (enabled) {
      startMonitoring()
      return () => stopMonitoring()
    }
  }, [enabled, startMonitoring, stopMonitoring])

  // Don't render in production
  if (process.env.NODE_ENV === 'production' || !enabled) {
    return null
  }

  const getFPSColor = (fps: number) => {
    if (fps >= 55) return '#10b981' // Green
    if (fps >= 30) return '#f59e0b' // Yellow
    return '#ef4444' // Red
  }

  return (
    <MonitorContainer $position={position}>
      <MonitorToggle onClick={() => setIsVisible(!isVisible)}>
        <FPSIndicator $color={getFPSColor(metrics.fps)}>{Math.round(metrics.fps)} FPS</FPSIndicator>
      </MonitorToggle>

      {isVisible && (
        <MonitorPanel>
          <Typography $size="sm" $weight="semibold">
            Performance Monitor
          </Typography>

          <MetricRow>
            <Typography $size="xs">FPS:</Typography>
            <Typography $size="xs" $color={metrics.fps >= 50 ? 'success' : 'danger'}>
              {Math.round(metrics.fps)}
            </Typography>
          </MetricRow>

          <MetricRow>
            <Typography $size="xs">Frame Time:</Typography>
            <Typography $size="xs">{metrics.frameTime.toFixed(1)}ms</Typography>
          </MetricRow>

          <MetricRow>
            <Typography $size="xs">Dropped Frames:</Typography>
            <Typography $size="xs" $color={metrics.droppedFrames > 5 ? 'warning' : 'success'}>
              {metrics.droppedFrames}
            </Typography>
          </MetricRow>

          <MetricRow>
            <Typography $size="xs">Performance:</Typography>
            <Typography $size="xs" $color={metrics.isPerformant ? 'success' : 'danger'}>
              {metrics.isPerformant ? 'Good' : 'Poor'}
            </Typography>
          </MetricRow>

          {showDetails && (
            <>
              <Divider />
              <Typography $size="xs" $weight="medium">
                Device Info
              </Typography>

              <MetricRow>
                <Typography $size="xs">Hardware Accel:</Typography>
                <Typography $size="xs" $color={capabilities.supportsHardwareAcceleration ? 'success' : 'warning'}>
                  {capabilities.supportsHardwareAcceleration ? 'Yes' : 'No'}
                </Typography>
              </MetricRow>

              <MetricRow>
                <Typography $size="xs">Device Ratio:</Typography>
                <Typography $size="xs">{capabilities.devicePixelRatio}x</Typography>
              </MetricRow>

              <MetricRow>
                <Typography $size="xs">Low-End Device:</Typography>
                <Typography $size="xs" $color={capabilities.isLowEndDevice ? 'warning' : 'success'}>
                  {capabilities.isLowEndDevice ? 'Yes' : 'No'}
                </Typography>
              </MetricRow>
            </>
          )}
        </MonitorPanel>
      )}
    </MonitorContainer>
  )
}

export default PerformanceMonitor

const MonitorContainer = styled.div<{ $position: string }>`
  position: fixed;
  z-index: 9999;
  font-family: monospace;

  ${({ $position }) => {
    switch ($position) {
      case 'top-left':
        return 'top: 16px; left: 16px;'
      case 'top-right':
        return 'top: 16px; right: 16px;'
      case 'bottom-left':
        return 'bottom: 16px; left: 16px;'
      case 'bottom-right':
        return 'bottom: 16px; right: 16px;'
      default:
        return 'top: 16px; right: 16px;'
    }
  }}
`

const MonitorToggle = styled.button`
  background: rgba(0, 0, 0, 0.8);
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  backdrop-filter: blur(4px);
`

const FPSIndicator = styled.span<{ $color: string }>`
  color: ${({ $color }) => $color};
  font-weight: bold;
  font-size: 12px;
`

const MonitorPanel = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px;
  min-width: 200px;
  backdrop-filter: blur(8px);
  color: white;
`

const MetricRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 4px 0;
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  margin: 8px 0;
`
