import { useState } from "react";

const BRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });

const DEFAULTS = ["Tecido / jeans", "Ferragens", "Zíper", "Alça", "Forro", "Linha e aviamentos"];

type Mat = { name: string; val: string };

export function CustoProducao({ onUseCost }: { onUseCost: (v: number) => void }) {
  const [mats, setMats] = useState<Mat[]>(DEFAULTS.map((name) => ({ name, val: "" })));
  const [horas, setHoras] = useState("");
  const [valorHora, setValorHora] = useState("");
  const [outros, setOutros] = useState("");

  const num = (s: string) => Number(s.replace(",", ".")) || 0;
  const totalMat = mats.reduce((a, m) => a + num(m.val), 0);
  const mao = num(horas) * num(valorHora);
  const totalOutros = num(outros);
  const total = totalMat + mao + totalOutros;

  const update = (i: number, key: keyof Mat, value: string) =>
    setMats((prev) => prev.map((m, j) => (i === j ? { ...m, [key]: value } : m)));

  return (
    <section id="custo" className="px-5 py-12">
      <div className="mx-auto max-w-[720px]">
        <div className="text-center">
          <span className="pill bg-denim-soft text-denim">Ferramenta</span>
          <h2 className="mt-4 text-[clamp(28px,6.5vw,42px)] font-black uppercase">
            Custo de <span className="text-pink">Produção</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Some tudo o que entra na peça e descubra quanto ela custa para você.
          </p>
        </div>

        <div className="mt-6 rounded-3xl border border-line bg-card p-6 shadow-soft">
          <p className="font-display text-sm font-extrabold text-navy">Materiais e aviamentos</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Adicione cada item e o quanto custou.
          </p>
          <div className="mt-3 space-y-2">
            {mats.map((m, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={m.name}
                  onChange={(e) => update(i, "name", e.target.value)}
                  placeholder="Material"
                  className="min-w-0 flex-1 rounded-xl border border-line bg-surface-alt px-3 py-2.5 text-sm outline-none focus:border-pink"
                />
                <input
                  inputMode="decimal"
                  value={m.val}
                  onChange={(e) => update(i, "val", e.target.value)}
                  placeholder="R$"
                  className="w-24 rounded-xl border border-line bg-surface-alt px-3 py-2.5 text-sm outline-none focus:border-pink"
                />
                <button
                  type="button"
                  aria-label="Remover material"
                  onClick={() => setMats((prev) => prev.filter((_, j) => j !== i))}
                  className="rounded-xl border border-line px-3 text-muted-foreground"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setMats((prev) => [...prev, { name: "", val: "" }])}
            className="mt-3 w-full rounded-xl border-2 border-dashed border-line py-3 font-display text-sm font-extrabold text-navy"
          >
            + Adicionar material
          </button>

          <p className="mt-6 font-display text-sm font-extrabold text-navy">Seu tempo</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Quanto tempo levou e quanto vale sua hora.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <input
              inputMode="decimal"
              value={horas}
              onChange={(e) => setHoras(e.target.value)}
              placeholder="Horas para produzir"
              className="rounded-xl border border-line bg-surface-alt px-3 py-2.5 text-sm outline-none focus:border-pink"
            />
            <input
              inputMode="decimal"
              value={valorHora}
              onChange={(e) => setValorHora(e.target.value)}
              placeholder="Valor da sua hora"
              className="rounded-xl border border-line bg-surface-alt px-3 py-2.5 text-sm outline-none focus:border-pink"
            />
          </div>

          <p className="mt-6 font-display text-sm font-extrabold text-navy">
            Outros custos (embalagem, opcional)
          </p>
          <input
            inputMode="decimal"
            value={outros}
            onChange={(e) => setOutros(e.target.value)}
            placeholder="R$"
            className="mt-2 w-full rounded-xl border border-line bg-surface-alt px-3 py-2.5 text-sm outline-none focus:border-pink"
          />

          <div className="mt-6 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-xl bg-surface-alt py-3">
              <p className="text-muted-foreground">Materiais</p>
              <p className="font-display text-sm font-extrabold text-navy">{BRL(totalMat)}</p>
            </div>
            <div className="rounded-xl bg-surface-alt py-3">
              <p className="text-muted-foreground">Mão de obra</p>
              <p className="font-display text-sm font-extrabold text-navy">{BRL(mao)}</p>
            </div>
            <div className="rounded-xl bg-surface-alt py-3">
              <p className="text-muted-foreground">Outros</p>
              <p className="font-display text-sm font-extrabold text-navy">{BRL(totalOutros)}</p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-green p-5 text-center text-primary-foreground">
            <p className="text-xs font-bold uppercase tracking-wider opacity-90">
              Custo total de produção
            </p>
            <p className="font-display text-4xl font-black">{BRL(total)}</p>
          </div>

          <a
            href="#preco"
            onClick={() => onUseCost(Number(total.toFixed(2)))}
            className="mt-3 block rounded-2xl border-2 border-navy py-3 text-center font-display text-sm font-extrabold text-navy"
          >
            Usar este custo em “Quanto Cobrar” ↑
          </a>
        </div>
      </div>
    </section>
  );
}
