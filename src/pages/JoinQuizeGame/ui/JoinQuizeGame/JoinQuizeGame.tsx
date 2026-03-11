import { Container, Typography, Button, Input } from 'shared/ui'
import { LogIn } from 'lucide-react'
import { useJoinGame } from '../../hooks/useJoinGame'
import { cva } from 'class-variance-authority'

const pageWrapperVariants = cva('min-h-screen bg-primary py-12 px-4 flex flex-col justify-center')

const joinCardVariants = cva('bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-sm mx-auto')

export const JoinQuizeGame = () => {
  const { register, errors, isLoading, error, submit } = useJoinGame()

  return (
    <div className={pageWrapperVariants()}>
      <Container maxWidth="sm">
        <div className="flex justify-center mb-8">
          <Typography size="4xl" weight="bold" color="white">
            Quiz Game
          </Typography>
        </div>

        <div className={joinCardVariants()}>
          <div className="flex justify-center mb-6">
            <Typography size="xl" weight="bold">
              Join the Fun!
            </Typography>
          </div>

          <form onSubmit={submit}>
            <div className="mb-4">
              <Input
                label="Room PIN"
                placeholder="Enter 4-digit PIN"
                {...register('pin', { required: 'Room PIN is required' })}
                error={errors.pin?.message}
                variant="filled"
              />
            </div>

            <div className="mb-8">
              <Input
                label="Nickname"
                placeholder="Enter your nickname"
                {...register('nickname', { required: 'Nickname is required', maxLength: 15 })}
                error={errors.nickname?.message}
                variant="filled"
              />
            </div>

            {error && (
              <div className="mb-4">
                <Typography color="danger" size="sm" align="center">
                  {error}
                </Typography>
              </div>
            )}

            <Button type="submit" fullWidth size="lg" disabled={isLoading}>
              {isLoading ? 'Joining...' : 'Join Game'}
              {!isLoading && <LogIn size={20} className="ml-2" />}
            </Button>
          </form>
        </div>
      </Container>
    </div>
  )
}
