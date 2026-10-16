"use client";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sceneState } from "@/lib/sceneState";

const { damp } = THREE.MathUtils;

/**
 * Parallax de cámara: se desplaza levemente hacia el cursor y mira al
 * origen. Las partículas cercanas se mueven más que las lejanas, lo que
 * produce la sensación de profundidad sin coste extra.
 */
export function CameraRig() {
  useFrame(({ camera }, delta) => {
    const dt = Math.min(delta, 0.1);
    const { pointer, reducedMotion } = sceneState;
    const strength = reducedMotion ? 0.15 : 0.6;

    camera.position.x = damp(camera.position.x, pointer.x * strength, 2, dt);
    camera.position.y = damp(camera.position.y, pointer.y * strength * 0.6, 2, dt);
    camera.lookAt(0, 0, 0);
  });

  return null;
}
