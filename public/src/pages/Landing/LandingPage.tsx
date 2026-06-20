import { useState } from 'react';
import { motion } from 'framer-motion';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      {!isLoaded && (
        <LoadingScreen onComplete={() => setIsLoaded(true)} />
      )}

      {isLoaded && (
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
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
            Landing
          </h1>
        </motion.main>
      )}
    </>
  );
}
