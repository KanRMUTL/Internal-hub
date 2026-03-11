import { Box, Card, Skeleton } from 'shared/ui'

const RoomCardSkeleton = () => {
  return (
    <Card padding="lg" shadow="md" rounded="lg">
      <Box flex direction="column" justify="space-between" align="center" gap="lg">
        <Box flex direction="column" align="center" gap="sm" p="md" width="100%">
          <Skeleton width="120px" height="24px" rounded="md" />
          <Skeleton width="80px" height="16px" rounded="sm" />
        </Box>
        <Box flex justify="center" gap="lg" width="100%">
          <Skeleton width="80px" height="36px" rounded="md" />
          <Skeleton width="80px" height="36px" rounded="md" />
        </Box>
      </Box>
    </Card>
  )
}

export default RoomCardSkeleton
