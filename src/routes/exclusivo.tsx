import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { getExclusiveContent, unlockExclusive } from "@/api/exclusive";
import { getPublicData } from "@/api/public-data";
import { materiaisUrl } from "@/lib/storage-url";

export const Route = createFileRoute("/exclusivo")({
  loader: async () => {
    const [content, pub] = await Promise.all([getExclusiveContent(), getPublicData()]);
    return { content, settings: pub.settings };
  },
  head: () => ({
    meta: [
      { title: "Conteúdo Exclusivo — Crochê da Rosenilda" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ExclusivoPage,
});

function youtubeThumb(yt: string) {
  return `https://img.youtube.com/vi/${yt}/hqdefault.jpg`;
}

function ExclusivoPage() {
  const data = Route.useLoaderData();
  const [authenticated, setAuthenticated] = useState(data.content.authenticated);
  const [moldes, setMoldes] = useState(data.content.moldes);
  const [videos, setVideos] = useState(data.content.videos);
  const [current, setCurrent] = useState(data.content.videos[0] ?? null);
  const [phone, setPhone] = useState("");
  const [showRequest, setShowRequest] = useState(false);
  const [loading, setLoading] = useState(false);

  const { settings } = data;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);
    try {
      const res = await unlockExclusive({ data: { phone } });
      if (!res.ok) {
        setShowRequest(true);
        return;
      }
      const fresh = await getExclusiveContent();
      setAuthenticated(true);
      setMoldes(fresh.moldes);
      setVideos(fresh.videos);
      setCurrent(fresh.videos[0] ?? null);
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface-alt px-5">
        <div className="w-full max-w-[380px] rounded-3xl border border-line bg-card p-6 text-center shadow-pop">
          <p className="text-5xl">🔒</p>
          <h1 className="mt-3 font-display text-xl font-black uppercase text-navy">
            Conteúdo Exclusivo
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Digite o telefone liberado pra acessar.
          </p>

          <form onSubmit={submit} className="mt-5 text-left">
            <label className="block text-sm font-bold text-navy">Telefone (com DDD)</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="73 99999-9999"
              autoFocus
              className="mt-1 w-full rounded-2xl border border-line bg-surface-alt px-4 py-3 outline-none focus:border-pink"
            />
            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-2xl bg-pink px-5 py-3 font-display font-extrabold text-navy disabled:opacity-60"
            >
              {loading ? "Verificando…" : "Entrar"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => setShowRequest(true)}
            className="mt-4 text-sm font-semibold text-muted-foreground underline"
          >
            Ainda não tenho acesso — solicitar liberação
          </button>
        </div>

        {showRequest ? (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-navy-deep/70 px-5">
            <div className="relative w-full max-w-[380px] overflow-hidden rounded-3xl bg-card p-6 text-center shadow-pop">
              <div className="absolute inset-x-0 top-0 h-1.5 bg-pink" />

              <p className="text-5xl">🔒</p>
              <h3 className="mt-3 font-display text-xl font-black uppercase leading-tight text-navy">
                Solicitar Acesso
              </h3>
              <p className="mt-4 text-sm text-ink">
                Esse telefone ainda não tem acesso liberado. Chama no WhatsApp que a gente libera
                pra você.
              </p>

              {settings.suporte_whatsapp ? (
                <a
                  href={`https://wa.me/${settings.suporte_whatsapp}?text=${encodeURIComponent(
                    "Oi! Quero pedir a liberação do meu acesso ao conteúdo exclusivo.",
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 block w-full rounded-2xl bg-green px-5 py-3 text-center font-display text-sm font-extrabold text-primary-foreground shadow-soft transition-transform active:scale-[0.98]"
                >
                  📱 Solicitar pelo WhatsApp
                </a>
              ) : null}

              <button
                type="button"
                onClick={() => setShowRequest(false)}
                className="mt-4 text-sm font-semibold text-muted-foreground underline"
              >
                Fechar
              </button>
            </div>
          </div>
        ) : null}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface-alt pb-20">
      <div className="mx-auto max-w-[720px] px-5 py-10">
        <div className="text-center">
          <span className="pill bg-navy text-primary-foreground">🔒 Área liberada</span>
          <h1 className="mt-4 text-[clamp(26px,6vw,38px)] font-black uppercase text-navy">
            Conteúdo <span className="text-pink">Exclusivo</span>
          </h1>
        </div>

        {videos.length > 0 ? (
          <div className="mt-8">
            {current ? (
              <div className="overflow-hidden rounded-3xl border border-line bg-card shadow-soft">
                <div className="aspect-video w-full bg-navy-deep">
                  <iframe
                    key={current.yt}
                    className="h-full w-full"
                    src={`https://www.youtube-nocookie.com/embed/${current.yt}?modestbranding=1&rel=0&iv_load_policy=3&color=white&autoplay=1`}
                    title={current.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold text-navy">{current.title}</p>
                </div>
              </div>
            ) : null}

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {videos.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setCurrent(v)}
                  className={`overflow-hidden rounded-2xl border text-left ${
                    current?.id === v.id ? "border-pink" : "border-line"
                  } bg-card shadow-soft`}
                >
                  <div className="aspect-video w-full overflow-hidden bg-navy-deep">
                    <img
                      src={youtubeThumb(v.yt)}
                      alt={v.title}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="p-2 text-xs font-semibold leading-snug text-ink">{v.title}</p>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {moldes.length > 0 ? (
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {moldes.map((m) => (
              <div
                key={m.id}
                className="overflow-hidden rounded-2xl border border-line bg-card shadow-soft"
              >
                <div className="flex h-28 items-center justify-center bg-surface-alt">
                  {m.cover_path ? (
                    <img
                      src={materiaisUrl(m.cover_path)}
                      alt={m.title}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <span className="text-3xl">🧶</span>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-display text-sm font-extrabold leading-tight text-navy">
                    {m.title}
                  </p>
                  {m.file_path ? (
                    <a
                      href={materiaisUrl(m.file_path)}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 block rounded-xl bg-pink py-2 text-center text-xs font-bold text-navy"
                    >
                      Abrir
                    </a>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {videos.length === 0 && moldes.length === 0 ? (
          <p className="mt-10 text-center text-sm text-muted-foreground">
            Ainda não tem conteúdo exclusivo publicado. Volte em breve!
          </p>
        ) : null}
      </div>
    </main>
  );
}
