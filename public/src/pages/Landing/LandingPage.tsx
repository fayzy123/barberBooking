import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import * as THREE from "three";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import About from "../../components/About/About";
import BarberChair from "../../components/BarberChair/BarberChair";
import Particles from "../../components/Hero/Particles";
import barbershopBg from "../../assets/barbershop-interior.png";

gsap.registerPlugin(ScrollTrigger);

// Lives inside the Canvas — ramps spotlight from 0 → 5 intensity over 2s
function AnimatedSpotLight() {
  const lightRef = useRef<THREE.SpotLight>(null!);
  const elapsed = useRef(0);

  useFrame((_, delta) => {
    elapsed.current = Math.min(elapsed.current + delta, 2);
    if (lightRef.current) {
      lightRef.current.intensity = (elapsed.current / 2) * 3;
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

export default function LandingPage() {
  const [showLoader, setShowLoader] = useState(true);

  // Shared refs: Hero writes drag state, BarberChair reads them every frame
  const scrollProgressRef = useRef(0);
  const yRotRef = useRef(0);
  const isDraggingRef = useRef(false);
  const velocityRef = useRef(0);

  // Track hero scroll progress — drives BarberChair exit animation
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: "#hero",
      start: "top top",
      end: "bottom top",
      onUpdate: (self) => {
        scrollProgressRef.current = self.progress;
      },
    });
    return () => st.kill();
  }, []);

  return (
    <>
      {/* ── Persistent fixed background ───────────────────────── */}
      {/* z-index 0 — always behind everything */}
      <div
        data-bg="main"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          overflow: "hidden",
          transition: "filter 0.6s ease",
        }}
      >
        <img
          src={barbershopBg}
          alt=""
          aria-hidden="true"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
          draggable={false}
        />
        {/* darkening lives here now — below the canvas (z:1), so the chair stays lit */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(180deg,
      rgba(8,8,8,0.2) 0%,
      rgba(8,8,8,0.45) 35%,
      rgba(8,8,8,0.82) 60%,
      rgba(8,8,8,0.88) 100%)`,
            pointerEvents: "none",
          }}
        />
      </div>
      {/* ── Persistent 3D canvas ──────────────────────────────── */}
      {/* z-index 1 — above bg, below content sections (z-index 2) */}
      {/* pointer-events: none so sections below can scroll normally */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        <Canvas
          shadows
          gl={{ alpha: true, antialias: true }}
          camera={{ position: [0, 0.5, 4], fov: 50 }}
        >
          <ambientLight intensity={0.4} />
          <AnimatedSpotLight />
          {/* Front-left fill to illuminate chair face */}
          <spotLight
            position={[-4, 4, 4]}
            color="#c9a84c"
            intensity={1.5}
            angle={0.5}
            penumbra={0.8}
          />
          <pointLight position={[-3, -1, 2]} color="#c9a84c" intensity={0.3} />

          {/* Particles appear immediately; fade on scroll via scrollProgressRef */}
          <Particles scrollProgressRef={scrollProgressRef} />

          {/* Chair + environment load together */}
          <Suspense fallback={null}>
            <Environment preset="warehouse" background={false} />
            <BarberChair
              scrollProgressRef={scrollProgressRef}
              yRotRef={yRotRef}
              isDraggingRef={isDraggingRef}
              velocityRef={velocityRef}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* ── Scrollable page content ───────────────────────────── */}
      <Navbar />

      {/* Hero: sections have z-index 2 so they paint above the fixed canvas.
          Because hero/about have transparent backgrounds, the canvas at z:1
          shows through semi-transparent overlays inside each section. */}
      <Hero
        scrollProgressRef={scrollProgressRef}
        yRotRef={yRotRef}
        isDraggingRef={isDraggingRef}
        velocityRef={velocityRef}
      />

      <About />

      {/* Loading screen sits above everything until complete */}
      {showLoader && <LoadingScreen onComplete={() => setShowLoader(false)} />}
    </>
  );
}
