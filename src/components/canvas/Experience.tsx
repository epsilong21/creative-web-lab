"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { sceneState } from "@/lib/sceneState";
import { CameraRig } from "./CameraRig";
import { ParticleField } from "./ParticleField";
import { Specimen } from "./Specimen";

type Quality = { particles: number; detail: number; dpr: [number, number] };

function pickQuality(): Quality {
  const small = window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;
  return small
    ? { particles: 900, detail: 28, dpr: [1, 1.5] }
    : { particles: 2400, detail: 56, dpr: [1, 1.75] };
}

/**
 * Lienzo WebGL fijo detrás del contenido. Se carga solo en cliente
 * (ver SceneLoader) y no captura eventos: el DOM sigue siendo navegable.
 */
export default function Experience() {
  const [quality] = useState(pickQuality);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      sceneState.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      sceneState.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 40, near: 0.1, far: 40 }}
        dpr={quality.dpr}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <CameraRig />
        <ParticleField count={quality.particles} />
        <Specimen detail={quality.detail} />
      </Canvas>
    </div>
  );
}
