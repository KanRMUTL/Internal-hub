import { ReactNode } from 'react'
import Box from '../Box'
import Spinner from '../Spinner'
import Alert from '../Alert'

interface DataBoundaryProps {
  loading: boolean
  error: unknown
  loadingMessage?: string
  errorMessage?: string
  children: ReactNode
}

const DataBoundary = ({
  loading,
  error,
  loadingMessage = 'Loading...',
  errorMessage = 'Something went wrong.',
  children,
}: DataBoundaryProps) => {
  if (loading) {
    return (
      <Box $flex $justify="center" $align="center" $gap="xl" $p="lg">
        <Spinner label={loadingMessage} />
      </Box>
    )
  }

  if (error) {
    return (
      <Box $flex $justify="center" $align="center" $gap="xl" $p="lg">
        <Alert $type="danger">{errorMessage}</Alert>
      </Box>
    )
  }

  return <>{children}</>
}

export default DataBoundary
