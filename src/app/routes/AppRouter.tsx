import { Routes, Route } from 'react-router-dom'

import { Layout } from 'widgets/Layout'
import { Home } from 'pages/Home'
import { RoomPage } from 'pages/Room'

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/room/:id" element={<RoomPage />} />
      </Route>
    </Routes>
  )
}

export default AppRouter
