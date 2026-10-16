"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { sceneState } from "@/lib/sceneState";
import { stages, type SceneTarget } from "@/lib/content";

/** Solo las propiedades numéricas que GSAP interpola sobre sceneState. */
function sceneValues({ x, y, scale, energy, hue, spin }: SceneTarget) {
  return { x, y, scale, energy, hue, spin };
}

/**
 * Orquesta todo el movimiento de la página:
 *  1. Secuencia de entrada (una sola, al cargar).
 *  2. Estados de escena por sección, enlazados al scroll (scrub).
 *  3. Parallax de los textos por capas de profundidad.
 */
export function Choreography({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      sceneState.reducedMotion = reduce;
      const atmosphere = document.querySelector<HTMLElement>(".atmosphere");

      // 1 · Entrada ------------------------------------------------------
      if (reduce) {
        sceneState.intro = 1;
        gsap.set("[data-intro-line]", { y: 0 });
        gsap.set("[data-intro-fade]", { autoAlpha: 1 });
      } else {
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .to(sceneState, { intro: 1, duration: 2.6, ease: "power2.out" }, 0)
          .to("[data-intro-line]", { y: 0, duration: 1.8, stagger: 0.14 }, 0.15)
          .to("[data-intro-fade]", { autoAlpha: 1, duration: 1.4, stagger: 0.12 }, 0.9);
      }

      // 2 · Estados de escena por sección --------------------------------
      const mm = gsap.matchMedia();
      mm.add(
        { desktop: "(min-width: 769px)", mobile: "(max-width: 768px)" },
        (ctx) => {
          const key = ctx.conditions?.desktop ? "desktop" : "mobile";
          Object.assign(sceneState, sceneValues(stages[0][key]));
          if (atmosphere) gsap.set(atmosphere, { "--tint": stages[0][key].tint });

          // Cada sección interpola desde el estado anterior mientras entra
          // en pantalla. Los rangos no se solapan: secciones ≥ 100svh.
          stages.slice(1).forEach((stage, i) => {
            const section = document.getElementById(stage.id);
            if (!section) return;
            const from = stages[i][key];
            const to = stage[key];
            const scrollTrigger = {
              trigger: section,
              start: "top bottom",
              end: "top top",
              scrub: true,
            };

            gsap.fromTo(sceneState, sceneValues(from), {
              ...sceneValues(to),
              ease: "power1.inOut",
              immediateRender: false,
              scrollTrigger,
            });
            if (atmosphere) {
              gsap.fromTo(
                atmosphere,
                { "--tint": from.tint },
                { "--tint": to.tint, ease: "none", immediateRender: false, scrollTrigger },
              );
            }
          });
        },
      );

      // 3 · Salida del hero: las dos líneas del titular se separan -------
      const heroLines = gsap.utils.toArray<HTMLElement>("[data-hero-split]");
      gsap
        .timeline({
          scrollTrigger: { trigger: "#inicio", start: "top top", end: "bottom top", scrub: 0.6 },
        })
        .to(heroLines, {
          xPercent: (i) => (reduce ? 0 : i === 0 ? -14 : 14),
          autoAlpha: 0,
          ease: "power1.in",
        })
        .to("[data-hero-meta]", { autoAlpha: 0, ease: "none" }, 0);

      // 4 · Parallax de los textos de cada fase --------------------------
      gsap.utils.toArray<HTMLElement>("[data-phase]").forEach((section) => {
        const copy = section.querySelector("[data-copy]");
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 0.6 },
        });
        tl.fromTo(copy, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.05).to(
          copy,
          { autoAlpha: 0, duration: 0.25 },
          0.72,
        );
        if (reduce) return;
        section.querySelectorAll<HTMLElement>("[data-depth]").forEach((layer) => {
          const depth = Number(layer.dataset.depth ?? 1);
          tl.fromTo(layer, { y: 140 * depth }, { y: -140 * depth, duration: 1 }, 0);
        });
      });
    },
    { scope: root },
  );

  return <main ref={root}>{children}</main>;
}
