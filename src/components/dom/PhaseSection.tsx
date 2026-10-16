import type { Phase } from "@/lib/content";

type PhaseSectionProps = {
  phase: Phase;
  index: number;
  total: number;
};

export function PhaseSection({ phase, index, total }: PhaseSectionProps) {
  const alignRight = phase.side === "right";

  return (
    <section
      id={phase.id}
      data-phase
      aria-labelledby={`${phase.id}-title`}
      className={`relative flex min-h-[120svh] items-end px-4 pb-[12svh] sm:px-8 md:items-center md:px-12 md:pb-0 ${
        alignRight ? "md:justify-end md:pr-40" : ""
      }`}
    >
      <div
        data-copy
        className="w-full max-w-xl rounded-2xl bg-abyss/55 p-5 backdrop-blur-md md:w-[42%] md:bg-transparent md:p-0 md:backdrop-blur-none"
      >
        <p data-depth="0.4" className="mb-5 text-sm text-dim">
          {phase.label}, fase {index + 1} de {total}
        </p>
        <h2
          id={`${phase.id}-title`}
          data-depth="1"
          className="font-display text-[clamp(2.6rem,5.6vw,5.25rem)] leading-[0.98] font-light tracking-[-0.03em] text-balance [font-variation-settings:'SOFT'_100,'opsz'_96]"
        >
          {phase.title}
        </h2>
        <p data-depth="0.6" className="mt-6 max-w-[46ch] text-lumen/75">
          {phase.body}
        </p>
      </div>
    </section>
  );
}
