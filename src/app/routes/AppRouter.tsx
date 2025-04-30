import { Routes, Route } from 'react-router-dom'
import { LOGO } from 'shared/config'

import { Layout } from 'widgets/Layout'
import { Home } from 'pages/Home'

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout logoPath={LOGO} />}>
        <Route index element={<Home />} />
      </Route>
    </Routes>
  )
}

export default AppRouter
