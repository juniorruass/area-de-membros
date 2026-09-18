import { useEffect, useState } from "react";

export function PagamentoNaoIdentificado({
  whatsapp,
  whatsappLabel,
}: {
  whatsapp: string;
  whatsappLabel: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 20000);
    return () => clearTimeout(timer);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-navy-deep/70 px-5">
      <div className="relative w-full max-w-[380px] overflow-hidden rounded-3xl bg-card p-6 text-center shadow-pop">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-destructive" />

        <p className="text-5xl">⚠️</p>
        <h3 className="mt-3 font-display text-xl font-black uppercase leading-tight text-destructive">
          Pagamento não identificado
        </h3>

        <p className="mt-4 rounded-full bg-destructive/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-destructive">
          🔴 Seu acesso poderá ser bloqueado
        </p>

        <p className="mt-4 text-sm text-ink">
          Regularize seu pagamento para manter o acesso ao site com{" "}
          <b className="text-navy">todas as receitas e gráficos</b>.
        </p>

        <p className="mt-4 text-sm font-semibold text-navy">
          📱 Suporte: {whatsappLabel}
        </p>

        <a
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noreferrer"
          className="mt-4 block w-full rounded-2xl bg-green px-5 py-4 font-display text-base font-extrabold text-primary-foreground shadow-soft transition-transform active:scale-[0.98]"
        >
          📱 Falar com o suporte
        </a>

        <button
          type="button"
          onClick={() => setOpen(false)}
          className="mt-4 text-sm font-semibold text-muted-foreground underline"
        >
          Fechar aviso
        </button>
      </div>
    </div>
  );
}
