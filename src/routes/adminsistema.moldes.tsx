import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ReorderHandle } from "@/components/admin/ReorderHandle";
import { materiaisUrl } from "@/lib/storage-url";
import { moveId } from "@/lib/reorder";
import {
  checkAdminAuth,
  deleteMolde,
  listMoldes,
  reorderItems,
  uploadFile,
  upsertMolde,
  type MoldeRow,
} from "@/api/admin";

export const Route = createFileRoute("/adminsistema/moldes")({
  beforeLoad: async () => {
    const { authenticated } = await checkAdminAuth();
    if (!authenticated) throw redirect({ to: "/adminsistema/login" });
  },
  component: MoldesAdmin,
});

const CATS = [
  "Bolsas e Mochilas",
  "Roupas Infantis",
  "Almofadinhas",
  "Tapetes",
  "Amigurumis",
  "Bônus",
] as const;

function slugify(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const emptyForm = {
  id: undefined as string | undefined,
  cat: CATS[0] as string,
  title: "",
  pages: "" as string,
  kind: "pdf" as "pdf" | "imagem",
};

function MoldesAdmin() {
  const [rows, setRows] = useState<MoldeRow[] | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [coverInput, setCoverInput] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);

  const load = async () => setRows(await listMoldes());

  useEffect(() => {
    load();
  }, []);

  const edit = (m: MoldeRow) => {
    setForm({
      id: m.id,
      cat: m.cat,
      title: m.title,
      pages: m.pages === null ? "" : String(m.pages),
      kind: (m.kind as "pdf" | "imagem") ?? "pdf",
    });
    setFileInput(null);
    setCoverInput(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setFileInput(null);
    setCoverInput(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const existing = form.id ? rows?.find((r) => r.id === form.id) : undefined;
      let filePath = existing?.file_path ?? null;
      let coverPath = existing?.cover_path ?? null;
      const slug = slugify(form.title);

      if (fileInput) {
        const ext = fileInput.name.split(".").pop() || "bin";
        const path = `${slug}.${ext}`;
        const fd = new FormData();
        fd.set("file", fileInput);
        fd.set("bucket", "materiais");
        fd.set("path", path);
        await uploadFile({ data: fd });
        filePath = path;
        if (form.kind === "imagem" && !coverInput) coverPath = path;
      }

      if (coverInput) {
        const ext = coverInput.name.split(".").pop() || "png";
        const path = `capas/${slug}.${ext}`;
        const fd = new FormData();
        fd.set("file", coverInput);
        fd.set("bucket", "materiais");
        fd.set("path", path);
        await uploadFile({ data: fd });
        coverPath = path;
      }

      const maxOrder = rows && rows.length > 0 ? Math.max(...rows.map((r) => r.sort_order)) : -1;

      await upsertMolde({
        data: {
          ...(form.id ? { id: form.id } : {}),
          cat: form.cat,
          title: form.title.trim(),
          pages: form.pages === "" ? null : Number(form.pages),
          file_path: filePath,
          cover_path: coverPath,
          kind: form.kind,
          sort_order: existing?.sort_order ?? maxOrder + 1,
        },
      });

      resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Excluir este molde?")) return;
    await deleteMolde({ data: { id } });
    await load();
  };

  const reorder = async (groupRows: MoldeRow[], from: number, to: number) => {
    if (to < 0 || to >= groupRows.length || from === to) return;
    const ids = moveId(
      groupRows.map((r) => r.id),
      from,
      to,
    );
    await reorderItems({ data: { table: "moldes", ids } });
    await load();
  };

  return (
    <AdminShell title="Moldes">
      <form
        onSubmit={submit}
        className="rounded-3xl border border-line bg-card p-5 shadow-soft"
      >
        <p className="font-display text-base font-extrabold text-navy">
          {form.id ? "Editar molde" : "Novo molde"}
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-bold text-navy">Título</label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="mt-1 w-full rounded-2xl border border-line bg-surface-alt px-4 py-2.5 outline-none focus:border-pink"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-navy">Categoria</label>
            <select
              value={form.cat}
              onChange={(e) => setForm((f) => ({ ...f, cat: e.target.value }))}
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
            <label className="block text-sm font-bold text-navy">Páginas (opcional)</label>
            <input
              type="number"
              value={form.pages}
              onChange={(e) => setForm((f) => ({ ...f, pages: e.target.value }))}
              className="mt-1 w-full rounded-2xl border border-line bg-surface-alt px-4 py-2.5 outline-none focus:border-pink"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-navy">Tipo do arquivo</label>
            <select
              value={form.kind}
              onChange={(e) => setForm((f) => ({ ...f, kind: e.target.value as "pdf" | "imagem" }))}
              className="mt-1 w-full rounded-2xl border border-line bg-surface-alt px-4 py-2.5 outline-none focus:border-pink"
            >
              <option value="pdf">PDF</option>
              <option value="imagem">Imagem</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-navy">
              Arquivo {form.id ? "(opcional — só se for trocar)" : ""}
            </label>
            <input
              type="file"
              onChange={(e) => setFileInput(e.target.files?.[0] ?? null)}
              className="mt-1 w-full text-sm"
              required={!form.id}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-navy">
              Capa (opcional — se o arquivo for PDF, mande uma imagem de capa)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverInput(e.target.files?.[0] ?? null)}
              className="mt-1 w-full text-sm"
            />
          </div>
        </div>

        {error ? <p className="mt-3 text-sm font-semibold text-destructive">{error}</p> : null}

        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-2xl bg-pink px-5 py-2.5 font-display font-extrabold text-navy disabled:opacity-60"
          >
            {saving ? "Salvando…" : form.id ? "Salvar alterações" : "Adicionar molde"}
          </button>
          {form.id ? (
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

      <div className="mt-6 space-y-8">
        {rows === null ? (
          <p className="text-sm text-muted-foreground">Carregando…</p>
        ) : (
          Object.entries(
            rows.reduce<Record<string, MoldeRow[]>>((acc, m) => {
              const key = m.cat || "Sem categoria";
              (acc[key] ??= []).push(m);
              return acc;
            }, {}),
          ).map(([groupCat, groupRows]) => (
            <div key={groupCat}>
              <p className="mb-2 font-display text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                {groupCat} ({groupRows.length})
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {groupRows.map((m, i) => (
                  <div
                    key={m.id}
                    draggable
                    onDragStart={() => setDragId(m.id)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (dragId) {
                        const from = groupRows.findIndex((r) => r.id === dragId);
                        if (from !== -1) reorder(groupRows, from, i);
                      }
                      setDragId(null);
                    }}
                    className="overflow-hidden rounded-2xl border border-line bg-card shadow-soft"
                  >
                    <div className="flex items-center justify-center border-b border-line bg-surface-alt py-0.5">
                      <ReorderHandle
                        vertical={false}
                        onUp={() => reorder(groupRows, i, i - 1)}
                        onDown={() => reorder(groupRows, i, i + 1)}
                        canUp={i > 0}
                        canDown={i < groupRows.length - 1}
                        dragProps={{}}
                      />
                    </div>
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
                      <p className="mt-1 text-xs text-muted-foreground">
                        {m.cat}
                        {m.pages ? ` · ${m.pages}p` : ""}
                      </p>
                      <div className="mt-2 grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => edit(m)}
                          className="rounded-xl border border-line bg-surface-alt py-1.5 text-xs font-bold text-navy"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(m.id)}
                          className="rounded-xl border border-destructive/30 bg-destructive/5 py-1.5 text-xs font-bold text-destructive"
                        >
                          Excluir
                        </button>
                      </div>
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
