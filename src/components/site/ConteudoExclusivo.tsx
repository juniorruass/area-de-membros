export function ConteudoExclusivo({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <section className="px-5 py-10">
      <div className="mx-auto max-w-[720px]">
        <div className="overflow-hidden rounded-3xl border-2 border-navy bg-navy-deep p-6 text-center shadow-pop">
          <span className="pill bg-pink text-navy">🔒 Liberação especial</span>
          <h2 className="mt-4 text-[clamp(24px,5.5vw,34px)] font-black uppercase text-primary-foreground">
            Conteúdo <span className="text-pink">Exclusivo</span>
          </h2>
          <p className="mx-auto mt-3 max-w-[480px] text-sm text-primary-foreground/80">
            Receitas e aulas extras liberadas por telefone. Se o seu já foi liberado, toque no
            botão abaixo pra acessar.
          </p>
          <a
            href="/exclusivo"
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-block rounded-2xl bg-pink px-6 py-3 font-display text-sm font-extrabold text-navy shadow-soft transition-transform active:scale-[0.98]"
          >
            🔓 Acessar conteúdo exclusivo
          </a>
        </div>
      </div>
    </section>
  );
}
