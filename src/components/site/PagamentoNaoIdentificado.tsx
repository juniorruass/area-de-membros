import { useEffect, useState } from "react";

export function PagamentoNaoIdentificado({
  pixKey,
  whatsapp,
  whatsappLabel,
  groupUrl,
}: {
  pixKey: string;
  whatsapp: string;
  whatsappLabel: string;
  groupUrl: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const STORAGE_KEY = "pagamento_popup_last_shown";
    const INTERVAL_MS = 2 * 60 * 60 * 1000;

    const maybeShow = () => {
      let last = 0;
      try {
        last = Number(localStorage.getItem(STORAGE_KEY) || 0);
      } catch {
        last = 0;
      }
      if (Date.now() - last >= INTERVAL_MS) {
        setOpen(true);
        try {
          localStorage.setItem(STORAGE_KEY, String(Date.now()));
        } catch {
          // ignora — sem localStorage, o popup só aparece nesta sessão
        }
      }
    };

    const initialTimer = setTimeout(maybeShow, 20000);
    const recurring = setInterval(maybeShow, 60000);
    return () => {
      clearTimeout(initialTimer);
      clearInterval(recurring);
    };
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

        <p className="mt-4 text-sm font-semibold text-navy">📱 Suporte: {whatsappLabel}</p>

        <a
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noreferrer"
          className="mt-3 block w-full rounded-2xl bg-green px-5 py-4 font-display text-base font-extrabold text-primary-foreground shadow-soft transition-transform active:scale-[0.98]"
        >
          📱 Falar com o suporte
        </a>

        {groupUrl ? (
          <a
            href={groupUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 block w-full rounded-2xl border-2 border-green px-5 py-4 font-display text-base font-extrabold text-green shadow-soft transition-transform active:scale-[0.98]"
          >
            💬 Entrar no grupo do WhatsApp
          </a>
        ) : null}

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
