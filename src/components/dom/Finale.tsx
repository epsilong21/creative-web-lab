import { ReplayButton } from "./ReplayButton";

export function Finale() {
  return (
    <section
      id="resultado"
      data-phase
      aria-labelledby="resultado-title"
      className="relative flex min-h-svh flex-col justify-end px-4 pb-8 sm:px-8 md:px-12"
    >
      <div data-copy className="mx-auto mb-[14svh] flex max-w-3xl flex-col items-center text-center">
        <h2
          id="resultado-title"
          data-depth="0.8"
          className="font-display text-[clamp(2.6rem,6vw,5.75rem)] leading-[0.98] font-light tracking-[-0.03em] text-balance [font-variation-settings:'SOFT'_100,'opsz'_96]"
        >
          Un laboratorio para lo que aún no tiene nombre
        </h2>
        <p data-depth="0.5" className="mt-6 max-w-[52ch] text-lumen/75">
          Todo lo que has visto se genera en código: sin modelos, sin texturas, sin vídeo. Es la
          base sobre la que crecerán los próximos experimentos.
        </p>
        <div data-depth="0.3" className="mt-10">
          <ReplayButton />
        </div>
      </div>

      <footer className="flex flex-col gap-1 text-sm text-dim sm:flex-row sm:justify-between">
        <span>Creative Web Lab, prototipo 0.1</span>
        <span>Next.js, React Three Fiber y GSAP</span>
      </footer>
    </section>
  );
}
