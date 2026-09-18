type Winner = { name: string; city: string; prize: string };

export function Sorteio({ winner }: { winner: Winner | null }) {
  return (
    <section id="sorteio" className="bg-navy px-5 py-12 text-center">
      <div className="mx-auto max-w-[720px]">
        <span className="pill bg-orange text-navy">🍀 Sorteio do curso</span>
        <h2 className="mt-4 text-[clamp(28px,6.5vw,42px)] font-black uppercase text-primary-foreground">
          Um prêmio que
          <span className="block text-pink-soft">transforma sua vida</span>
        </h2>
        <p className="mx-auto mt-4 max-w-[520px] text-primary-foreground/80">
          Quem adquire os moldes concorre automaticamente aos sorteios. Um único prêmio, uma grande
          ganhadora.
        </p>
        <p className="mt-4 font-display font-extrabold text-orange">
          🍀 A próxima sortuda pode ser VOCÊ! 🧵✨
        </p>

        <div className="mt-7 rounded-3xl bg-card p-6 text-left shadow-pop">
          <p className="font-display text-sm font-extrabold uppercase tracking-wider text-pink-strong">
            🎁 O prêmio
          </p>
          <p className="mt-2 text-lg font-bold text-navy">
            Máquina de costura semiprofissional + Kit de Aviamentos + R$ 500 em dinheiro
          </p>
          <p className="mt-1 text-sm text-muted-foreground">para investir no seu ateliê.</p>
          <div className="mt-5 grid gap-2 text-sm">
            <p className="rounded-xl bg-surface-alt px-4 py-3">
              📅 Sorteio: <b className="text-navy">30/09</b>
            </p>
            <p className="rounded-xl bg-surface-alt px-4 py-3">
              📣 Resultado: <b className="text-navy">30/09</b> no WhatsApp
            </p>
          </div>
        </div>

        {winner ? (
          <div className="mt-4 rounded-3xl border-2 border-pink bg-pink-soft p-8 text-center shadow-pop">
            <span className="pill bg-orange text-navy">🏆 Última sortuda</span>
            <p className="mt-4 font-display text-2xl font-black text-navy">{winner.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">📍 {winner.city}</p>
            <p className="mx-auto mt-3 max-w-[420px] text-base font-semibold text-ink">
              Ganhou {winner.prize}! 💖
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
