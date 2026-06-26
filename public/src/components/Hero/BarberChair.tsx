import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { MutableRefObject, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import barberChairUrl from "../../assets/barberChair.glb";

useGLTF.preload(barberChairUrl);

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

    // Rotation
    if (isDragging) {
      // yRotRef already updated by drag handler — just apply
    } else {
      // Momentum decay
      if (Math.abs(velocityRef.current) > 0.00001) {
        yRotRef.current += velocityRef.current;
        velocityRef.current *= 0.95;
      }
      // Auto-rotation (slower when scrolled)
      yRotRef.current += progress > 0.05 ? 0.001 : 0.002;
    }
    groupRef.current.rotation.y = yRotRef.current;

    // Base scale: 1.8 desktop / 1.2 mobile
    const baseScale = window.innerWidth < 768 ? 1.6 : 2.4;

    // Scroll-driven exit: lerp position and scale
    const posX = THREE.MathUtils.lerp(0, 4, progress);
    const posY = THREE.MathUtils.lerp(-0.6, -4, progress);
    const targetScale = THREE.MathUtils.lerp(baseScale, 0.25, progress);
    const opacity = Math.max(1 - progress * 0.4, 0);

    groupRef.current.position.set(posX, posY, 0);
    // eased = mount animation (0→1 over 1.5s), multiplied by scroll-driven scale
    groupRef.current.scale.setScalar(targetScale * eased);

    materialsRef.current.forEach((mat) => {
      (mat as THREE.MeshStandardMaterial).opacity = opacity;
    });
  });

  return <primitive ref={groupRef} object={scene} />;
}
