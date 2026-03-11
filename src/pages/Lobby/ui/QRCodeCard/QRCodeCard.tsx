import { Box, Typography, Button } from 'shared/ui'
import { Copy, QrCode } from 'lucide-react'
import { cva } from 'class-variance-authority'

interface QRCodeCardProps {
  roomPassword: string
  onCopyLink: () => void
}

const lobbyCardVariants = cva(
  'bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700'
)

const pinDisplayVariants = cva(
  'bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-600 mb-6 text-center'
)

export const QRCodeCard = ({ roomPassword, onCopyLink }: QRCodeCardProps) => {
  return (
    <Box>
      <div className="mb-6">
        <div className={lobbyCardVariants()}>
          <div className="mb-4">
            <Typography size="sm" color="secondary" weight="bold">
              JOIN AT
            </Typography>
            <Typography size="lg" weight="bold" color="primary">
              {window.location.host}/quiz/join
            </Typography>
          </div>

          <div className={pinDisplayVariants()}>
            <Typography size="sm" color="secondary" weight="bold" className="mb-2 block">
              GAME PIN
            </Typography>
            <Typography size="4xl" weight="extrabold" className="tracking-[8px] font-mono text-[3rem]">
              {roomPassword}
            </Typography>
          </div>

          <Button variant="secondary" fullWidth onClick={onCopyLink}>
            <Copy size={16} className="mr-2" />
            Copy Link
          </Button>
        </div>
      </div>

      <div className={lobbyCardVariants()}>
        <div className="h-[200px] bg-gray-50 dark:bg-gray-900/30 mb-4 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700">
          <Box display="flex" direction="column" align="center" gap="sm">
            <QrCode size={48} className="text-gray-400" />
            <Typography color="secondary" size="sm">
              QR Code Placeholder
            </Typography>
          </Box>
        </div>
        <Typography size="sm" color="secondary" align="center">
          Scan to join directly
        </Typography>
      </div>
    </Box>
  )
}
