import { MutableRefObject, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface Props {
  scrollProgressRef: MutableRefObject<number>;
}

export default function Particles({ scrollProgressRef }: Props) {
  const { viewport } = useThree();
  const isMobile = viewport.width < 5;
  const COUNT = isMobile ? 150 : 300;

  const mountTime = useRef(0);
  const pointsRef = useRef<THREE.Points>(null!);

  const { targets, phases, geometry } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3); // all start at origin
    const targets = new Float32Array(COUNT * 3);
    const phases = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1 + Math.random() * 2;
      targets[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      targets[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      targets[i * 3 + 2] = r * Math.cos(phi);
      phases[i] = Math.random() * Math.PI * 2;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { targets, phases, geometry: geo };
  }, [COUNT]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    mountTime.current = Math.min(mountTime.current + delta, 2);

    const progress = mountTime.current / 2; // 0→1 over 2s
    const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    const time = state.clock.elapsedTime;

    const posAttr = pointsRef.current.geometry.attributes
      .position as THREE.BufferAttribute;

    for (let i = 0; i < COUNT; i++) {
      const tx = targets[i * 3];
      const ty = targets[i * 3 + 1];
      const tz = targets[i * 3 + 2];
      const phase = phases[i];

      posAttr.setXYZ(
        i,
        tx * eased + Math.sin(time * 0.3 + phase) * 0.05,
        ty * eased + Math.sin(time * 0.4 + phase + 1) * 0.05,
        tz * eased + Math.cos(time * 0.2 + phase + 2) * 0.05
      );
    }
    posAttr.needsUpdate = true;

    // Scroll fade: opacity 1→0 from 50%→80% hero scroll
    const sp = scrollProgressRef.current;
    const mat = pointsRef.current.material as THREE.PointsMaterial;
    if (sp < 0.5) mat.opacity = 1;
    else if (sp > 0.8) mat.opacity = 0;
    else mat.opacity = 1 - (sp - 0.5) / 0.3;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color="#c9a84c"
        size={0.015}
        sizeAttenuation
        transparent
        opacity={1}
        depthWrite={false}
      />
    </points>
  );
}
