# QA responsive — CREATIVE-WEB-LAB (fase 2)

- Fecha: 2026-10-16
- Commit base: fa14a9f (main) + correcciones de la fase 1 y de esta fase
- Informe anterior: [2026-10-16-responsive-qa.md](2026-10-16-responsive-qa.md)
- Entorno: build de producción (`next build`, Turbopack, export estático) servido en `localhost` · Chrome (Chrome DevTools MCP 1.11.0)
- Herramientas: Playwright MCP — (configurado en `.mcp.json`; el servidor sigue pendiente de aprobación y no hay herramientas `mcp__playwright__*` en la sesión) · Chrome DevTools MCP ✅
- Rutas probadas: `/`
- Dispositivos: 320×568, 390×844, 844×390, 768×1024, 1024×768 (táctil) · 1280×800, 1440×900, 1920×1080

## Resumen

CRITICAL 0 · HIGH 0 · MEDIUM 1 · LOW 0 — se cierran QA-3, QA-4, QA-5, QA-7, QA-8 y QA-9; queda QA-6 (aviso de una
dependencia externa, sin acción posible en el proyecto).

## Comprobaciones estáticas

lint ✅ · typecheck (`tsc --noEmit`) ✅ · build ✅ (también con la caché `.next` borrada) · tests — (el proyecto no tiene)

## Resultados por viewport (build final)

| Viewport | Overflow | Áreas táctiles (rail) | Texto según puntero | Consola | Visual |
|---|---|---|---|---|---|
| 320×568 | ✅ | — (rail oculto < 768) | táctil ✅ | ⚠️ QA-6 | ✅ |
| 390×844 | ✅ | — (rail oculto < 768) | táctil ✅ | ⚠️ QA-6 | ✅ |
| 844×390 | ✅ | ✅ 5 × 44 px de alto | táctil ✅ | ⚠️ QA-6 | ✅ |
| 768×1024 | ✅ | ✅ 5 × 44 px | táctil ✅ | ⚠️ QA-6 | ✅ |
| 1024×768 | ✅ | ✅ 5 × 44 px | táctil ✅ | ⚠️ QA-6 | ✅ |
| 1280×800 | ✅ | ✅ 5 × 44 px | ratón ✅ | ⚠️ QA-6 | ✅ |
| 1440×900 | ✅ | ✅ 5 × 44 px | ratón ✅ | ⚠️ QA-6 | ✅ |
| 1920×1080 | ✅ | ✅ 5 × 44 px | ratón ✅ | ⚠️ QA-6 | ✅ |

Overflow: `scrollX` permanece en 0 y `visualViewport.scale` en 1 en todos los tamaños, también a mitad de la salida
del hero (cuando las líneas del titular sobresalen); `html` usa `overflow-x: clip` (con `hidden` de respaldo vía
`@supports`). El scroll vertical sigue funcionando (`document.scrollingElement` = `html`).

## Interacciones, teclado, movimiento reducido y fallbacks

- Orden de Tab (1440×900): Inicio → Suspensión → Agitación → Refracción → Resultado → "Repetir el experimento" ✅,
  foco visible (outline 1px cian) en todos.
- Enter en el enlace "Agitación" → `#agitacion`, sección arriba del todo, `aria-current` actualizado ✅.
- Enter en "Repetir el experimento" → `scrollY = 0`, `aria-current` = Inicio ✅.
- Salida del hero al hacer scroll: líneas separadas ±12,5 px y opacidad 0,75 a mitad, vuelven a 0 al subir ✅
  (comprueba que el `translate` de la entrada CSS no interfiere con el `transform` de GSAP).
- `prefers-reduced-motion: reduce` ✅: desde el primer fotograma los textos están visibles y sin animaciones CSS,
  sin parallax, sin separación del titular, indicador de scroll detenido, `scroll-behavior: auto`.
- Sin WebGL (`getContext('webgl') → null`) ✅: sin lienzo, 4 `h2` visibles, sin errores en consola.
- Accesibilidad: un `h1` y cuatro `h2` en todos los tamaños; solo una variante del texto de cada fase es visible
  (la otra con `display: none`, fuera del árbol de accesibilidad).

## Rendimiento: entrada del hero (QA-5)

Medido en 390×844 con CPU 4× más lenta, mediana de 5 cargas, ambos builds con la caché `.next` borrada y el CSS
compilado verificado. "Frase visible" = primer fotograma en que el texto del hero supera opacidad 0,1.

| Versión | Frase visible | LCP | CLS |
|---|---|---|---|
| Original (`HEAD`, entrada con GSAP tras la hidratación) | 2571 ms | 2568 ms | 0 |
| Final (entrada de textos con CSS desde el primer pintado) | **786 ms** | **1640 ms** | 0 |

Probé antes una variante intermedia (mismo GSAP, fades a 0,45 s en vez de 0,9 s): frase visible 1949 ms, LCP 1944 ms.
Chrome registra el LCP de un texto con opacidad animada en el compositor al terminar la animación, por eso el fade
de la frase dura 0,8 s (antes 1,4 s); el efecto (subida del titular + fundido) se mantiene.

Nota de método: una primera comparación salió contaminada (la caché de Turbopack reutilizó el CSS de otro build);
se descartó y se repitió con `.next` borrado y verificando el CSS de cada build.

## Lighthouse (no se exigen 100)

| | Perf | A11y | BP | SEO |
|---|---|---|---|---|
| Móvil | — ¹ | 100 | 100 | 100 |
| Escritorio | — ¹ | 100 | 100 | 100 |

¹ La auditoría Lighthouse de Chrome DevTools MCP no incluye Performance; ver la tabla de rendimiento anterior.

## Problemas

| ID | Severidad | Descripción | Estado |
|---|---|---|---|
| QA-1 | CRITICAL | Sin WebGL la página entera caía en la pantalla de error. | Corregido (fase 1); re-verificado ✅ |
| QA-2 | HIGH | `autoAlpha` sacaba los textos del árbol de accesibilidad. | Corregido (fase 1); re-verificado ✅ |
| QA-3 | MEDIUM | Enlaces del ProgressRail de 28 px de alto en táctil. | **Corregido**: `min-h-11 min-w-11` (≥ 44×44 px) y sin `gap`; el ritmo vertical es el mismo (44 px por enlace). |
| QA-4 | MEDIUM | El primer Tab saltaba al botón final antes que a la navegación. | **Corregido**: `<ProgressRail />` va antes de `<main>` en el DOM (es `position: fixed`, no cambia de sitio). |
| QA-5 | MEDIUM | La entrada retrasaba el texto principal (dependía de la hidratación). | **Corregido**: entrada de los textos con `@keyframes` CSS; frase visible −1,8 s y LCP −0,9 s con CPU 4×. |
| QA-6 | MEDIUM | Aviso `THREE.Clock: This module has been deprecated`. | **Permanece (externo)**: `@react-three/fiber` 9.8.2 (última estable) crea `new THREE.Clock()` en su store y three 0.186 lo marca obsoleto desde r183. El proyecto no usa `clock`. Solo lo resuelve R3F v10 (alpha). Sin cambios en dependencias. |
| QA-7 | LOW | El recorte horizontal dependía de `body { overflow-x: hidden }`. | **Corregido**: `html { overflow-x: clip }` con `hidden` de respaldo (`@supports`); se quitó de `body`. |
| QA-8 | LOW | Marcas del rail muy cerca de "Lab" a 1280 px. | **Corregido**: `md:pr-16` en el titular; hueco de 39–48 px en todos los tamaños con rail. |
| QA-9 | LOW | "Mueve el cursor" / "con el cursor" en pantallas táctiles. | **Corregido**: variante `touchBody` en las fases 1 y 3, mostrada con `(hover: none), (pointer: coarse), (pointer: none)`. |

## Pendiente / no verificado

- Pruebas con Playwright MCP: no ejecutadas. El servidor está en `.mcp.json`, pero sus herramientas solo aparecen al
  reiniciar Claude Code en el proyecto y aprobarlo.
- Dispositivos reales (iOS Safari, Android Chrome): no probados; solo emulación en Chrome.
- Puntuación Lighthouse de Performance: no disponible en la herramienta usada.
- Despliegue en GitHub Pages (`PAGES_BASE_PATH`): no auditado; solo el build local.
