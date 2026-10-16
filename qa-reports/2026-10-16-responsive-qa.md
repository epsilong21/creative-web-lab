# QA responsive — CREATIVE-WEB-LAB

- Fecha: 2026-10-16
- Commit base: fa14a9f (main) + correcciones de esta auditoría (sin commitear)
- Entorno: build de producción (`next build`, export estático) servido en `localhost` · Chrome (Chrome DevTools MCP 1.11.0)
- Herramientas: Playwright MCP — (configurado en `.mcp.json`, pendiente de aprobación hasta reiniciar sesión) · Chrome DevTools MCP ✅
- Rutas probadas: `/`
- Dispositivos: 320×568, 390×844, 844×390, 768×1024, 1024×768 (táctil) · 1280×800, 1440×900, 1920×1080

## Resumen

CRITICAL 1 · HIGH 1 · MEDIUM 4 · LOW 3 — los CRITICAL/HIGH están corregidos y verificados; quedan mejoras menores.

## Comprobaciones estáticas

lint ✅ · typecheck (`tsc --noEmit`) ✅ · build ✅ · tests — (el proyecto no tiene)

Repetidas tras las correcciones: lint ✅ · typecheck ✅ · build ✅

## Resultados por viewport

| Viewport | Overflow | Táctil | Consola | Visual |
|---|---|---|---|---|
| 320×568 | ✅ ¹ | ✅ | ⚠️ QA-6 | ✅ |
| 390×844 | ✅ ¹ | ✅ | ⚠️ QA-6 | ✅ |
| 844×390 | ✅ ¹ | ⚠️ QA-3 | ⚠️ QA-6 | ✅ |
| 768×1024 | ✅ ¹ | ⚠️ QA-3 | ⚠️ QA-6 | ✅ |
| 1024×768 | ✅ ¹ | ⚠️ QA-3 | ⚠️ QA-6 | ✅ |
| 1280×800 | ✅ ¹ | — (no táctil) | ⚠️ QA-6 | ✅ (QA-8) |
| 1440×900 | ✅ ¹ | — (no táctil) | ⚠️ QA-6 | ✅ |
| 1920×1080 | ✅ ¹ | — (no táctil) | ⚠️ QA-6 | ✅ ² |

¹ Durante la salida del hero las dos líneas del titular se separan (`xPercent ±14`) y sobresalen del viewport,
pero `body { overflow-x: hidden }` las recorta: `scrollX` permanece en 0 y `visualViewport.scale` en 1 en todos
los tamaños. Ver QA-7.

² La primera captura a 1920 salió con la entrada a medias: la ventana de Chrome de pruebas estaba ocluida y el
navegador limitaba `requestAnimationFrame` a ~1 fps (también sin el lienzo). Traída al frente: 144 fps. Artefacto
del entorno, no de la web.

## Interacciones, movimiento reducido y fallbacks

- Navegación (ProgressRail, 1440×900): enlace "Resultado" → desplaza al final, `aria-current` correcto ✅.
- Botón "Repetir el experimento": vuelve a `scrollY = 0`, el titular reaparece ✅.
- Teclado: foco visible (outline cian) en todos los controles, sin trampas ✅. Orden de foco mejorable (QA-4).
- Formularios: — (la página no tiene).
- Menú móvil: — (no existe; en móvil el ProgressRail está oculto y la navegación es por scroll).
- `prefers-reduced-motion: reduce` ✅: sin animación de entrada, sin parallax (`transform: none`), indicador de
  scroll detenido, `scroll-behavior: auto`; todo el contenido visible.
- Sin WebGL: ❌ página rota antes de corregir (QA-1) → ✅ tras la corrección: se muestra el degradado
  `.atmosphere` y todo el contenido, sin errores en consola.
- Móvil con CPU 4×: LCP 1,57 s, CLS 0,00; lienzo limitado a `dpr` 1,5 (585×1266 px a 390 de ancho).

## Lighthouse (no se exigen 100)

| | Perf | A11y | BP | SEO | LCP | CLS |
|---|---|---|---|---|---|---|
| Móvil | — ³ | 100 | 100 | 100 | 1,57 s (CPU 4×) | 0,00 |
| Escritorio | — ³ | 100 | 100 | 100 | — | — |

³ La auditoría Lighthouse de Chrome DevTools MCP no incluye la categoría Performance; las métricas vienen de una
traza de rendimiento (`performance_start_trace`) en móvil con CPU 4×.

## Problemas

| ID | Severidad | Descripción | Viewport/ruta | Estado |
|---|---|---|---|---|
| QA-1 | CRITICAL | Sin WebGL (aceleración por hardware desactivada, drivers bloqueados, navegadores antiguos) `THREE.WebGLRenderer` lanzaba una excepción no capturada y toda la página caía en la pantalla de error de Next ("This page couldn't load"). | todos / | Corregido: `SceneLoader` comprueba WebGL antes de cargar el chunk 3D y envuelve la escena en un error boundary; si falla se retira solo el lienzo. Verificado simulando `getContext('webgl') → null`. |
| QA-2 | HIGH | Las animaciones de scroll usaban `autoAlpha` (→ `visibility: hidden`): los textos de las fases, el cierre y el botón no estaban en el árbol de accesibilidad salvo cuando la sección estaba en vista. Un lector de pantalla no podía navegar por encabezados ni llegar al contenido. | todos / | Corregido: los tramos enlazados al scroll animan `opacity`. Aspecto idéntico; verificado en el snapshot de accesibilidad (4 `h2`, textos y botón presentes). |
| QA-3 | MEDIUM | Enlaces del ProgressRail de 28 px de alto en dispositivos táctiles (≥ 24 px mínimo WCAG, < 44 px recomendado). | 844×390, 768×1024, 1024×768 / | Pendiente |
| QA-4 | MEDIUM | Orden de foco: el primer Tab va a "Repetir el experimento" (final de la página) y después a la navegación, porque `<ProgressRail />` está después de `<main>` en el DOM. Moverlo antes no cambia el aspecto (es `position: fixed`). | escritorio / | Pendiente |
| QA-5 | MEDIUM | LCP limitado por la animación de entrada (render delay ~1,5 s con CPU 4×): el elemento LCP no se pinta hasta que termina el fade. Dentro del objetivo (< 2,5 s). | móvil / | Pendiente (aceptable) |
| QA-6 | MEDIUM | Aviso en consola `THREE.Clock: This module has been deprecated`. Procede de `@react-three/fiber`, no del código del proyecto. | todos / | Pendiente (esperar actualización de R3F) |
| QA-7 | LOW | El recorte horizontal depende de `body { overflow-x: hidden }`. `html { overflow-x: clip }` sería más robusto en navegadores móviles antiguos. | móvil / | Pendiente |
| QA-8 | LOW | A 1280 px las marcas del ProgressRail quedan muy cerca de "Lab" en el titular (sin solaparse). | 1280×800 / | Pendiente |
| QA-9 | LOW | Los textos dicen "Mueve el cursor" / "Inclina el objeto con el cursor"; en táctil no hay cursor. | táctil / | Pendiente (contenido) |

## Pendiente / no verificado

- Pruebas con Playwright MCP: no disponible en esta sesión (configurado; requiere reiniciar Claude Code y aprobar el servidor).
- Dispositivos reales (iOS Safari, Android Chrome): no probados; solo emulación en Chrome.
- Puntuación Lighthouse de Performance: no disponible en la herramienta usada.
- Despliegue en GitHub Pages (`PAGES_BASE_PATH`): no auditado; solo el build local.
