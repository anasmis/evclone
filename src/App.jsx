import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import NetworkMapPage from './pages/NetworkMapPage'
import CarteEvplug from './pages/products/CarteEvplug'
import Installation from './pages/Installation'
import HomeCharging from './pages/home/HomeCharging'
import Entreprise from './pages/solutions/Entreprise'
import Copropriete from './pages/solutions/Copropriete'
import Parkings from './pages/solutions/Parkings'
import Hotels from './pages/solutions/Hotels'
import StationsService from './pages/solutions/StationsService'
import EvoneManagementPlatform from './pages/solutions/EvoneManagementPlatform'
import AboutPage from './pages/AboutPage'
import ContactUs from './pages/ContactUs'
import VehicleGuides from './pages/VehicleGuides'
import NewsListing from './pages/NewsListing'
import GuidesListing from './pages/GuidesListing'
import ArticlePage from './pages/ArticlePage'
import TrainingHub from './pages/training/TrainingHub'
import Electricians from './pages/training/Electricians'
import Corporate from './pages/training/Corporate'
import NotFoundPage from './pages/NotFoundPage'
import { homeRoute } from './lib/routes'
import useAnimationHandling from './lib/useAnimationHandling'

function AppRoutes() {
  useAnimationHandling()

  return (
    <Routes>
      <Route path={homeRoute} element={<HomePage />} />

      <Route path="/guides" element={<GuidesListing />} />
      <Route path="/guides/:slug" element={<ArticlePage familyKey="guides" />} />
      <Route path="/news" element={<NewsListing />} />
      <Route path="/news/:slug" element={<ArticlePage familyKey="news" />} />
      <Route path="/reseau" element={<NetworkMapPage />} />

      <Route path="/products/carte-evplug" element={<CarteEvplug />} />
      <Route path="/products/pod-drive" element={<Navigate to="/products/carte-evplug" replace />} />
      <Route path="/installation" element={<Installation />} />
      <Route path="/home/home-charging" element={<HomeCharging />} />

      <Route path="/solutions/entreprise" element={<Entreprise />} />
      <Route path="/solutions/copropriete" element={<Copropriete />} />
      <Route path="/solutions/parkings" element={<Parkings />} />
      <Route path="/solutions/hotels" element={<Hotels />} />
      <Route path="/solutions/stations-service" element={<StationsService />} />
      <Route path="/solutions/evone-management-platform" element={<EvoneManagementPlatform />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact-us" element={<ContactUs />} />
      <Route path="/vehicle-guides" element={<VehicleGuides />} />

      <Route path="/training" element={<TrainingHub />} />
      <Route path="/training/electricians" element={<Electricians />} />
      <Route path="/training/corporate" element={<Corporate />} />
      <Route path="/approved-installer-training" element={<Navigate to="/training" replace />} />

      <Route path="*" element={<NotFoundPage />} />
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
