import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { DICAS_FOTOS, FORNECEDORES } from "@/data/fotos";

export function Bonus() {
  const [openFornecedores, setOpenFornecedores] = useState(false);
  const [openFotos, setOpenFotos] = useState(false);

  return (
    <section id="bonus" className="bg-green-soft px-5 py-12">
      <div className="mx-auto max-w-[720px]">
        <div className="text-center">
          <span className="pill bg-green text-primary-foreground">🎁 De brinde</span>
          <h2 className="mt-4 text-[clamp(28px,6.5vw,42px)] font-black uppercase">
            Seus <span className="text-pink">Bônus</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Materiais extras inclusos, sem custo, junto dos seus moldes.
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <div className="rounded-3xl border border-line bg-card p-5 shadow-soft">
            <div className="flex items-start gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-pink font-display text-sm font-extrabold text-navy">
                1
              </span>
              <div>
                <p className="font-display text-base font-extrabold text-navy">Guia de Preços</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Quanto cobrar por cada modelo para ter lucro de verdade.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-line bg-card p-5 shadow-soft">
            <button
              type="button"
              onClick={() => setOpenFornecedores((v) => !v)}
              className="flex w-full items-start gap-3 text-left"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-pink font-display text-sm font-extrabold text-navy">
                2
              </span>
              <div>
                <p className="font-display text-base font-extrabold text-navy">
                  Lista de Fornecedores
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Onde comprar ferragens, zíperes, alças e forros com preço baixo. Toque para abrir 👇
                </p>
              </div>
            </button>
            {openFornecedores ? (
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {FORNECEDORES.map((f) => (
                  <span
                    key={f}
                    className="rounded-xl bg-surface-alt px-4 py-3 text-sm font-semibold text-navy"
                  >
                    {f}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="rounded-3xl border border-line bg-card p-5 shadow-soft">
            <button
              type="button"
              onClick={() => setOpenFotos((v) => !v)}
              className="flex w-full items-start gap-3 text-left"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-pink font-display text-sm font-extrabold text-navy">
                3
              </span>
              <div>
                <p className="font-display text-base font-extrabold text-navy">Fotos que Vendem</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Como fotografar sua bolsa com o celular para atrair encomendas. Toque para abrir o
                  guia 👇
                </p>
              </div>
            </button>

            {openFotos ? (
              <div className="mt-4">
                <p className="text-sm text-ink">
                  Você não precisa de câmera profissional. Com um celular, boa iluminação e alguns
                  cuidados, suas peças ficam muito mais valorizadas.
                </p>
                <div className="mt-4 space-y-3">
                  {DICAS_FOTOS.map((d, i) => (
                    <div key={d.title} className="rounded-2xl bg-surface-alt p-4">
                      <p className="font-display text-sm font-extrabold text-navy">
                        {i + 1}. {d.icon} {d.title}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">{d.text}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 rounded-2xl bg-destructive/5 px-4 py-3 text-sm text-ink">
                  ❌ <b>O que evitar:</b> fotos escuras, ambientes bagunçados, excesso de objetos,
                  filtros exagerados, imagens tremidas, bolsa amassada, peça cortada e flash muito
                  forte.
                </p>
                <p className="mt-3 rounded-2xl bg-pink-soft px-4 py-3 text-sm italic text-pink-strong">
                  💡 “Se eu estivesse procurando uma bolsa pela internet, essa foto me faria parar
                  para olhar?”
                </p>
              </div>
            ) : null}
          </div>

          <Link
            to="/guia-de-vendas"
            className="block rounded-3xl bg-navy p-6 text-center shadow-pop"
          >
            <p className="text-3xl">📘</p>
            <p className="mt-2 font-display text-lg font-extrabold text-primary-foreground">
              Guia Completo de Vendas
            </p>
            <p className="mt-1 text-sm text-primary-foreground/80">
              20 módulos passo a passo: da primeira venda em casa às vendas para todo o Brasil.
            </p>
            <span className="pill mt-3 bg-orange text-navy">🎁 Bônus exclusivo</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
