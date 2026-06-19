import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import styles from './Navbar.module.css'

/* ── Gem icon (SVG) ─────────────────────────────────── */
function GemIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <polygon
        points="14,2 26,9 26,19 14,26 2,19 2,9"
        stroke="var(--gold)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
      />
      <polygon
        points="14,2 20,9 14,15 8,9"
        fill="var(--gold)"
        fillOpacity="0.28"
      />
      <line x1="2" y1="9" x2="26" y2="9" stroke="var(--gold)" strokeWidth="1.5" />
      <polyline
        points="8,9 14,26 20,9"
        fill="none"
        stroke="var(--gold)"
        strokeWidth="1"
        strokeLinejoin="round"
        strokeOpacity="0.55"
      />
    </svg>
  )
}

/* ── Navbar ──────────────────────────────────────────── */
export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 60))

  const handleScrollTo = (id: string) => {
    setMenuOpen(false)
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 150)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const navLinks = [
    { label: 'About',    onClick: () => handleScrollTo('about') },
    { label: 'Services', onClick: () => handleScrollTo('services') },
    { label: 'Team',     onClick: () => handleScrollTo('team') },
  ]

  return (
    <>
      {/* ── Main bar ──────────────────────────────────── */}
      <motion.nav
        className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Logo */}
        <button className={styles.logo} onClick={() => navigate('/')} aria-label="Home">
          <GemIcon />
          <span className={styles.logoText}>Fayzy's Cuts</span>
        </button>

        {/* Desktop links */}
        <div className={styles.desktopLinks}>
          {navLinks.map((l) => (
            <button key={l.label} className={styles.navLink} onClick={l.onClick}>
              {l.label}
            </button>
          ))}
          <button className={styles.manageLink} onClick={() => navigate('/manage')}>
            Manage Booking
          </button>
          <button className={styles.bookBtn} onClick={() => navigate('/book')}>
            Book Now
          </button>
        </div>

        {/* Hamburger */}
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.span
            animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
        </button>
      </motion.nav>

      {/* ── Full-screen mobile overlay ────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={styles.mobileOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className={styles.mobileNav}>
              {navLinks.map((l, i) => (
                <motion.button
                  key={l.label}
                  className={styles.mobileNavLink}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.06 + i * 0.08,
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  onClick={l.onClick}
                >
                  {l.label}
                </motion.button>
              ))}

              <div className={styles.mobileDivider} />

              <motion.button
                className={styles.mobileManageLink}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => { navigate('/manage'); setMenuOpen(false) }}
              >
                Manage Booking
              </motion.button>

              <motion.button
                className={styles.mobileBookBtn}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => { navigate('/book'); setMenuOpen(false) }}
              >
                Book Now
              </motion.button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
