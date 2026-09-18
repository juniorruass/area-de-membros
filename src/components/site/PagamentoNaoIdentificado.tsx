import { useEffect, useState } from "react";

export function PagamentoNaoIdentificado({ pixKey }: { pixKey: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 20000);
    return () => clearTimeout(timer);
  }, []);

  if (!open) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(pixKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-navy-deep/70 px-5">
      <div className="relative w-full max-w-[380px] overflow-hidden rounded-3xl bg-card p-6 text-center shadow-pop">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-destructive" />

        <p className="text-5xl">⚠️</p>
        <h3 className="mt-3 font-display text-xl font-black uppercase leading-tight text-destructive">
          Pagamento não identificado
        </h3>

        <p className="mt-4 text-sm text-ink">
          Regularize seu pagamento para manter o acesso ao site com{" "}
          <b className="text-navy">todas as receitas e gráficos</b>.
        </p>

        <button
          type="button"
          onClick={copy}
          className="mt-4 w-full rounded-2xl bg-green px-5 py-3 font-display text-sm font-extrabold text-primary-foreground shadow-soft transition-transform active:scale-[0.98]"
        >
          {copied ? "✓ Copiado!" : "➜ Copiar chave PIX"}
        </button>
        <p className="mt-2 break-all font-display text-base font-extrabold text-navy">{pixKey}</p>

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
