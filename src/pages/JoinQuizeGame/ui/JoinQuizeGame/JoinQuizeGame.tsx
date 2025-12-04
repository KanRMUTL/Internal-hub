import { Container, Typography, Box, Button, Input } from 'shared/ui'
import { LogIn } from 'lucide-react'
import { PageWrapper, JoinCard } from './styled'
import { useJoinGame } from '../../hooks/useJoinGame'

export const JoinQuizeGame = () => {
  const { register, errors, isLoading, error, submit } = useJoinGame()

  return (
    <PageWrapper>
      <Container $maxWidth="sm">
        <Box $display="flex" $justify="center" $mb="xl">
          <Typography as="h1" $size="3xl" $weight="bold" $color="white">
            Quiz Game
          </Typography>
        </Box>

        <JoinCard $padding="lg" $rounded="xl" $shadow="lg">
          <Box $mb="lg" $display="flex" $justify="center">
            <Typography as="h2" $size="xl" $weight="bold">
              Join the Fun!
            </Typography>
          </Box>

          <form onSubmit={submit}>
            <Box $mb="md">
              <Input
                label="Room PIN"
                placeholder="Enter 4-digit PIN"
                {...register('pin', { required: 'Room PIN is required' })}
                error={errors.pin?.message}
                $variant="filled"
              />
            </Box>

            <Box $mb="xl">
              <Input
                label="Nickname"
                placeholder="Enter your nickname"
                {...register('nickname', { required: 'Nickname is required', maxLength: 15 })}
                error={errors.nickname?.message}
                $variant="filled"
              />
            </Box>

            {error && (
              <Box $mb="md">
                <Typography $color="danger" $size="sm" $align="center">
                  {error}
                </Typography>
              </Box>
            )}

            <Button type="submit" $fullWidth $size="lg" disabled={isLoading}>
              {isLoading ? 'Joining...' : 'Join Game'}
              {!isLoading && <LogIn size={20} style={{ marginLeft: '8px' }} />}
            </Button>
          </form>
        </JoinCard>
      </Container>
    </PageWrapper>
  )
}
