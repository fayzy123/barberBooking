import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

import LandingPage from './pages/Landing/LandingPage'
import BookingPage from './pages/Booking/BookingPage'
import ManagePage  from './pages/Manage/ManagePage'

/* ─── Animated route shell ──────────────────────────────
   AnimatePresence must sit inside BrowserRouter so it can
   read the location key for exit → enter transitions.
───────────────────────────────────────────────────────── */
function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/"       element={<LandingPage />} />
        <Route path="/book"   element={<BookingPage />} />
        <Route path="/manage" element={<ManagePage />}  />
      </Routes>
    </AnimatePresence>
  )
}

/* ─── App ───────────────────────────────────────────────
   Lenis smooth scroll is initialised here once and wired
   into the GSAP ticker so ScrollTrigger stays in sync.
───────────────────────────────────────────────────────── */
export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    // Keep GSAP ScrollTrigger in sync with Lenis scroll position
    lenis.on('scroll', ScrollTrigger.update)

    // Drive Lenis from the GSAP ticker so they share one rAF loop
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])

  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  )
}
