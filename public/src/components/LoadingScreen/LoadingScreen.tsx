import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { GemIcon } from '../../shared/components/BrandLogo';
import styles from './LoadingScreen.module.css';

interface LoadingScreenProps {
  onComplete: () => void;
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

const DURATION_MS = 2500;

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [count, setCount] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const isExitingRef = useRef(false);
  const didCallComplete = useRef(false);

  useEffect(() => {
    const start = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const t = Math.min(elapsed / DURATION_MS, 1);
      const value = Math.round(easeInOut(t) * 100);
      setCount(value);

      if (t >= 1) {
        clearInterval(interval);
        isExitingRef.current = true;
        setIsExiting(true);
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  function handleAnimationComplete() {
    if (isExitingRef.current && !didCallComplete.current) {
      didCallComplete.current = true;
      onComplete();
    }
  }

  return (
    <motion.div
      className={styles.root}
      initial={{ opacity: 1, scale: 1 }}
      animate={isExiting ? { opacity: 0, scale: 1.02 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={handleAnimationComplete}
    >
      <div className={styles.inner}>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <GemIcon size={48} />
        </motion.div>

        <motion.p
          className={styles.brand}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
        >
          FAYZY'S CUTS
        </motion.p>

        <motion.div
          className={styles.line}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: 'left' }}
        />

        <motion.p
          className={styles.counter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.55, ease: 'easeOut' }}
        >
          {count}%
        </motion.p>
      </div>
    </motion.div>
  );
}
