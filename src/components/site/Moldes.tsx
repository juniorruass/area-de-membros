import { useMemo, useState } from "react";
import { MOLDES } from "@/data/moldes";
import { MATERIAIS } from "@/data/materiais";

const CATS = ["Todos", "Bolsas e Necessaires", "Bônus"];

export function Moldes() {
  const [cat, setCat] = useState("Todos");

  const list = useMemo(
    () => MOLDES.filter((m) => (cat === "Todos" ? true : m.cat === cat)),
    [cat],
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
          {list.map((m, i) => {
            const material = MATERIAIS[m.title];
            return (
              <div
                key={`${m.title}-${i}`}
                className="relative overflow-hidden rounded-2xl border border-line bg-card text-left shadow-soft"
              >
                {!material ? (
                  <span className="absolute right-2 top-2 z-10 rounded-full bg-orange px-2 py-0.5 text-[10px] font-bold text-navy">
                    Em breve
                  </span>
                ) : null}

                <div className="flex h-36 items-center justify-center overflow-hidden bg-surface-alt">
                  {material ? (
                    <img
                      src={`/materiais/${material.cover}`}
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
                    {material?.kind === "imagem"
                      ? "Imagem"
                      : m.pages
                        ? `PDF · ${m.pages} páginas`
                        : "PDF completo"}
                  </p>

                  {material ? (
                    <div className="mt-3 grid grid-cols-2 gap-1.5">
                      <a
                        href={`/materiais/${material.file}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-xl border border-line bg-surface-alt py-2 text-center text-xs font-bold text-navy"
                      >
                        👁 Ver
                      </a>
                      <a
                        href={`/materiais/${material.file}`}
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
