import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  checkAdminAuth,
  deleteVideo,
  listVideos,
  upsertVideo,
  type VideoRow,
} from "@/api/admin";

export const Route = createFileRoute("/admin/videos")({
  beforeLoad: async () => {
    const { authenticated } = await checkAdminAuth();
    if (!authenticated) throw redirect({ to: "/admin/login" });
  },
  component: VideosAdmin,
});

function extractYoutubeId(input: string) {
  const trimmed = input.trim();
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/,
  ];
  for (const re of patterns) {
    const m = trimmed.match(re);
    if (m?.[1]) return m[1];
  }
  return trimmed;
}

function VideosAdmin() {
  const [rows, setRows] = useState<VideoRow[] | null>(null);
  const [id, setId] = useState<string | undefined>(undefined);
  const [yt, setYt] = useState("");
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => setRows(await listVideos());

  useEffect(() => {
    load();
  }, []);

  const edit = (v: VideoRow) => {
    setId(v.id);
    setYt(v.yt);
    setTitle(v.title);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setId(undefined);
    setYt("");
    setTitle("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!yt.trim() || !title.trim()) return;
    setSaving(true);
    try {
      const maxOrder = rows && rows.length > 0 ? Math.max(...rows.map((r) => r.sort_order)) : -1;
      const existing = id ? rows?.find((r) => r.id === id) : undefined;
      await upsertVideo({
        data: {
          ...(id ? { id } : {}),
          yt: extractYoutubeId(yt),
          title: title.trim(),
          sort_order: existing?.sort_order ?? maxOrder + 1,
        },
      });
      resetForm();
      await load();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (rid: string) => {
    if (!confirm("Excluir esta aula?")) return;
    await deleteVideo({ data: { id: rid } });
    await load();
  };

  return (
    <AdminShell title="Vídeos">
      <form onSubmit={submit} className="rounded-3xl border border-line bg-card p-5 shadow-soft">
        <p className="font-display text-base font-extrabold text-navy">
          {id ? "Editar aula" : "Nova aula"}
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-bold text-navy">Link ou ID do YouTube</label>
            <input
              value={yt}
              onChange={(e) => setYt(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="mt-1 w-full rounded-2xl border border-line bg-surface-alt px-4 py-2.5 outline-none focus:border-pink"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-navy">Título da aula</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Aula 01"
              className="mt-1 w-full rounded-2xl border border-line bg-surface-alt px-4 py-2.5 outline-none focus:border-pink"
              required
            />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-2xl bg-pink px-5 py-2.5 font-display font-extrabold text-navy disabled:opacity-60"
          >
            {saving ? "Salvando…" : id ? "Salvar alterações" : "Adicionar aula"}
          </button>
          {id ? (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-2xl border-2 border-navy px-5 py-2.5 font-display font-extrabold text-navy"
            >
              Cancelar edição
            </button>
          ) : null}
        </div>
      </form>

      <div className="mt-5 space-y-2">
        {rows === null ? (
          <p className="text-sm text-muted-foreground">Carregando…</p>
        ) : (
          rows.map((v) => (
            <div
              key={v.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-card p-3 shadow-soft"
            >
              <div className="min-w-0">
                <p className="truncate font-display text-sm font-extrabold text-navy">
                  {v.title}
                </p>
                <p className="truncate text-xs text-muted-foreground">{v.yt}</p>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <button
                  type="button"
                  onClick={() => edit(v)}
                  className="rounded-xl border border-line bg-surface-alt px-3 py-1.5 text-xs font-bold text-navy"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => remove(v.id)}
                  className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-1.5 text-xs font-bold text-destructive"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminShell>
  );
}
