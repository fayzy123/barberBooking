import { motion, useReducedMotion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import styles from "./LoadingScreen.module.css";

export interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [count, setCount] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const calledOnComplete = useRef(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) {
      setCount(100);
      const id = setTimeout(onComplete, 500);
      return () => clearTimeout(id);
    }

    const ease = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

    const TOTAL = 2500;
    const TICK = 30;
    const STEPS = TOTAL / TICK;
    let step = 0;
    let fadeId: ReturnType<typeof setTimeout>;

    const intervalId = setInterval(() => {
      step += 1;
      const val = Math.min(Math.round(ease(step / STEPS) * 100), 100);
      setCount(val);
      if (val >= 100) {
        clearInterval(intervalId);
        fadeId = setTimeout(() => setIsFadingOut(true), 300);
      }
    }, TICK);

    return () => {
      clearInterval(intervalId);
      clearTimeout(fadeId);
    };
  }, [prefersReduced, onComplete]);

  const reduced = !!prefersReduced;

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "var(--color-bg)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      initial={{ opacity: 1, scale: 1 }}
      animate={
        isFadingOut ? { opacity: 0, scale: 1.02 } : { opacity: 1, scale: 1 }
      }
      transition={
        isFadingOut ? { duration: 0.6, ease: "easeInOut" } : { duration: 0 }
      }
      onAnimationComplete={() => {
        if (isFadingOut && !calledOnComplete.current) {
          calledOnComplete.current = true;
          onComplete();
        }
      }}
    >
      <div className="flex flex-col items-center">
        <motion.svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-12 h-12 md:w-14 md:h-14"
          stroke="currentColor"
          strokeWidth={1.5}
          style={{ color: "var(--color-gold)" }}
          initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0 }}
        >
          <polygon points="12,2 22,9 18,21 6,21 2,9" />
          <polyline points="2,9 12,14 22,9" />
          <line x1="6" y1="21" x2="12" y2="14" />
          <line x1="18" y1="21" x2="12" y2="14" />
          <line x1="2" y1="9" x2="7" y2="2" />
          <line x1="22" y1="9" x2="17" y2="2" />
          <line x1="7" y1="2" x2="12" y2="2" />
          <line x1="12" y1="2" x2="17" y2="2" />
        </motion.svg>

        <motion.p
          className="font-sans text-[11px] tracking-[4px] text-t3 uppercase mt-4 md:text-[13px] md:tracking-[5px] md:mt-5"
          initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0 }}
        >
          BRAND NAME
        </motion.p>

        {/* Container fixes layout width so scaleX on the line doesn't shift siblings */}
        <div
          className="w-[80px] h-px md:w-[100px]"
          style={{ marginTop: "24px" }}
        >
          <motion.div
            className={styles.line}
            style={{ transformOrigin: "left" }}
            initial={{ scaleX: reduced ? 1 : 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut", delay: 0 }}
          />
        </div>

        <p
          className="font-sans text-[11px] text-t3 md:text-[12px]"
          style={{ marginTop: "12px" }}
        >
          {count}%
        </p>
      </div>
    </motion.div>
  );
}
