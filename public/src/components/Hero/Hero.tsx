import { motion, useReducedMotion } from "framer-motion";
import { MutableRefObject, useEffect, useRef } from "react";
import { useDrag } from "@use-gesture/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import styles from "./Hero.module.css";

gsap.registerPlugin(ScrollTrigger);

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04, delayChildren: 0.8 },
  },
};

const charVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

function splitChars(text: string, key: string) {
  return text.split("").map((char, i) => (
    <motion.span
      key={`${key}-${i}`}
      variants={charVariants}
      style={{ display: "inline-block" }}
    >
      {char === " " ? " " : char}
    </motion.span>
  ));
}

export interface HeroProps {
  scrollProgressRef: MutableRefObject<number>;
  yRotRef: MutableRefObject<number>;
  isDraggingRef: MutableRefObject<boolean>;
  velocityRef: MutableRefObject<number>;
}

export default function Hero({
  scrollProgressRef,
  yRotRef,
  isDraggingRef,
  velocityRef,
}: HeroProps) {
  const prefersReduced = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null!);
  const contentRef = useRef<HTMLDivElement>(null!);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Text fades out + lifts at 40% hero scroll
      if (!prefersReduced) {
        gsap.to(contentRef.current, {
          y: -20,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "40% top",
            scrub: true,
          },
        });
      }
      // Scroll indicator fades at 5% scroll
      gsap.to(scrollIndicatorRef.current, {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "5% top",
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, [prefersReduced]);

  // Drag to spin the chair (canvas is above in LandingPage, reads these refs)
  const bind = useDrag(
    ({ delta: [dx], last, active }) => {
      if (scrollProgressRef.current > 0.05) {
        isDraggingRef.current = false;
        velocityRef.current = 0;
        return;
      }
      isDraggingRef.current = active && !last;
      yRotRef.current += dx * 0.004;
      if (last) velocityRef.current = dx * 0.0012;
    },
    { filterTaps: true }
  );

  return (
    <section id="hero" ref={heroRef} className={styles.hero}>
      {/* Gradient overlay — darkens the fixed background */}
      <div className={styles.overlay} />

      {/* Full-section drag capture for 3D chair rotation */}
      <div
        className={styles.dragOverlay}
        {...(bind() as React.HTMLAttributes<HTMLDivElement>)}
      />

      {/* HTML overlay — bottom-left text */}
      <div ref={contentRef} className={styles.content}>
        <motion.div
          className={styles.eyebrowWrap}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
        >
          <span className={styles.eyebrow}>Est. 2019 · Nottingham</span>
        </motion.div>

        <motion.h1
          className={styles.headline}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <span className={styles.line1}>{splitChars("Where Style", "l1")}</span>
          <span className={styles.line2}>{splitChars("Meets Craft", "l2")}</span>
        </motion.h1>

        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 1.8 }}
        >
          Premium cuts. Effortless booking.
        </motion.p>
      </div>

      {/* Scroll indicator — bottom centre */}
      <div ref={scrollIndicatorRef} className={styles.scrollIndicator}>
        <span className={styles.scrollLabel}>Scroll</span>
        <span className={styles.scrollLine} />
      </div>
    </section>
  );
}
