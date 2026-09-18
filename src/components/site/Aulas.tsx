import { useEffect, useMemo, useState } from "react";
import type { PublicVideo } from "@/api/public-data";

export function Aulas({ videos }: { videos: PublicVideo[] }) {
  const cats = useMemo(() => ["Todos", ...Array.from(new Set(videos.map((v) => v.cat)))], [videos]);
  const [cat, setCat] = useState("Todos");
  const [current, setCurrent] = useState(0);

  const list = useMemo(
    () => videos.filter((v) => (cat === "Todos" ? true : v.cat === cat)),
    [videos, cat],
  );

  useEffect(() => {
    setCurrent(0);
  }, [cat]);

  const aula = list[current] ?? list[0];

  if (!aula) return null;

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

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {cats.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={`pill border transition-colors ${
                cat === c
                  ? "border-navy bg-navy text-primary-foreground"
                  : "border-line bg-card text-navy"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-line bg-card shadow-soft">
          <div className="aspect-video w-full bg-navy-deep">
            <iframe
              key={aula.yt}
              className="h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${aula.yt}`}
              title={aula.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
          <div className="p-4">
            <p className="font-display text-xs font-extrabold uppercase tracking-wider text-pink">
              ▶ Assistindo · Aula {String(current + 1).padStart(2, "0")}
            </p>
            <p className="mt-1 text-sm font-semibold text-navy">{aula.title}</p>
          </div>
        </div>

        <div className="mt-5 max-h-[430px] space-y-2 overflow-y-auto pr-1">
          {list.map((v, i) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setCurrent(i)}
              className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-colors ${
                i === current ? "border-pink bg-pink-soft" : "border-line bg-card"
              }`}
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-navy font-display text-sm font-extrabold text-primary-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-sm font-medium text-ink">{v.title}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
