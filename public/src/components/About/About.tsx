import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./About.module.css";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const stats = [
  { key: "cuts", label: "Cuts", delay: 0 },
  { key: "rating", label: "Rating", delay: 0.12 },
  { key: "barbers", label: "Barbers", delay: 0.24 },
] as const;

export default function About() {
  const statsRef = useRef<HTMLDivElement>(null!);

  // Count-up display values
  const [counts, setCounts] = useState({
    cuts: "0",
    rating: "0.0",
    barbers: "0",
  });

  // Plain objects GSAP can tween
  const cutsObj = useRef({ val: 0 });
  const ratingObj = useRef({ val: 0 });
  const barbersObj = useRef({ val: 0 });
  const started = useRef(false);

  const startCountUp = useCallback(() => {
    if (started.current) return;
    started.current = true;

    gsap.to(cutsObj.current, {
      val: 4000,
      duration: 1.5,
      ease: "power1.out",
      onUpdate: () => {
        const v = Math.round(cutsObj.current.val);
        setCounts((p) => ({ ...p, cuts: v >= 4000 ? "4k+" : v.toString() }));
      },
    });
    gsap.to(ratingObj.current, {
      val: 4.9,
      duration: 1.5,
      ease: "power1.out",
      onUpdate: () =>
        setCounts((p) => ({ ...p, rating: ratingObj.current.val.toFixed(1) })),
    });
    gsap.to(barbersObj.current, {
      val: 3,
      duration: 1.5,
      ease: "power1.out",
      onUpdate: () =>
        setCounts((p) => ({
          ...p,
          barbers: Math.round(barbersObj.current.val).toString(),
        })),
    });
  }, []);

  useEffect(() => {
    const bg = document.querySelector('[data-bg="main"]') as HTMLElement | null;
    if (!bg) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        bg.style.filter = entry.isIntersecting
          ? "brightness(0.75)" // darken when About is visible — tune this
          : "brightness(1)"; // restore when scrolled away
      },
      { threshold: 0.2 },
    );

    const section = document.getElementById("about");
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  // Trigger count-up when stat chips scroll into view
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startCountUp();
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [startCountUp]);

  const displayNums: Record<string, string> = {
    cuts: counts.cuts,
    rating: `${counts.rating} ★`,
    barbers: counts.barbers,
  };

  return (
    <section id="about" className={styles.about}>
      <div className={styles.overlay} />
      <div className={styles.inner}>
        {/* ── Text block slides in FROM LEFT simultaneously ─── */}
        <motion.div
          className={styles.textBlock}
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <p className={styles.eyebrow}>Our Story</p>

          <h2 className={styles.headline}>
            Crafted for the{" "}
            <em className={styles.goldItalic}>Modern Gentleman</em>
          </h2>

          <p className={styles.body}>
            Since 1999 we&apos;ve been the destination for those who understand
            that a great haircut is an investment. Our barbers don&apos;t just
            cut hair — they craft confidence, one appointment at a time.
          </p>

          <blockquote className={styles.quote}>
            <p className={styles.quoteText}>
              &ldquo;Every cut tells a story. We make sure yours is worth
              telling.&rdquo;
            </p>
            <footer className={styles.quoteFooter}>— Fayzy, Founder</footer>
          </blockquote>
        </motion.div>

        {/* ── Stat chips rise FROM BOTTOM simultaneously ───── */}
        <div ref={statsRef} className={styles.stats}>
          {stats.map(({ key, label, delay }) => (
            <motion.div
              key={label}
              className={styles.chip}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.9,
                ease: EASE,
                delay: delay, // 0, 0.12, 0.24 — tiny stagger between chips only
              }}
            >
              <span className={styles.chipNum}>{displayNums[key]}</span>
              <span className={styles.chipLabel}>{label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
