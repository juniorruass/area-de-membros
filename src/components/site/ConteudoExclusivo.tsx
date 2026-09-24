import { materiaisUrl } from "@/lib/storage-url";
import type { PublicExclusivePreview } from "@/api/public-data";

function youtubeThumb(yt: string) {
  return `https://img.youtube.com/vi/${yt}/hqdefault.jpg`;
}

export function ConteudoExclusivo({ preview }: { preview: PublicExclusivePreview[] }) {
  const track = preview.length > 0 ? [...preview, ...preview] : [];
  const duration = Math.max(18, preview.length * 5);

  return (
    <section className="px-5 py-10">
      <div className="mx-auto max-w-[720px]">
        <div className="overflow-hidden rounded-3xl border-2 border-navy bg-navy-deep p-6 text-center shadow-pop">
          <span className="pill bg-pink text-navy">🔒 Liberação especial</span>
          <h2 className="mt-4 text-[clamp(24px,5.5vw,34px)] font-black uppercase text-primary-foreground">
            Conteúdo <span className="text-pink">Exclusivo</span>
          </h2>
          <p className="mx-auto mt-3 max-w-[480px] text-sm text-primary-foreground/80">
            Receitas e aulas extras liberadas por telefone. Se o seu já foi liberado, toque no
            botão abaixo pra acessar.
          </p>

          {track.length > 0 ? (
            <div className="relative mt-6 -mx-6 overflow-hidden">
              <style>{`
                @keyframes exclusivo-marquee {
                  from { transform: translateX(0); }
                  to { transform: translateX(-50%); }
                }
              `}</style>
              <div
                className="flex w-max gap-3 px-6 [animation-play-state:running] hover:[animation-play-state:paused]"
                style={{ animation: `exclusivo-marquee ${duration}s linear infinite` }}
              >
                {track.map((item, i) => {
                  const img = item.yt
                    ? youtubeThumb(item.yt)
                    : item.cover_path
                      ? materiaisUrl(item.cover_path)
                      : null;
                  return (
                    <div
                      key={`${item.id}-${i}`}
                      className="relative w-[140px] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-navy text-left shadow-soft"
                    >
                      <div className="relative aspect-video w-full overflow-hidden bg-navy">
                        {img ? (
                          <img
                            src={img}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                        <span className="absolute left-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-white/90 text-xs text-navy shadow-soft">
                          🔒
                        </span>
                      </div>
                      <p className="p-2 text-xs font-semibold leading-snug text-primary-foreground/90">
                        {item.title}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          <a
            href="/exclusivo"
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-block rounded-2xl bg-pink px-6 py-3 font-display text-sm font-extrabold text-navy shadow-soft transition-transform active:scale-[0.98]"
          >
            🔓 Acessar conteúdo exclusivo
          </a>
        </div>
      </div>
    </section>
  );
}
