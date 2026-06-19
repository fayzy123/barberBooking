import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import LandingPage from './pages/Landing/LandingPage'
import BookingPage from './pages/Booking/BookingPage'
import ManagePage from './pages/Manage/ManagePage'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"       element={<LandingPage />} />
        <Route path="/book"   element={<BookingPage />} />
        <Route path="/manage" element={<ManagePage />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  )
}
