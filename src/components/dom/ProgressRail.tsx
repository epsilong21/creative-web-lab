"use client";

import { useState } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { stages } from "@/lib/content";

/** Índice lateral: muestra en qué fase estás y permite saltar a otra. */
export function ProgressRail() {
  const [active, setActive] = useState(stages[0].id);

  useGSAP(() => {
    stages.forEach((stage) => {
      ScrollTrigger.create({
        trigger: `#${stage.id}`,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => self.isActive && setActive(stage.id),
      });
    });
  });

  return (
    <nav
      aria-label="Fases del experimento"
      className="fixed top-1/2 right-6 z-40 hidden -translate-y-1/2 md:block"
    >
      <ol className="flex flex-col items-end gap-4">
        {stages.map((stage) => {
          const isActive = stage.id === active;
          return (
            <li key={stage.id}>
              <a
                href={`#${stage.id}`}
                aria-current={isActive ? "step" : undefined}
                className="group flex items-center gap-3 py-1 text-sm"
              >
                <span
                  className={`transition-all duration-500 ${
                    isActive
                      ? "translate-x-0 text-lumen opacity-100"
                      : "translate-x-2 text-dim opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                  }`}
                >
                  {stage.label}
                </span>
                <span
                  aria-hidden
                  className={`block h-px transition-all duration-500 ${
                    isActive ? "w-10 bg-film-a" : "w-4 bg-dim/60 group-hover:w-6"
                  }`}
                />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
