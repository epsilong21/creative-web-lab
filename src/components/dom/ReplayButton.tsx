"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Botón magnético: se desplaza hacia el cursor dentro de su zona y
 * vuelve a su sitio con un rebote suave al salir.
 */
export function ReplayButton() {
  const ref = useRef<HTMLButtonElement>(null);

  const onMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    gsap.to(ref.current, {
      x: (e.clientX - (r.left + r.width / 2)) * 0.3,
      y: (e.clientY - (r.top + r.height / 2)) * 0.4,
      duration: 0.4,
      ease: "power3.out",
    });
  };

  const onLeave = () => {
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.45)" });
  };

  const replay = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={replay}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="group relative rounded-full border border-lumen/25 px-8 py-4 text-base text-lumen transition-colors duration-500 hover:border-film-a hover:bg-film-a hover:text-abyss"
    >
      Repetir el experimento
    </button>
  );
}
