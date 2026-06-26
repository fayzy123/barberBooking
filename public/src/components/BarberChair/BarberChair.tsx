import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { MutableRefObject, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import barberChairUrl from "../../assets/barberChair.glb";

useGLTF.preload(barberChairUrl);

// ── Tunables — nudge these by eye ──────────────────────────────
const ABOUT_X = 1.8; // how far right the chair parks (gap from text)
const ABOUT_Y = -0.4; // eye-tuned — raises chair so it's fully in viewport
const SETTLE_START = 0.3; // hero scroll % where it stops spinning & faces left
const FACE_LEFT = -Math.PI * 0.75; // left-facing angle — flip to +Math.PI/2 if wrong way

interface Props {
  scrollProgressRef: MutableRefObject<number>;
  yRotRef: MutableRefObject<number>;
  isDraggingRef: MutableRefObject<boolean>;
  velocityRef: MutableRefObject<number>;
}

export default function BarberChair({
  scrollProgressRef,
  yRotRef,
  isDraggingRef,
  velocityRef,
}: Props) {
  const { scene: baseScene } = useGLTF(barberChairUrl) as {
    scene: THREE.Group;
  };
  const scene = useMemo(() => baseScene.clone(true), [baseScene]);

  const groupRef = useRef<THREE.Group>(null!);
  const mountProgress = useRef(0);
  const materialsRef = useRef<THREE.Material[]>([]);

  useEffect(() => {
    const mats: THREE.Material[] = [];
    scene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      const enable = (mat: THREE.Material) => {
        mat.transparent = true;
        mats.push(mat);
      };
      if (Array.isArray(mesh.material)) mesh.material.forEach(enable);
      else enable(mesh.material);
    });
    materialsRef.current = mats;
  }, [scene]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Mount: scale 0 → 1 over 1.5s easeOutCubic
    if (mountProgress.current < 1) {
      mountProgress.current = Math.min(mountProgress.current + delta / 1.5, 1);
    }
    const t = mountProgress.current;
    const eased = 1 - Math.pow(1 - t, 3);

    const progress = scrollProgressRef.current;
    const isDragging = isDraggingRef.current;

    // ── Rotation ───────────────────────────────────────────────
    if (progress < SETTLE_START) {
      // Hero zone — drag + auto-rotate as before
      if (!isDragging) {
        // Momentum decay
        if (Math.abs(velocityRef.current) > 0.00001) {
          yRotRef.current += velocityRef.current;
          velocityRef.current *= 0.95;
        }
        // Auto-rotation (slower once scrolled)
        yRotRef.current += progress > 0.05 ? 0.001 : 0.002;
      }
    } else {
      // Settle zone — ease to NEAREST left-facing angle, then hold
      velocityRef.current = 0;
      const TWO_PI = Math.PI * 2;
      const k = Math.round((yRotRef.current - FACE_LEFT) / TWO_PI); // nearest turn
      const target = FACE_LEFT + k * TWO_PI;
      yRotRef.current = THREE.MathUtils.lerp(yRotRef.current, target, 0.08);
    }
    groupRef.current.rotation.y = yRotRef.current;

    // ── Position: slide from centre to beside the About text ───
    const HERO_Z = -2;
    // ── Position: different targets for mobile vs desktop ──
    const isMobile = window.innerWidth < 768;

    const posX = THREE.MathUtils.lerp(0, isMobile ? 0 : ABOUT_X, progress);
    const posY = THREE.MathUtils.lerp(
      -1.2,
      isMobile ? -0.95 : ABOUT_Y,
      progress,
    );
    const posZ = THREE.MathUtils.lerp(HERO_Z, 0, progress);
    groupRef.current.position.set(posX, posY, posZ);

    // ── Scale: constant hero size (no shrink), gated by mount ──
    const baseScale = window.innerWidth < 768 ? 1.6 : 2.7;
    groupRef.current.scale.setScalar(baseScale * eased);

    // ── Opacity: fully opaque throughout (no fade) ─────────────
    materialsRef.current.forEach((mat) => {
      (mat as THREE.MeshStandardMaterial).opacity = 1;
    });
  });

  return <primitive ref={groupRef} object={scene} />;
}
