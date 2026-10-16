"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sceneState } from "@/lib/sceneState";
import { specimenFragment, specimenVertex } from "./shaders/specimen";

const { damp } = THREE.MathUtils;

type SpecimenProps = {
  /** Subdivisiones de la geometría: menos en móvil. */
  detail: number;
};

export function Specimen({ detail }: SpecimenProps) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uEnergy: { value: sceneState.energy },
      uHue: { value: 0 },
      uIntro: { value: 0 },
      uBody: { value: new THREE.Color("#141a44") },
      uFilmA: { value: new THREE.Color("#7fe7dc") },
      uFilmB: { value: new THREE.Color("#b79cff") },
      uFilmC: { value: new THREE.Color("#ffb38a") },
    }),
    [],
  );

  useFrame((state, delta) => {
    const g = group.current;
    const m = mesh.current;
    if (!g || !m || !material.current) return;
    // Los uniforms se mutan a través del material (ref), no del valor memoizado.
    const u = material.current.uniforms;

    const dt = Math.min(delta, 0.1);
    const s = sceneState;
    const motion = s.reducedMotion ? 0.2 : 1;

    u.uTime.value += dt * motion;
    u.uEnergy.value = damp(u.uEnergy.value, s.energy, 3, dt);
    u.uHue.value = damp(u.uHue.value, s.hue, 3, dt);
    u.uIntro.value = s.intro;

    // Posición/escala dirigidas por el scroll, con amortiguación.
    g.position.x = damp(g.position.x, s.x, 3.2, dt);
    g.position.y = damp(g.position.y, s.y, 3.2, dt);
    const targetScale = s.scale * (0.6 + 0.4 * s.intro);
    g.scale.setScalar(damp(g.scale.x, targetScale, 3.2, dt));

    // Rotación continua lenta + giro del scroll + inclinación hacia el cursor.
    m.rotation.y += dt * 0.12 * motion;
    g.rotation.y = damp(g.rotation.y, s.spin + s.pointer.x * 0.35, 2.5, dt);
    g.rotation.x = damp(g.rotation.x, -s.pointer.y * 0.25, 2.5, dt);
  });

  return (
    <group ref={group}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1.15, detail]} />
        <shaderMaterial
          ref={material}
          vertexShader={specimenVertex}
          fragmentShader={specimenFragment}
          uniforms={uniforms}
        />
      </mesh>
    </group>
  );
}
