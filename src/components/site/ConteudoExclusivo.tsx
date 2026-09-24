import { materiaisUrl } from "@/lib/storage-url";
import type { PublicExclusivePreview } from "@/api/public-data";

function youtubeThumb(yt: string) {
  return `https://img.youtube.com/vi/${yt}/hqdefault.jpg`;
}

export function ConteudoExclusivo({ preview }: { preview: PublicExclusivePreview[] }) {
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

          {preview.length > 0 ? (
            <div className="mt-6 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {preview.map((item) => {
                const img = item.yt
                  ? youtubeThumb(item.yt)
                  : item.cover_path
                    ? materiaisUrl(item.cover_path)
                    : null;
                return (
                  <div
                    key={item.id}
                    className="w-[140px] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-navy text-left shadow-soft"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-navy">
                      {img ? (
                        <img
                          src={img}
                          alt=""
                          loading="lazy"
                          className="h-full w-full scale-110 object-cover blur-[6px]"
                        />
                      ) : null}
                      <span className="absolute inset-0 flex items-center justify-center bg-navy-deep/60">
                        <span className="flex size-9 items-center justify-center rounded-full bg-white/90 text-lg text-navy shadow-soft">
                          🔒
                        </span>
                      </span>
                    </div>
                    <p className="p-2 text-xs font-semibold leading-snug text-primary-foreground/90">
                      {item.title}
                    </p>
                  </div>
                );
              })}
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
