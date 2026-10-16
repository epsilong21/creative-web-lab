const lines = ["Creative", "Web Lab"];

export function Hero() {
  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      className="relative flex min-h-svh flex-col justify-between px-4 pt-6 pb-8 sm:px-8 md:px-12"
    >
      <header data-intro-fade className="intro-fade flex items-baseline justify-between text-sm text-dim">
        <span className="text-lumen">Creative Web Lab</span>
        <span>Prototipo 0.1</span>
      </header>

      <h1
        id="hero-title"
        className="font-display text-[clamp(4.2rem,15.5vw,15rem)] leading-[0.86] font-light tracking-[-0.045em] text-lumen [font-variation-settings:'SOFT'_100,'opsz'_144]"
      >
        {lines.map((line, i) => (
          // Máscara vertical (overflow-y: clip) que no crea contexto de apilamiento,
          // para que mix-blend-mode siga mezclando con el lienzo WebGL.
          <span key={line} className="block [overflow-x:visible] [overflow-y:clip] pb-[0.06em]">
            <span
              data-intro-line
              data-hero-split
              className={`display-line intro-line ${i === 1 ? "text-right" : ""}`}
            >
              {line}
            </span>
          </span>
        ))}
      </h1>

      <div
        data-hero-meta
        className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
      >
        <p data-intro-fade className="intro-fade max-w-[34ch] text-lg leading-snug text-lumen/85">
          Experimentos de luz, profundidad y movimiento para el navegador.
        </p>
        <div data-intro-fade className="intro-fade flex items-center gap-3 text-sm text-dim">
          <span aria-hidden className="relative block h-10 w-px overflow-hidden bg-haze">
            <span className="scroll-probe absolute inset-0 bg-film-a" />
          </span>
          Desplázate para iniciar el experimento
        </div>
      </div>
    </section>
  );
}
