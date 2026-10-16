"use client";

import dynamic from "next/dynamic";

// Three.js no se ejecuta en el servidor: el chunk 3D se descarga aparte
// y el HTML de la página se pinta sin esperarlo.
const Experience = dynamic(() => import("./Experience"), { ssr: false });

export function SceneLoader() {
  return <Experience />;
}
