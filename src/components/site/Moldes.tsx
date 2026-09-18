import { useMemo, useState } from "react";
import { materiaisUrl } from "@/lib/storage-url";
import type { PublicMolde } from "@/api/public-data";

const CATS = ["Todos", "Bolsas e Necessaires", "Bônus"];

export function Moldes({ moldes }: { moldes: PublicMolde[] }) {
  const [cat, setCat] = useState("Todos");

  const list = useMemo(
    () => moldes.filter((m) => (cat === "Todos" ? true : m.cat === cat)),
    [moldes, cat],
  );

  return (
    <section id="moldes" className="bg-denim-soft px-5 py-12">
      <div className="mx-auto max-w-[720px]">
        <div className="text-center">
          <span className="pill bg-denim text-primary-foreground">Seus entregáveis</span>
          <h2 className="mt-4 text-[clamp(28px,6.5vw,42px)] font-black uppercase">
            Seus <span className="text-pink">Moldes</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Toque em qualquer molde para abrir e imprimir.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {CATS.map((c) => (
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

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {list.map((m) => {
            const hasFile = Boolean(m.file_path);
            return (
              <div
                key={m.id}
                className="relative overflow-hidden rounded-2xl border border-line bg-card text-left shadow-soft"
              >
                {!hasFile ? (
                  <span className="absolute right-2 top-2 z-10 rounded-full bg-orange px-2 py-0.5 text-[10px] font-bold text-navy">
                    Em breve
                  </span>
                ) : null}

                <div className="flex h-36 items-center justify-center overflow-hidden bg-surface-alt">
                  {m.cover_path ? (
                    <img
                      src={materiaisUrl(m.cover_path)}
                      alt={m.title}
                      loading="lazy"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <span className="font-display text-3xl">👜</span>
                  )}
                </div>

                <div className="p-3">
                  <p className="font-display text-sm font-extrabold leading-tight text-navy">
                    {m.title}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {m.kind === "imagem"
                      ? "Imagem"
                      : m.pages
                        ? `PDF · ${m.pages} páginas`
                        : "PDF completo"}
                  </p>

                  {m.file_path ? (
                    <div className="mt-3 grid grid-cols-2 gap-1.5">
                      <a
                        href={materiaisUrl(m.file_path)}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-xl border border-line bg-surface-alt py-2 text-center text-xs font-bold text-navy"
                      >
                        👁 Ver
                      </a>
                      <a
                        href={materiaisUrl(m.file_path)}
                        download
                        className="rounded-xl bg-pink py-2 text-center text-xs font-bold text-navy"
                      >
                        ⬇ Baixar
                      </a>
                    </div>
                  ) : (
                    <p className="mt-3 rounded-xl bg-surface-alt py-2 text-center text-xs font-semibold text-muted-foreground">
                      Em preparação
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
