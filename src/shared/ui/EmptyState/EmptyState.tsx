import { ReactNode } from 'react'
import Box from '../Box'
import Typography from '../Typography'
import Button from '../Button'
import { Plus } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  icon?: ReactNode
}

const EmptyState = ({ title, description, actionLabel, onAction, icon }: EmptyStateProps) => {
  return (
    <Box flex direction="column" align="center" justify="center" gap="lg" p="xl">
      {icon && (
        <Box flex align="center" justify="center" mb="sm">
          {icon}
        </Box>
      )}

      <Box flex direction="column" align="center" gap="sm">
        <Typography size="xl" weight="semibold" align="center">
          {title}
        </Typography>
        <Typography color="muted" size="base" align="center">
          {description}
        </Typography>
      </Box>

      {actionLabel && onAction && (
        <Box mt="md">
          <Button variant="primary" onClick={onAction}>
            <Box flex align="center" gap="sm">
              <Plus size={16} />
              <Typography color="white" size="sm">
                {actionLabel}
              </Typography>
            </Box>
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default EmptyState
