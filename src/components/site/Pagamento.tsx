import { useState } from "react";
import { PIX_KEY, PIX_NAME } from "@/data/pix";

export function Pagamento() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PIX_KEY);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="pagamento" className="px-5 py-12">
      <div className="mx-auto max-w-[720px] text-center">
        <span className="pill bg-denim-soft text-denim">Pagamento</span>
        <h2 className="mt-4 text-[clamp(28px,6.5vw,42px)] font-black uppercase">
          Chave <span className="text-pink">PIX</span>
        </h2>

        <p className="mt-5 rounded-2xl bg-green-soft px-5 py-4 text-left text-sm text-ink">
          ✅ <b>Seu acesso já está liberado!</b> Se você já fez o pagamento,{" "}
          <b>não precisa pagar de novo</b> — é só descer a página e aproveitar. A chave abaixo é
          apenas para quem ainda não pagou.
        </p>

        <div className="mt-5 rounded-3xl border border-line bg-card p-6 shadow-soft">
          <p className="text-sm font-semibold text-muted-foreground">
            Pague <b className="text-pink">APENAS</b> nesta chave PIX:
          </p>
          <p className="mt-3 break-all font-display text-2xl font-extrabold text-navy">{PIX_KEY}</p>
          <button
            type="button"
            onClick={copy}
            className="mt-4 w-full rounded-2xl bg-pink px-5 py-4 font-display text-lg font-extrabold text-navy shadow-soft transition-transform active:scale-[0.98]"
          >
            {copied ? "✓ Copiado!" : "➜ Copiar chave PIX"}
          </button>

          <div className="mt-5 rounded-2xl bg-surface-alt px-4 py-3 text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Recebedor do PIX
            </p>
            <p className="font-display text-base font-extrabold text-navy">{PIX_NAME}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Confira sempre o nome antes de confirmar a transferência.
            </p>
          </div>
        </div>

        <p className="mt-4 rounded-2xl border border-destructive/30 bg-destructive/5 px-5 py-4 text-left text-sm text-ink">
          ⚠️ <b className="text-destructive">Cuidado com golpes!</b> Não pague em nenhuma outra
          chave, conta ou pessoa. Confira sempre o nome do recebedor acima.
        </p>

        <p className="mt-7 font-display font-extrabold text-navy">
          Seus moldes, videoaulas e bônus estão logo abaixo 👇
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <a
            href="#moldes"
            className="rounded-2xl bg-navy px-5 py-4 font-display font-extrabold text-primary-foreground"
          >
            Ver meus moldes
          </a>
          <a
            href="#aulas"
            className="rounded-2xl border-2 border-navy px-5 py-4 font-display font-extrabold text-navy"
          >
            Ver videoaulas
          </a>
        </div>
      </div>
    </section>
  );
}
