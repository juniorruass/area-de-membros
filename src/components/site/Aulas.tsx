import { useMemo, useRef, useState } from "react";
import type { PublicVideo } from "@/api/public-data";

function youtubeThumb(yt: string) {
  return `https://img.youtube.com/vi/${yt}/hqdefault.jpg`;
}

export function Aulas({ videos }: { videos: PublicVideo[] }) {
  const [current, setCurrent] = useState<PublicVideo | null>(
    videos.find((v) => !v.exclusive) ?? null,
  );
  const [locked, setLocked] = useState<PublicVideo | null>(null);
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
    if (v.exclusive) {
      setLocked(v);
      return;
    }
    setCurrent(v);
    playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollRow = (cat: string, dir: 1 | -1) => {
    rowRefs.current[cat]?.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

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

        {current ? (
          <div
            ref={playerRef}
            className="mt-6 overflow-hidden rounded-3xl border border-line bg-card shadow-soft"
          >
            <div className="aspect-video w-full bg-navy-deep">
              <iframe
                key={current.yt}
                className="h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${current.yt}?modestbranding=1&rel=0&iv_load_policy=3&color=white&autoplay=1`}
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
        ) : null}

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
                      current?.id === v.id ? "border-pink" : "border-line"
                    } bg-card shadow-soft`}
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-navy-deep">
                      <img
                        src={youtubeThumb(v.yt)}
                        alt={v.title}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                      {v.exclusive ? (
                        <span className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                          <span className="flex size-9 items-center justify-center rounded-full bg-white/90 text-lg text-navy shadow-soft">
                            🔒
                          </span>
                          <span className="pill bg-pink text-[10px] text-navy shadow-soft">Exclusivo</span>
                        </span>
                      ) : (
                        <span className="absolute inset-0 flex items-center justify-center bg-navy-deep/20">
                          <span className="flex size-9 items-center justify-center rounded-full bg-white/90 text-lg text-pink shadow-soft">
                            ▶
                          </span>
                        </span>
                      )}
                    </div>
                    <p className="p-2 text-xs font-semibold leading-snug text-ink">{v.title}</p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {locked ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-navy-deep/70 px-5">
          <div className="relative w-full max-w-[380px] overflow-hidden rounded-3xl bg-card p-6 text-center shadow-pop">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-pink" />

            <p className="text-5xl">🔒</p>
            <h3 className="mt-3 font-display text-xl font-black uppercase leading-tight text-navy">
              Conteúdo Exclusivo
            </h3>
            <p className="mt-4 text-sm text-ink">
              Esse conteúdo é exclusivo e ainda não foi liberado no seu acesso.{" "}
              <b className="text-navy">{locked.title}</b>
            </p>

            <a
              href="/exclusivo"
              target="_blank"
              rel="noreferrer"
              className="mt-5 block w-full rounded-2xl bg-pink px-5 py-3 font-display text-sm font-extrabold text-navy shadow-soft transition-transform active:scale-[0.98]"
            >
              🔓 Liberar acesso exclusivo
            </a>

            <button
              type="button"
              onClick={() => setLocked(null)}
              className="mt-4 text-sm font-semibold text-muted-foreground underline"
            >
              Fechar
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
