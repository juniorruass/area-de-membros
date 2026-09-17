import { useState } from "react";

const BRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });

const MARKUPS = [50, 100, 150, 200];

export function Precificacao({ custo }: { custo: number }) {
  const [custoInput, setCustoInput] = useState("");
  const [markup, setMarkup] = useState(100);
  const [taxa, setTaxa] = useState("");

  const c = Number(custoInput.replace(",", ".")) || custo || 0;
  const t = Number(taxa.replace(",", ".")) || 0;
  const priceFor = (cost: number, mp: number) => {
    const base = cost * (1 + mp / 100);
    return t > 0 ? base / (1 - t / 100) : base;
  };
  const preco = priceFor(c, markup);
  const lucro = preco * (1 - t / 100) - c;
  const margem = preco > 0 ? (lucro / preco) * 100 : 0;
  const mk = c > 0 ? preco / c : 0;

  return (
    <section id="preco" className="bg-pink-soft px-5 py-12">
      <div className="mx-auto max-w-[720px]">
        <div className="text-center">
          <span className="pill bg-pink text-navy">Ferramenta</span>
          <h2 className="mt-4 text-[clamp(28px,6.5vw,42px)] font-black uppercase">
            Quanto <span className="text-pink">Cobrar</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Descubra o preço de venda ideal da sua bolsa e quanto sobra de lucro.
          </p>
        </div>

        <div className="mt-6 rounded-3xl border border-line bg-card p-6 shadow-soft">
          <label className="block text-sm font-bold text-navy">Custo de produção da peça</label>
          <input
            inputMode="decimal"
            value={custoInput}
            onChange={(e) => setCustoInput(e.target.value)}
            placeholder={custo ? String(custo.toFixed(2)) : "Ex: 45,00"}
            className="mt-2 w-full rounded-2xl border border-line bg-surface-alt px-4 py-3 outline-none focus:border-pink"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Não sabe o custo? Use a calculadora de <b>Custo de Produção</b> mais abaixo.
          </p>

          <label className="mt-6 block text-sm font-bold text-navy">
            Quanto você quer ganhar sobre o custo
          </label>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {MARKUPS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMarkup(m)}
                className={`rounded-xl border px-2 py-3 font-display text-sm font-extrabold ${
                  markup === m
                    ? "border-pink bg-pink text-navy"
                    : "border-line bg-surface-alt text-navy"
                }`}
              >
                {m}%
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            100% = cobrar o dobro do que você gastou · 200% = o triplo.
          </p>

          <label className="mt-6 block text-sm font-bold text-navy">
            Taxas sobre a venda (maquininha, opcional)
          </label>
          <input
            inputMode="decimal"
            value={taxa}
            onChange={(e) => setTaxa(e.target.value)}
            placeholder="Ex: 4,99"
            className="mt-2 w-full rounded-2xl border border-line bg-surface-alt px-4 py-3 outline-none focus:border-pink"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Deixe em branco se recebe no PIX ou dinheiro.
          </p>

          <div className="mt-6 rounded-2xl bg-navy p-5 text-center text-primary-foreground">
            <p className="text-xs font-bold uppercase tracking-wider opacity-80">
              Preço de venda sugerido
            </p>
            <p className="font-display text-4xl font-black">{BRL(preco)}</p>
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
              <div className="rounded-xl bg-primary-foreground/10 py-2">
                <p className="opacity-80">Seu lucro</p>
                <p className="font-display text-sm font-extrabold">{BRL(lucro)}</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 py-2">
                <p className="opacity-80">Margem</p>
                <p className="font-display text-sm font-extrabold">{margem.toFixed(0)}%</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 py-2">
                <p className="opacity-80">Markup</p>
                <p className="font-display text-sm font-extrabold">{mk.toFixed(1)}×</p>
              </div>
            </div>
          </div>

          <p className="mt-6 font-display text-sm font-extrabold text-navy">Se você cobrar…</p>
          <table className="mt-2 w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-muted-foreground">
                <th className="py-2">Cenário</th>
                <th className="py-2">Preço</th>
                <th className="py-2">Lucro</th>
              </tr>
            </thead>
            <tbody>
              {MARKUPS.map((m) => {
                const p = priceFor(c, m);
                return (
                  <tr key={m} className="border-t border-line">
                    <td className="py-2">{m}% sobre o custo</td>
                    <td className="py-2 font-bold text-navy">{BRL(p)}</td>
                    <td className="py-2">{BRL(p * (1 - t / 100) - c)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <p className="mt-4 rounded-2xl bg-green-soft px-4 py-3 text-sm text-ink">
            Dica: preços redondos (R$ 89, R$ 99, R$ 120) vendem melhor. Arredonde o valor sugerido
            para o número cheio mais próximo.
          </p>
        </div>
      </div>
    </section>
  );
}
