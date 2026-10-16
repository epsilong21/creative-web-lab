import { SceneLoader } from "@/components/canvas/SceneLoader";
import { Choreography } from "@/components/dom/Choreography";
import { Cursor } from "@/components/dom/Cursor";
import { Finale } from "@/components/dom/Finale";
import { Hero } from "@/components/dom/Hero";
import { PhaseSection } from "@/components/dom/PhaseSection";
import { ProgressRail } from "@/components/dom/ProgressRail";
import { phases } from "@/lib/content";

export default function Home() {
  return (
    <>
      <div aria-hidden className="atmosphere" />
      <SceneLoader />
      <div aria-hidden className="grain" />

      {/* Antes de <main> en el DOM para que el orden de tabulación siga la página;
          visualmente es fijo y no cambia de sitio. */}
      <ProgressRail />

      <Choreography>
        <Hero />
        {phases.map((phase, i) => (
          <PhaseSection key={phase.id} phase={phase} index={i} total={phases.length} />
        ))}
        <Finale />
      </Choreography>

      <Cursor />
    </>
  );
}
