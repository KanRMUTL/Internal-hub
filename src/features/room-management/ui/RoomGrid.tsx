import { ReactNode } from 'react'
import { Box } from 'shared/ui'

interface RoomGridProps {
  children: ReactNode
}

const RoomGrid = ({ children }: RoomGridProps) => {
  return (
    <Box
      grid
      gridColumns="1fr"
      tabletGridColumns="repeat(auto-fit, minmax(280px, 1fr))"
      desktopGridColumns="repeat(auto-fit, minmax(320px, 1fr))"
      gap="md"
      tabletGap="lg"
      desktopGap="xl"
      p="md"
      tabletP="lg"
      desktopP="xl"
      width="100%"
      style={{
        margin: '0 auto',
        // Ensure minimum card width on mobile
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
      }}
    >
      {children}
    </Box>
  )
}

export default RoomGrid
