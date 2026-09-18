import { createFileRoute, Link } from "@tanstack/react-router";
import { MODULOS } from "@/data/guia";

export const Route = createFileRoute("/guia-de-vendas")({
  head: () => ({
    meta: [
      { title: "Guia Completo de Vendas — Crochê" },
      {
        name: "description",
        content:
          "20 módulos passo a passo para vender suas peças em crochê: da primeira venda em casa às vendas para todo o Brasil.",
      },
      { property: "og:title", content: "Guia Completo de Vendas — Crochê" },
      {
        property: "og:description",
        content: "20 módulos passo a passo para vender suas peças em crochê com lucro.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GuiaPage,
});

function GuiaPage() {
  return (
    <main className="pb-24">
      <header className="border-b border-line bg-gradient-to-b from-pink-soft to-surface-alt px-5 py-11 text-center">
        <div className="mx-auto max-w-[720px]">
          <span className="pill bg-orange text-navy">🎁 Bônus exclusivo</span>
          <h1 className="mt-4 text-[clamp(30px,7.5vw,50px)] font-black uppercase">
            Guia Completo
            <span className="block text-pink">de Vendas</span>
          </h1>
          <p className="mx-auto mt-4 max-w-[520px] text-muted-foreground">
            20 módulos passo a passo: da primeira venda em casa às vendas para todo o Brasil.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-[720px] px-5 py-10">
        <div className="space-y-3">
          {MODULOS.map((m) => (
            <article key={m.n} className="rounded-3xl border border-line bg-card p-5 shadow-soft">
              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-navy font-display text-sm font-extrabold text-primary-foreground">
                  {String(m.n).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="font-display text-base font-extrabold">{m.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{m.text}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <Link
          to="/"
          className="mt-8 block rounded-2xl bg-pink px-5 py-4 text-center font-display text-lg font-extrabold text-navy shadow-soft"
        >
          ← Voltar para o curso
        </Link>
      </div>
    </main>
  );
}
