import { Box, Typography, Button } from 'shared/ui'
import { Copy, QrCode } from 'lucide-react'
import { LobbyCard, PinDisplay } from './styled'

interface QRCodeCardProps {
  roomPassword: string
  onCopyLink: () => void
}

export const QRCodeCard = ({ roomPassword, onCopyLink }: QRCodeCardProps) => {
  return (
    <Box>
      <Box $mb="lg">
        <LobbyCard $padding="lg">
          <Box $mb="sm">
            <Typography $size="sm" $color="secondary" $weight="bold">
              JOIN AT
            </Typography>
            <Typography $size="lg" $weight="bold" $color="primary">
              {window.location.host}/quiz/join
            </Typography>
          </Box>

          <PinDisplay>
            <Typography
              $size="sm"
              $color="secondary"
              $weight="bold"
              style={{ marginBottom: '0.5rem', display: 'block' }}
            >
              GAME PIN
            </Typography>
            <Typography
              $size="3xl"
              $weight="extrabold"
              style={{ letterSpacing: '8px', fontFamily: 'monospace', fontSize: '3rem' }}
            >
              {roomPassword}
            </Typography>
          </PinDisplay>

          <Button $variant="secondary" $fullWidth onClick={onCopyLink}>
            <Copy size={16} style={{ marginRight: '8px' }} />
            Copy Link
          </Button>
        </LobbyCard>
      </Box>

      <LobbyCard $padding="lg">
        <Box
          style={{
            height: '200px',
            backgroundColor: '#f9fafb',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
          }}
        >
          <Box $display="flex" $direction="column" $align="center" $gap="sm">
            <QrCode size={48} color="#9ca3af" />
            <Typography $color="secondary" $size="sm">
              QR Code Placeholder
            </Typography>
          </Box>
        </Box>
        <Typography $size="sm" $color="secondary" $align="center">
          Scan to join directly
        </Typography>
      </LobbyCard>
    </Box>
  )
}
