"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sceneState } from "@/lib/sceneState";
import { particlesFragment, particlesVertex } from "./shaders/particles";

const { damp } = THREE.MathUtils;

/** PRNG determinista (mulberry32): mismo campo en cada montaje y render puro. */
function seededRandom(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createParticleGeometry(count: number) {
  const random = seededRandom(7);
  const positions = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  const seeds = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    // Volumen amplio delante y detrás del espécimen, más denso cerca del centro.
    const r = 2 + Math.pow(random(), 0.7) * 10;
    const theta = random() * Math.PI * 2;
    positions[i * 3] = Math.cos(theta) * r * 1.4;
    positions[i * 3 + 1] = (random() - 0.5) * 12;
    positions[i * 3 + 2] = Math.sin(theta) * r - 3;
    scales[i] = 0.4 + Math.pow(random(), 3) * 1.6;
    seeds[i] = random();
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  return geometry;
}

type ParticleFieldProps = {
  count: number;
};

export function ParticleField({ count }: ParticleFieldProps) {
  const points = useRef<THREE.Points>(null);
  const material = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => createParticleGeometry(count), [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uEnergy: { value: 0 },
      uIntro: { value: 0 },
      uPixelRatio: { value: 1 },
      uSize: { value: 9 },
      uColorA: { value: new THREE.Color("#cfd6ff") },
      uColorB: { value: new THREE.Color("#7fe7dc") },
    }),
    [],
  );

  useFrame((state, delta) => {
    const p = points.current;
    if (!p || !material.current) return;
    const u = material.current.uniforms;
    const dt = Math.min(delta, 0.1);
    const s = sceneState;

    u.uTime.value += dt * (s.reducedMotion ? 0.25 : 1);
    u.uEnergy.value = damp(u.uEnergy.value, s.energy, 2, dt);
    u.uIntro.value = s.intro;
    u.uPixelRatio.value = state.viewport.dpr;

    // El campo gira muy despacio con el scroll: refuerza la sensación de volumen.
    p.rotation.y = damp(p.rotation.y, s.spin * 0.25, 2, dt);
  });

  return (
    <points ref={points} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        vertexShader={particlesVertex}
        fragmentShader={particlesFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
