import { Routes, Route } from 'react-router-dom'

import { Layout } from 'widgets/Layout'
import { Home } from 'pages/Home'
import { RoomPage } from 'pages/Room'
import { HostCreateQuiz } from 'pages/HostCreateQuiz'
import { HostScreen } from 'pages/HostScreen'
import { Lobby } from 'pages/Lobby'
import { PlayerScreen } from 'pages/PlayerScreen'
import { JoinQuizeGame } from 'pages/JoinQuizeGame'

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/room/:id" element={<RoomPage />} />
        <Route path="/quiz/create" element={<HostCreateQuiz />} />
        <Route path="/quiz/host/:roomId" element={<Lobby />} />
        <Route path="/quiz/host/:roomId/game" element={<HostScreen />} />
        <Route path="/quiz/join" element={<JoinQuizeGame />} />
        <Route path="/quiz/play/:roomId" element={<PlayerScreen />} />
      </Route>
    </Routes>
  )
}

export default AppRouter
