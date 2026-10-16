# Creative Web Lab

Landing experimental: un espécimen iridiscente generado en GPU, partículas con profundidad
y una coreografía de scroll en cuatro fases (suspensión, agitación, refracción, resultado).

**Stack:** Next.js 16 · TypeScript · Tailwind CSS 4 · React Three Fiber · GSAP + ScrollTrigger

## Empezar

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script          | Qué hace                               |
| --------------- | -------------------------------------- |
| `npm run dev`   | Servidor de desarrollo con recarga     |
| `npm run build` | Build de producción (incluye TypeScript) |
| `npm run start` | Sirve la build de producción           |
| `npm run lint`  | ESLint (incluye reglas del React Compiler) |

## Arquitectura

```
src/
├─ app/                    layout (fuentes, metadatos), página y tokens CSS
├─ lib/
│  ├─ content.ts           textos + estado de escena de cada sección
│  ├─ sceneState.ts        puente mutable DOM → WebGL (sin re-renders)
│  └─ gsap.ts              registro único de plugins
└─ components/
   ├─ canvas/              todo lo 3D (solo cliente, chunk aparte)
   │  ├─ SceneLoader.tsx   next/dynamic con ssr:false
   │  ├─ Experience.tsx    <Canvas>, calidad según dispositivo, puntero
   │  ├─ Specimen.tsx      objeto central (shader propio)
   │  ├─ ParticleField.tsx partículas (deriva en el vertex shader)
   │  ├─ CameraRig.tsx     parallax de cámara con el cursor
   │  └─ shaders/          GLSL
   └─ dom/                 interfaz HTML
      ├─ Choreography.tsx  entrada + ScrollTrigger + parallax de textos
      ├─ Hero / PhaseSection / Finale
      ├─ ProgressRail.tsx  índice lateral de fases
      ├─ Cursor.tsx        cursor propio (solo ratón)
      └─ ReplayButton.tsx  botón magnético
```

**Flujo de datos:** GSAP escribe valores objetivo en `sceneState` según el scroll; los
componentes 3D los leen en `useFrame` y los amortiguan con `MathUtils.damp`. React no
re-renderiza durante el scroll.

**Añadir una sección:** agrega un objeto a `phases` en `src/lib/content.ts` con su texto y
su estado de escena (`desktop` / `mobile`). La coreografía lo recoge automáticamente.

## Rendimiento y accesibilidad

- Sin modelos ni texturas: geometría y color se calculan en shaders.
- Calidad adaptativa: menos partículas, menos subdivisiones y DPR limitado en móvil.
- `prefers-reduced-motion`: sin secuencia de entrada, sin parallax, sin cursor propio.
- El lienzo es `aria-hidden` y no captura eventos; el contenido es HTML navegable.
