import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ReorderHandle } from "@/components/admin/ReorderHandle";
import { moveId } from "@/lib/reorder";
import {
  checkAdminAuth,
  deleteVideo,
  listVideos,
  reorderItems,
  upsertVideo,
  type VideoRow,
} from "@/api/admin";

export const Route = createFileRoute("/adminsistema/videos")({
  beforeLoad: async () => {
    const { authenticated } = await checkAdminAuth();
    if (!authenticated) throw redirect({ to: "/adminsistema/login" });
  },
  component: VideosAdmin,
});

const CATS = [
  "Aprendendo Crochê em 30 Dias",
  "Sapatinhos de Bebê",
  "Chapéus e Gorros",
  "Vestidos de Crochê Adulto",
  "Moda Praia Biquínis",
  "Bolsas em Crochê",
  "Vestidos Infantis",
] as const;

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
  const [cat, setCat] = useState<string>(CATS[0]);
  const [position, setPosition] = useState("");
  const [exclusive, setExclusive] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);

  const load = async () => setRows(await listVideos());

  useEffect(() => {
    load();
  }, []);

  const edit = (v: VideoRow) => {
    setId(v.id);
    setYt(v.yt);
    setTitle(v.title);
    setCat(v.cat || CATS[0]);
    const group = (rows ?? []).filter((r) => r.cat === v.cat);
    const idx = group.findIndex((r) => r.id === v.id);
    setPosition(idx >= 0 ? String(idx + 1) : "");
    setExclusive(v.exclusive ?? false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setId(undefined);
    setYt("");
    setTitle("");
    setCat(CATS[0]);
    setPosition("");
    setExclusive(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!yt.trim() || !title.trim()) return;
    setSaving(true);
    try {
      const maxOrder = rows && rows.length > 0 ? Math.max(...rows.map((r) => r.sort_order)) : -1;
      const existing = id ? rows?.find((r) => r.id === id) : undefined;
      const { id: savedId } = await upsertVideo({
        data: {
          ...(id ? { id } : {}),
          yt: extractYoutubeId(yt),
          title: title.trim(),
          cat,
          sort_order: existing?.sort_order ?? maxOrder + 1,
          exclusive,
        },
      });

      const freshRows = await listVideos();
      setRows(freshRows);

      if (position.trim()) {
        const group = freshRows.filter((r) => r.cat === cat);
        const from = group.findIndex((r) => r.id === savedId);
        const to = Math.min(Math.max(Number(position) - 1, 0), group.length - 1);
        if (from !== -1 && to !== from && !Number.isNaN(to)) {
          const ids = moveId(
            group.map((r) => r.id),
            from,
            to,
          );
          await reorderItems({ data: { table: "videos", ids } });
        }
      }

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

  const reorder = async (groupRows: VideoRow[], from: number, to: number) => {
    if (to < 0 || to >= groupRows.length || from === to) return;
    const ids = moveId(
      groupRows.map((r) => r.id),
      from,
      to,
    );
    await reorderItems({ data: { table: "videos", ids } });
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
          <div>
            <label className="block text-sm font-bold text-navy">Categoria</label>
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-line bg-surface-alt px-4 py-2.5 outline-none focus:border-pink"
            >
              {CATS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-navy">
              Posição na categoria (opcional)
            </label>
            <input
              type="number"
              min={1}
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Ex: 3"
              className="mt-1 w-full rounded-2xl border border-line bg-surface-alt px-4 py-2.5 outline-none focus:border-pink"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Quem já está nessa posição (e as seguintes) desce uma posição.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:col-span-2">
            <input
              id="video-exclusive"
              type="checkbox"
              checked={exclusive}
              onChange={(e) => setExclusive(e.target.checked)}
              className="size-4"
            />
            <label htmlFor="video-exclusive" className="text-sm font-bold text-navy">
              Conteúdo exclusivo (só aparece pra quem tem telefone liberado)
            </label>
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

      <div className="mt-5 space-y-6">
        {rows === null ? (
          <p className="text-sm text-muted-foreground">Carregando…</p>
        ) : (
          Object.entries(
            rows.reduce<Record<string, VideoRow[]>>((acc, v) => {
              const key = v.cat || "Sem categoria";
              (acc[key] ??= []).push(v);
              return acc;
            }, {}),
          ).map(([groupCat, groupRows]) => (
            <div key={groupCat}>
              <p className="mb-2 font-display text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                {groupCat} ({groupRows.length})
              </p>
              <div className="space-y-2">
                {groupRows.map((v, i) => (
                  <div
                    key={v.id}
                    draggable
                    onDragStart={() => setDragId(v.id)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (dragId) {
                        const from = groupRows.findIndex((r) => r.id === dragId);
                        if (from !== -1) reorder(groupRows, from, i);
                      }
                      setDragId(null);
                    }}
                    className="flex items-center gap-2 rounded-2xl border border-line bg-card p-3 shadow-soft"
                  >
                    <ReorderHandle
                      onUp={() => reorder(groupRows, i, i - 1)}
                      onDown={() => reorder(groupRows, i, i + 1)}
                      canUp={i > 0}
                      canDown={i < groupRows.length - 1}
                      dragProps={{}}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-sm font-extrabold text-navy">
                        {v.exclusive ? "🔒 " : ""}
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
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </AdminShell>
  );
}
