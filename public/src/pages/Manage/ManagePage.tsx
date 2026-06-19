import { motion } from 'framer-motion'

export default function ManagePage() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{
        minHeight: '100dvh',
        background: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-serif)',
          color: 'var(--gold)',
          fontSize: 'clamp(32px, 6vw, 72px)',
          fontWeight: 600,
          letterSpacing: '-0.025em',
        }}
      >
        Manage
      </h1>
    </motion.main>
  )
}
