import { useState } from "react";
import { VIDEOS } from "@/data/videos";

export function Aulas() {
  const [current, setCurrent] = useState(0);
  const aula = VIDEOS[current] ?? VIDEOS[0]!;

  return (
    <section id="aulas" className="px-5 py-12">
      <div className="mx-auto max-w-[720px]">
        <div className="text-center">
          <span className="pill bg-pink-soft text-pink-strong">Passo a passo</span>
          <h2 className="mt-4 text-[clamp(28px,6.5vw,42px)] font-black uppercase">
            <span className="text-pink">Videoaulas</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Toque em uma aula para assistir aqui mesmo, no seu ritmo.
          </p>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-line bg-card shadow-soft">
          <div className="aspect-video w-full bg-navy-deep">
            <iframe
              key={aula.yt}
              className="h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${aula.yt}`}
              title={aula.t}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
          <div className="p-4">
            <p className="font-display text-xs font-extrabold uppercase tracking-wider text-pink">
              ▶ Assistindo · Aula {String(current + 1).padStart(2, "0")}
            </p>
            <p className="mt-1 text-sm font-semibold text-navy">{aula.t}</p>
          </div>
        </div>

        <div className="mt-5 max-h-[430px] space-y-2 overflow-y-auto pr-1">
          {VIDEOS.map((v, i) => (
            <button
              key={v.yt}
              type="button"
              onClick={() => setCurrent(i)}
              className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-colors ${
                i === current ? "border-pink bg-pink-soft" : "border-line bg-card"
              }`}
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-navy font-display text-sm font-extrabold text-primary-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-sm font-medium text-ink">{v.t}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
