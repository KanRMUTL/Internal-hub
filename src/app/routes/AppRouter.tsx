import { Routes, Route } from 'react-router-dom'

import { Layout } from 'widgets/Layout'
import { Home } from 'pages/Home'
import { RoomPage } from 'pages/Room'
import { HostCreatePage } from 'pages/HostCreatePage'
import { HostGamePage } from 'pages/HostGamePage'
import { HostLobbyPage } from 'pages/HostLobbyPage'
import { PlayerGamePage } from 'pages/PlayerGamePage'
import { PlayerJoinPage } from 'pages/PlayerJoinPage'

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/room/:id" element={<RoomPage />} />
        <Route path="/quiz/create" element={<HostCreatePage />} />
        <Route path="/quiz/host/:roomId" element={<HostLobbyPage />} />
        <Route path="/quiz/host/:roomId/game" element={<HostGamePage />} />
        <Route path="/quiz/join" element={<PlayerJoinPage />} />
        <Route path="/quiz/play/:roomId" element={<PlayerGamePage />} />
      </Route>
    </Routes>
  )
}

export default AppRouter
