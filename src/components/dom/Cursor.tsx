"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Cursor propio: punto exacto + anillo con retardo que se expande sobre
 * elementos interactivos. Solo con ratón y movimiento permitido; en
 * pantallas táctiles no se monta nada visible.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const enabled = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    ).matches;
    if (!enabled || !dot.current || !ring.current) return;

    document.documentElement.classList.add("has-cursor");
    gsap.set([dot.current, ring.current], { autoAlpha: 0 });

    const dotX = gsap.quickTo(dot.current, "x", { duration: 0.08, ease: "power3" });
    const dotY = gsap.quickTo(dot.current, "y", { duration: 0.08, ease: "power3" });
    const ringX = gsap.quickTo(ring.current, "x", { duration: 0.5, ease: "power3" });
    const ringY = gsap.quickTo(ring.current, "y", { duration: 0.5, ease: "power3" });

    let visible = false;
    const onMove = (e: PointerEvent) => {
      if (!visible) {
        visible = true;
        gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY });
        gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.3 });
      }
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };
    const onOver = (e: PointerEvent) => {
      const interactive = (e.target as Element).closest("a, button");
      ring.current!.dataset.active = String(Boolean(interactive));
    };
    const onLeaveWindow = () => {
      visible = false;
      gsap.to([dot.current, ring.current], { autoAlpha: 0, duration: 0.3 });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.documentElement.addEventListener("pointerleave", onLeaveWindow);

    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
    };
  });

  return (
    <>
      <div ref={ring} aria-hidden className="cursor-ring invisible" />
      <div ref={dot} aria-hidden className="cursor-dot invisible" />
    </>
  );
}
