import { useNavigate } from 'react-router-dom'
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
} from 'framer-motion'
import Navbar from '../../components/Navbar/Navbar'
import styles from './LandingPage.module.css'

/* ─────────────────────────────────────────────────────────
   ANIMATED TITLE
   Each character is a motion.span, driven by staggerChildren
   on the parent motion.h1. "Meets Craft" chars get gold+italic.
───────────────────────────────────────────────────────── */
const LINE_1 = 'Where Style '   // trailing space = line break padding
const LINE_2 = 'Meets Craft'
const LINE_1_LEN = LINE_1.length // 12

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.25,
    },
  },
}

const charVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
}

function AnimatedTitle() {
  const allChars = [...LINE_1, '\n', ...LINE_2]

  return (
    <motion.h1
      className={styles.heroTitle}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {allChars.map((char, i) => {
        if (char === '\n') return <br key="br" />

        const isGold = i > LINE_1_LEN  // chars after the newline marker
        return (
          <motion.span
            key={i}
            variants={charVariants}
            style={{
              display: 'inline-block',
              ...(isGold ? { color: 'var(--gold)', fontStyle: 'italic' } : {}),
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        )
      })}
    </motion.h1>
  )
}

/* ─────────────────────────────────────────────────────────
   SCISSORS SVG  (fixed right, scroll-driven rotation + glow)
───────────────────────────────────────────────────────── */
function ScissorsSVG() {
  const { scrollYProgress } = useScroll()
  const rotate   = useTransform(scrollYProgress, [0, 1], [0, 540])
  const glowPx   = useTransform(scrollYProgress, [0, 1], [0, 16])
  const glowA    = useTransform(scrollYProgress, [0, 1], [0.08, 0.82])
  const filter   = useMotionTemplate`drop-shadow(0 0 ${glowPx}px rgba(201,168,76,${glowA}))`

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: 'fixed',
        right: 18,
        top: '50%',
        y: '-50%',
        rotate,
        zIndex: 40,
        pointerEvents: 'none',
        filter,
      }}
    >
      <svg width="28" height="72" viewBox="0 0 36 90" fill="none">
        <circle cx="10" cy="13" r="8"   stroke="var(--gold)" strokeWidth="1.4" />
        <circle cx="26" cy="13" r="8"   stroke="var(--gold)" strokeWidth="1.4" />
        <circle cx="10" cy="13" r="3"   fill="var(--gold)" fillOpacity="0.3" />
        <circle cx="26" cy="13" r="3"   fill="var(--gold)" fillOpacity="0.3" />
        <circle cx="18" cy="36" r="2.5" fill="var(--gold)" fillOpacity="0.6" />
        <path d="M14 21 Q16 29 18 36 Q14 54 10 82" stroke="var(--gold)" strokeWidth="1.4" />
        <path d="M22 21 Q20 29 18 36 Q22 54 26 82" stroke="var(--gold)" strokeWidth="1.4" />
      </svg>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────
   SCROLL INDICATOR
───────────────────────────────────────────────────────── */
function ScrollIndicator() {
  return (
    <motion.div
      className={styles.scrollIndicator}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.5, duration: 0.7 }}
    >
      <motion.div
        className={styles.scrollLine}
        animate={{ scaleY: [1, 0.25, 1], opacity: [0.45, 1, 0.45] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
      />
      <span className={styles.scrollLabel}>Scroll</span>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────
   LANDING PAGE
───────────────────────────────────────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate()

  // Parallax: bg image drifts at 0.4× scroll speed
  const { scrollY } = useScroll()
  const bgY = useTransform(scrollY, [0, 700], ['0%', '28%'])

  // Timing: last char index = LINE_1_LEN + LINE_2.length = 12 + 11 = 23
  // Stagger: delayChildren=0.25, each step=0.03 → last char at 0.25 + 23*0.03 = 0.94
  // Last char completes at 0.94 + 0.48 ≈ 1.42s
  const subtitleDelay = 1.55
  const ctaDelay      = 2.05

  return (
    <motion.div
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Navbar />
      <ScissorsSVG />

      {/* ═══ HERO ════════════════════════════════════════ */}
      <section id="hero" className={styles.hero}>
        {/* Parallax photo layer */}
        <motion.div className={styles.heroBg} style={{ y: bgY }} />
        {/* Gradient overlay */}
        <div className={styles.heroOverlay} />

        {/* Content */}
        <div className={styles.heroContent}>
          {/* Eyebrow tag */}
          <motion.div
            className={styles.heroBrow}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            ✦ Est. 2019 · Nottingham
          </motion.div>

          {/* Per-character stagger headline */}
          <AnimatedTitle />

          {/* Subtitle — fades up after headline completes */}
          <motion.p
            className={styles.heroSub}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.65,
              delay: subtitleDelay,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            Premium grooming in the heart of Nottingham
          </motion.p>

          {/* CTAs */}
          <motion.div
            className={styles.heroCtas}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.65,
              delay: ctaDelay,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <button
              className={styles.ctaGold}
              onClick={() => navigate('/book')}
            >
              Book Your Appointment
            </button>
            <button
              className={styles.ctaGhost}
              onClick={() =>
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Our Story
            </button>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <ScrollIndicator />
      </section>

      {/* ═══ SCROLL-TEST PLACEHOLDER ═════════════════════
           Provides content below the hero so all scroll-driven
           animations (parallax, scissors, navbar blur) can be
           tested before real sections are built.
      ════════════════════════════════════════════════════ */}
      {(['services', 'about', 'team'] as const).map((id) => (
        <section
          key={id}
          id={id}
          style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderTop: '1px solid var(--b1)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(28px, 5vw, 56px)',
              color: 'var(--gold)',
              opacity: 0.15,
              letterSpacing: '-0.02em',
            }}
          >
            /{id}
          </span>
        </section>
      ))}
    </motion.div>
  )
}
