import { Container, Typography } from 'shared/ui'
import { usePlayerGame } from '../../hooks/usePlayerGame'
import { WaitingView } from '../WaitingView'
import { GameOverView } from '../GamOverView'
import { ResultView } from '../ResultView'
import { GameView } from '../GameView'

export const PlayerScreen = () => {
  const { room, player, allPlayers, selectedOption, hasAnswered, handleAnswer } = usePlayerGame()

  if (!room || !player)
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    )

  if (room.status === 'waiting') {
    return <WaitingView player={player} />
  }

  if (room.status === 'finished') {
    return <GameOverView player={player} allPlayers={allPlayers} />
  }

  const currentQuestion = room.questions[room.currentQuestionIndex]
  const isResultState = room.currentQuestionState === 'result'

  if (isResultState) {
    return <ResultView player={player} question={currentQuestion} />
  }

  return (
    <GameView
      room={room}
      player={player}
      handleAnswer={handleAnswer}
      selectedOption={selectedOption}
      hasAnswered={hasAnswered}
    />
  )
}
