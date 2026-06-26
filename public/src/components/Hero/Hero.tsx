import { motion, useReducedMotion } from "framer-motion";
import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { useDrag } from "@use-gesture/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import * as THREE from "three";
import BarberChair from "./BarberChair";
import Particles from "./Particles";
import barbershopBg from "../../assets/barbershop-interior.png";
import styles from "./Hero.module.css";

gsap.registerPlugin(ScrollTrigger);

// Animated gold spotlight that ramps from 0→5 intensity over 2s
function AnimatedSpotLight() {
  const lightRef = useRef<THREE.SpotLight>(null!);
  const elapsed = useRef(0);

  useFrame((_, delta) => {
    elapsed.current = Math.min(elapsed.current + delta, 2);
    if (lightRef.current) {
      lightRef.current.intensity = (elapsed.current / 2) * 5;
    }
  });

  return (
    <spotLight
      ref={lightRef}
      position={[3, 8, 3]}
      color="#c9a84c"
      intensity={0}
      angle={0.4}
      penumbra={0.8}
      castShadow
    />
  );
}

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

export default function Hero() {
  const prefersReduced = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null!);
  const contentRef = useRef<HTMLDivElement>(null!);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null!);

  const scrollProgressRef = useRef(0);
  const yRotRef = useRef(0);
  const isDraggingRef = useRef(false);
  const velocityRef = useRef(0);

  // GSAP scroll effects
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Track hero scroll progress for R3F components
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          scrollProgressRef.current = self.progress;
        },
      });

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

  // Drag to rotate barber chair
  const bind = useDrag(
    ({ delta: [dx], last, active }) => {
      if (scrollProgressRef.current > 0.05) {
        isDraggingRef.current = false;
        velocityRef.current = 0;
        return;
      }
      isDraggingRef.current = active && !last;
      yRotRef.current += dx * 0.004;
      if (last) {
        velocityRef.current = dx * 0.0012;
      }
    },
    { filterTaps: true },
  );

  return (
    <section ref={heroRef} className={styles.hero}>
      {/* Static background */}
      <img
        src={barbershopBg}
        alt=""
        aria-hidden="true"
        className={styles.bgImg}
        draggable={false}
      />

      {/* Dark gradient overlay */}
      <div className={styles.overlay} />

      {/* R3F Canvas — full section, pointer events captured for drag */}
      <div
        className={styles.canvasWrapper}
        {...(bind() as React.HTMLAttributes<HTMLDivElement>)}
      >
        <Canvas
          shadows
          gl={{ alpha: true, antialias: true }}
          camera={{ position: [0, 0.5, 4], fov: 50 }}
        >
          <ambientLight intensity={0.4} />
          <AnimatedSpotLight />
          {/* Front-left fill light to illuminate chair face */}
          <spotLight
            position={[-4, 4, 4]}
            color="#c9a84c"
            intensity={1.5}
            angle={0.5}
            penumbra={0.8}
          />
          <pointLight position={[-3, -1, 2]} color="#c9a84c" intensity={0.3} />

          {/* Particles render immediately (no async loading) */}
          <Particles scrollProgressRef={scrollProgressRef} />

          {/* Chair + environment suspend together */}
          <Suspense fallback={null}>
            <Environment preset="night" background={false} />
            <BarberChair
              scrollProgressRef={scrollProgressRef}
              yRotRef={yRotRef}
              isDraggingRef={isDraggingRef}
              velocityRef={velocityRef}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* HTML overlay — bottom-left text */}
      <div ref={contentRef} className={styles.content}>
        {/* Eyebrow badge */}
        <motion.div
          className={styles.eyebrowWrap}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
        >
          <span className={styles.eyebrow}>Est. 2019 · Nottingham</span>
        </motion.div>

        {/* Headline with per-character stagger */}
        <motion.h1
          className={styles.headline}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <span className={styles.line1}>
            {splitChars("Where Style", "l1")}
          </span>
          <span className={styles.line2}>
            {splitChars("Meets Craft", "l2")}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 1.8 }}
        >
          Premium cuts. Effortless booking.
        </motion.p>
      </div>

      {/* Scroll indicator — bottom center */}
      <div ref={scrollIndicatorRef} className={styles.scrollIndicator}>
        <span className={styles.scrollLabel}>Scroll</span>
        <span className={styles.scrollLine} />
      </div>
    </section>
  );
}
