import { Typography, Box } from 'shared/ui'
import FortuneHistoryTable from './FortuneHistoryTable'
import { PartyPopper } from 'lucide-react'

interface HistorySectionProps {
  roomId: string
}

const HistorySection = ({ roomId }: HistorySectionProps) => {
  return (
    <Box
      flex
      direction="column"
      bg="secondary"
      radius="lg"
      shadow="sm"
      id="history-section"
      aria-labelledby="history-heading"
      style={{
        border: '1px solid var(--border-color, #e5e7eb)',
        gridColumn: window.innerWidth >= 768 ? '2' : 'auto',
      }}
    >
      <Box flex align="center" justify="center" p="md" px="lg" bg="elevated">
        <Typography id="history-heading" size="lg" weight="semibold" align="center">
          <PartyPopper width={16} height={16} color="#FFC600" />
          {` Fortune History `}
          <PartyPopper width={16} height={16} color="#FFC600" />
        </Typography>
      </Box>
      <Box style={{ flex: 1 }} p="md">
        <FortuneHistoryTable roomId={roomId} />
      </Box>
    </Box>
  )
}

export default HistorySection
