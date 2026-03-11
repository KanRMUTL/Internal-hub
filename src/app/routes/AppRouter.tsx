import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'

import { Layout } from 'widgets/Layout'
import { Home } from 'pages/Home'
import { JoinQuizeGame } from 'pages/JoinQuizeGame'
import { Spinner, Box } from 'shared/ui'

// Lazy loaded pages for performance optimization
const RoomPage = lazy(() => import('pages/Room').then((module) => ({ default: module.RoomPage })))
const HostCreateQuiz = lazy(() => import('pages/HostCreateQuiz').then((module) => ({ default: module.HostCreateQuiz })))
const HostScreen = lazy(() => import('pages/HostScreen').then((module) => ({ default: module.HostScreen })))
const Lobby = lazy(() => import('pages/Lobby').then((module) => ({ default: module.Lobby })))
const PlayerScreen = lazy(() => import('pages/PlayerScreen').then((module) => ({ default: module.PlayerScreen })))

const LoadingFallback = () => (
  <Box flex align="center" justify="center" height="screen">
    <Spinner size={32} />
  </Box>
)

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />

        <Route
          path="/room/:id"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <RoomPage />
            </Suspense>
          }
        />

        <Route
          path="/quiz/create"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <HostCreateQuiz />
            </Suspense>
          }
        />

        <Route
          path="/quiz/host/:roomId"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Lobby />
            </Suspense>
          }
        />

        <Route
          path="/quiz/host/:roomId/game"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <HostScreen />
            </Suspense>
          }
        />

        <Route path="/quiz/join" element={<JoinQuizeGame />} />

        <Route
          path="/quiz/play/:roomId"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <PlayerScreen />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  )
}

export default AppRouter
