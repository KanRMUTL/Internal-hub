import { useState, useEffect } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'shared/lib/utils'
import { useAnimationPerformance, useDeviceCapabilities } from 'shared/hooks'
import Typography from '../Typography'

const containerVariants = cva('fixed z-[9999] font-mono', {
  variants: {
    position: {
      'top-left': 'top-4 left-4',
      'top-right': 'top-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-right': 'bottom-4 right-4',
    },
  },
  defaultVariants: {
    position: 'top-right',
  },
})

interface PerformanceMonitorProps extends VariantProps<typeof containerVariants> {
  enabled?: boolean
  showDetails?: boolean
  className?: string
}

const PerformanceMonitor = ({
  enabled = process.env.NODE_ENV === 'development',
  position = 'top-right',
  showDetails = false,
  className,
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

  if (process.env.NODE_ENV === 'production' || !enabled) {
    return null
  }

  const getFPSColor = (fps: number) => {
    if (fps >= 55) return '#10b981'
    if (fps >= 30) return '#f59e0b'
    return '#ef4444'
  }

  return (
    <div className={cn(containerVariants({ position, className }))}>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-black/80 border-none rounded px-2 py-1 cursor-pointer backdrop-blur-sm"
      >
        <span className="font-bold text-xs" style={{ color: getFPSColor(metrics.fps) }}>
          {Math.round(metrics.fps)} FPS
        </span>
      </button>

      {isVisible && (
        <div className="absolute top-full right-0 mt-2 bg-black/90 border border-white/10 rounded-lg p-3 min-w-[200px] backdrop-blur-md text-white">
          <Typography size="sm" weight="medium">
            Performance Monitor
          </Typography>

          <div className="flex justify-between items-center my-1">
            <Typography size="xs">FPS:</Typography>
            <Typography size="xs" color={metrics.fps >= 50 ? 'success' : 'danger'}>
              {Math.round(metrics.fps)}
            </Typography>
          </div>

          <div className="flex justify-between items-center my-1">
            <Typography size="xs">Frame Time:</Typography>
            <Typography size="xs">{metrics.frameTime.toFixed(1)}ms</Typography>
          </div>

          <div className="flex justify-between items-center my-1">
            <Typography size="xs">Dropped Frames:</Typography>
            <Typography size="xs" color={metrics.droppedFrames > 5 ? 'warning' : 'success'}>
              {metrics.droppedFrames}
            </Typography>
          </div>

          <div className="flex justify-between items-center my-1">
            <Typography size="xs">Performance:</Typography>
            <Typography size="xs" color={metrics.isPerformant ? 'success' : 'danger'}>
              {metrics.isPerformant ? 'Good' : 'Poor'}
            </Typography>
          </div>

          {showDetails && (
            <>
              <hr className="border-none border-t border-white/20 my-2" />
              <Typography size="xs" weight="medium">
                Device Info
              </Typography>

              <div className="flex justify-between items-center my-1">
                <Typography size="xs">Hardware Accel:</Typography>
                <Typography size="xs" color={capabilities.supportsHardwareAcceleration ? 'success' : 'warning'}>
                  {capabilities.supportsHardwareAcceleration ? 'Yes' : 'No'}
                </Typography>
              </div>

              <div className="flex justify-between items-center my-1">
                <Typography size="xs">Device Ratio:</Typography>
                <Typography size="xs">{capabilities.devicePixelRatio}x</Typography>
              </div>

              <div className="flex justify-between items-center my-1">
                <Typography size="xs">Low-End Device:</Typography>
                <Typography size="xs" color={capabilities.isLowEndDevice ? 'warning' : 'success'}>
                  {capabilities.isLowEndDevice ? 'Yes' : 'No'}
                </Typography>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default PerformanceMonitor
