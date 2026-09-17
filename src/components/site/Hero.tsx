import { Hearts } from "./Hearts";

const HIGHLIGHTS = [
  { n: "+200 Moldes", d: "Completos, com medidas." },
  { n: "55 Videoaulas", d: "Passo a passo." },
  { n: "Precificação", d: "Saiba quanto cobrar." },
  { n: "Custo de Produção", d: "Calcule e lucre mais." },
];

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative isolate overflow-hidden border-b border-line bg-gradient-to-b from-pink-soft to-surface-alt px-5 pt-11 pb-10 text-center"
    >
      <Hearts />
      <div className="relative z-10 mx-auto max-w-[720px]">
        <div className="mb-5">
          <p className="font-display text-xl font-black uppercase tracking-wide text-navy">
            Professora Graziele Sampaio
          </p>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-pink">
            Academia de Bolsas
          </p>
        </div>

        <span className="pill bg-green text-primary-foreground shadow-soft">🔓 Acesso liberado</span>
        <p className="mt-4 font-display text-lg font-extrabold text-pink">Bem-vinda!</p>
        <h1 className="mt-2 text-[clamp(32px,8vw,56px)] font-black uppercase leading-[0.98]">
          Curso completo
          <span className="block text-pink">Bolsas &amp; Necessaires</span>
        </h1>
        <p className="mx-auto mt-4 max-w-[560px] text-muted-foreground">
          Curso profissional de bolsas e necessaires em jeans, com <b>200 moldes completos</b>,
          videoaulas e ferramentas exclusivas para apoiar a sua produção. 🧵✂️
        </p>
        <p className="mt-4 rounded-2xl bg-green-soft px-4 py-3 font-semibold text-green">
          🎓 Formação completa — 240 horas de curso profissional
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Role a página e aproveite todo o conteúdo. Seu acesso é vitalício! 💕
        </p>

        <div className="mt-7 grid grid-cols-2 gap-3">
          {HIGHLIGHTS.map((h) => (
            <div
              key={h.n}
              className="rounded-2xl border border-line bg-card p-4 text-left shadow-soft"
            >
              <p className="font-display text-base font-extrabold text-navy">{h.n}</p>
              <p className="mt-1 text-sm text-muted-foreground">{h.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-7 space-y-3">
          <a
            href="#bonus"
            className="block rounded-2xl border-2 border-navy px-5 py-4 font-display text-base font-extrabold text-navy"
          >
            📘 Ver Guia de Vendas e bônus
          </a>
        </div>
      </div>
    </section>
  );
}
