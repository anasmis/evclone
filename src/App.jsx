import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import MirrorPage from './pages/MirrorPage'
import { homeRoute, mirroredRoutes } from './lib/routes'
import useAnimationHandling from './lib/useAnimationHandling'

function AppRoutes() {
  useAnimationHandling()

  return (
    <Routes>
      <Route path={homeRoute} element={<Home />} />
      {mirroredRoutes.map((path) => (
        <Route key={path} path={path} element={<MirrorPage />} />
      ))}
      <Route path="*" element={<MirrorPage />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
