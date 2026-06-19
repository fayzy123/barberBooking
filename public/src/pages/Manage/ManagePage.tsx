import { motion } from 'framer-motion'

export default function ManagePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        minHeight: '100dvh',
        background: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span style={{ color: 'var(--gold)', fontFamily: 'var(--font-serif)', fontSize: '2rem' }}>
        /manage
      </span>
    </motion.div>
  )
}
