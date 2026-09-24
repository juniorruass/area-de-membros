import { useMemo, useRef, useState } from "react";
import type { PublicVideo } from "@/api/public-data";

function youtubeThumb(yt: string) {
  return `https://img.youtube.com/vi/${yt}/hqdefault.jpg`;
}

export function Aulas({ videos }: { videos: PublicVideo[] }) {
  const [current, setCurrent] = useState<PublicVideo | null>(videos[0] ?? null);
  const playerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const groups = useMemo(() => {
    const map = new Map<string, PublicVideo[]>();
    for (const v of videos) {
      const key = v.cat || "Aulas";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(v);
    }
    return Array.from(map.entries());
  }, [videos]);

  const select = (v: PublicVideo) => {
    setCurrent(v);
    playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollRow = (cat: string, dir: 1 | -1) => {
    rowRefs.current[cat]?.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  if (!current) return null;

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

        <div
          ref={playerRef}
          className="mt-6 overflow-hidden rounded-3xl border border-line bg-card shadow-soft"
        >
          <div className="aspect-video w-full bg-navy-deep">
            <iframe
              key={current.yt}
              className="h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${current.yt}?modestbranding=1&rel=0&iv_load_policy=3&color=white`}
              title={current.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
          <div className="p-4">
            <p className="font-display text-xs font-extrabold uppercase tracking-wider text-pink">
              ▶ Assistindo · {current.cat}
            </p>
            <p className="mt-1 text-sm font-semibold text-navy">{current.title}</p>
          </div>
        </div>

        <div className="mt-8 space-y-8">
          {groups.map(([cat, list]) => (
            <div key={cat}>
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-extrabold uppercase text-navy">{cat}</h3>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    aria-label="Anterior"
                    onClick={() => scrollRow(cat, -1)}
                    className="flex size-8 items-center justify-center rounded-full border border-line bg-card text-navy"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    aria-label="Próximo"
                    onClick={() => scrollRow(cat, 1)}
                    className="flex size-8 items-center justify-center rounded-full border border-line bg-card text-navy"
                  >
                    ›
                  </button>
                </div>
              </div>

              <div
                ref={(el) => {
                  rowRefs.current[cat] = el;
                }}
                className="mt-3 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {list.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => select(v)}
                    className={`w-[150px] shrink-0 overflow-hidden rounded-2xl border text-left transition-colors ${
                      current.id === v.id ? "border-pink" : "border-line"
                    } bg-card shadow-soft`}
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-navy-deep">
                      <img
                        src={youtubeThumb(v.yt)}
                        alt={v.title}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute inset-0 flex items-center justify-center bg-navy-deep/20">
                        <span className="flex size-9 items-center justify-center rounded-full bg-white/90 text-lg text-pink shadow-soft">
                          ▶
                        </span>
                      </span>
                    </div>
                    <p className="p-2 text-xs font-semibold leading-snug text-ink">{v.title}</p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
