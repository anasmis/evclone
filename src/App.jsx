import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AutoMirrorPage from './pages/AutoMirrorPage'
import Home from './pages/Home'
import { generatedPages } from './generatedPages'
import { homeRoute } from './lib/routes'
import useAnimationHandling from './lib/useAnimationHandling'

function AppRoutes() {
  useAnimationHandling()

  return (
    <Routes>
      <Route path={homeRoute} element={<Home />} />
      {generatedPages.map((entry) => (
        <Route key={entry.route} path={entry.route} element={<AutoMirrorPage />} />
      ))}
      {/* Catch-all: solution pages + any unknown URL */}
      <Route path="*" element={<AutoMirrorPage />} />
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
