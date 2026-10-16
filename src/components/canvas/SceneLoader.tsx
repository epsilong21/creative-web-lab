"use client";

import { Component, useSyncExternalStore, type ReactNode } from "react";
import dynamic from "next/dynamic";

// Three.js no se ejecuta en el servidor: el chunk 3D se descarga aparte
// y el HTML de la página se pinta sin esperarlo.
const Experience = dynamic(() => import("./Experience"), { ssr: false });

let webglSupport: boolean | undefined;

function hasWebGL() {
  if (webglSupport === undefined) {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
      webglSupport = !!gl;
      // Libera el contexto de prueba: el navegador limita los contextos activos.
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}

const noop = () => () => {};

/**
 * Si la escena falla (contexto WebGL perdido, driver bloqueado…) se retira
 * solo el lienzo; el halo de .atmosphere sigue detrás como fondo.
 */
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("Escena 3D desactivada:", error);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function SceneLoader() {
  // Sin WebGL ni siquiera se descarga el chunk 3D.
  const supported = useSyncExternalStore(noop, hasWebGL, () => false);
  if (!supported) return null;

  return (
    <SceneBoundary>
      <Experience />
    </SceneBoundary>
  );
}
