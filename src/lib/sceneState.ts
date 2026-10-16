/**
 * Puente mutable entre el DOM (GSAP / eventos) y la escena WebGL.
 *
 * GSAP escribe aquí los valores "objetivo" y la escena los interpola en
 * useFrame. Al ser un objeto plano (sin estado de React) no provoca
 * re-renderizados: cada frame solo lee números.
 */
export const sceneState = {
  /** Posición objetivo del espécimen en unidades de mundo. */
  x: 0,
  y: 0,
  /** Escala objetivo del espécimen. */
  scale: 1,
  /** Energía 0–1: amplitud de la deformación y agitación de partículas. */
  energy: 0.15,
  /** Desplazamiento de tono de la película iridiscente (0–1). */
  hue: 0,
  /** Rotación extra acumulada por el scroll (radianes). */
  spin: 0,
  /** Puntero normalizado (-1..1), escrito por el listener global. */
  pointer: { x: 0, y: 0 },
  /** Aparición inicial 0–1 animada en la carga. */
  intro: 0,
  /** true si el usuario pidió reducir el movimiento. */
  reducedMotion: false,
};

export type SceneState = typeof sceneState;
