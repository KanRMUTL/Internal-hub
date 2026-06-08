import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

import { Layout } from 'widgets/Layout'

const Home = lazy(() => import('pages/Home').then((m) => ({ default: m.Home })))
const RoomPage = lazy(() => import('pages/Room').then((m) => ({ default: m.RoomPage })))

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route
        index
        element={
          <Suspense fallback={null}>
            <Home />
          </Suspense>
        }
      />
      <Route
        path="/room/:id"
        element={
          <Suspense fallback={null}>
            <RoomPage />
          </Suspense>
        }
      />
    </Route>
  </Routes>
)

export default AppRouter
