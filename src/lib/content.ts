/**
 * Contenido y "estados" de escena por sección. Cada sección declara
 * dónde debe estar el espécimen y cuánta energía tiene; la coreografía
 * de scroll interpola entre un estado y el siguiente.
 */
export type SceneTarget = {
  x: number;
  y: number;
  scale: number;
  energy: number;
  hue: number;
  spin: number;
  /** Color del halo de fondo. */
  tint: string;
};

export type Stage = {
  id: string;
  label: string;
  desktop: SceneTarget;
  mobile: SceneTarget;
};

export type Phase = Stage & {
  title: string;
  body: string;
  /** Variante para pantallas táctiles cuando `body` habla del cursor. */
  touchBody?: string;
  /** Lado del texto en escritorio; el espécimen ocupa el opuesto. */
  side: "left" | "right";
};

export const heroStage: Stage = {
  id: "inicio",
  label: "Inicio",
  desktop: { x: 0, y: 0, scale: 1, energy: 0.15, hue: 0, spin: 0, tint: "#1b2050" },
  mobile: { x: 0, y: 0.35, scale: 0.55, energy: 0.15, hue: 0, spin: 0, tint: "#1b2050" },
};

export const phases: Phase[] = [
  {
    id: "suspension",
    label: "Suspensión",
    title: "Polvo en un haz de luz",
    body: "Miles de partículas flotan a distintas profundidades. Mueve el cursor: lo cercano se desplaza más que lo lejano, y el espacio aparece.",
    touchBody:
      "Miles de partículas flotan a distintas profundidades. Al desplazarte, lo cercano se mueve más que lo lejano, y el espacio aparece.",
    side: "left",
    desktop: { x: 1.7, y: 0, scale: 0.9, energy: 0.25, hue: 0.12, spin: 1.2, tint: "#15244d" },
    mobile: { x: 0, y: 1.05, scale: 0.6, energy: 0.25, hue: 0.12, spin: 1.2, tint: "#15244d" },
  },
  {
    id: "agitacion",
    label: "Agitación",
    title: "La superficie responde al scroll",
    body: "Cuanto más avanzas, más energía recibe el espécimen. Su forma se deforma en tiempo real con ruido calculado en la GPU, sin modelos ni texturas.",
    side: "right",
    desktop: { x: -1.7, y: 0, scale: 0.95, energy: 0.9, hue: 0.38, spin: 2.6, tint: "#251a4f" },
    mobile: { x: 0, y: 1.05, scale: 0.6, energy: 0.9, hue: 0.38, spin: 2.6, tint: "#251a4f" },
  },
  {
    id: "refraccion",
    label: "Refracción",
    title: "Ningún color es fijo",
    body: "La película iridiscente cambia de tono según el ángulo desde el que la miras. Inclina el objeto con el cursor y verás aparecer cian, lila y cobre.",
    touchBody:
      "La película iridiscente cambia de tono según el ángulo desde el que la miras. Sigue desplazándote: el objeto gira y verás aparecer cian, lila y cobre.",
    side: "left",
    desktop: { x: 1.55, y: 0.05, scale: 0.98, energy: 0.45, hue: 0.72, spin: 3.8, tint: "#2b1f3a" },
    mobile: { x: 0, y: 1.05, scale: 0.7, energy: 0.45, hue: 0.72, spin: 3.8, tint: "#2b1f3a" },
  },
];

export const finaleStage: Stage = {
  id: "resultado",
  label: "Resultado",
  desktop: { x: 0, y: 1.05, scale: 0.5, energy: 0.2, hue: 1, spin: 5.2, tint: "#1b2050" },
  mobile: { x: 0, y: 1.25, scale: 0.45, energy: 0.2, hue: 1, spin: 5.2, tint: "#1b2050" },
};

export const stages: Stage[] = [heroStage, ...phases, finaleStage];
