import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AutoMirrorPage from './pages/AutoMirrorPage'
import Home from './pages/Home'
import PublicChargingZapmapPage from './pages/PublicChargingZapmapPage'
import { generatedPages } from './generatedPages'
import { homeRoute } from './lib/routes'
import useAnimationHandling from './lib/useAnimationHandling'
import {
  GuidesArticlePage,
  NewsArticlePage,
} from './pages/editorial/EditorialPages'
import { GuidesTemplate, NewsTemplate } from './pages/editorial'

function isEditorialRoute(route) {
  return route === '/guides' || route.startsWith('/guides/') || route === '/news' || route.startsWith('/news/')
}

const legacyGeneratedPages = generatedPages.filter((entry) => !isEditorialRoute(entry.route))

function AppRoutes() {
  useAnimationHandling()

  return (
    <Routes>
      <Route path={homeRoute} element={<Home />} />

      <Route path="/guides" element={<GuidesTemplate />} />
      <Route path="/guides/*" element={<GuidesArticlePage />} />
      <Route path="/news" element={<NewsTemplate />} />
      <Route path="/news/*" element={<NewsArticlePage />} />
      <Route path="/public-charging-zapmap" element={<PublicChargingZapmapPage />} />

      {legacyGeneratedPages.map((entry) => (
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
