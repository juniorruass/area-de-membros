import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ReorderHandle } from "@/components/admin/ReorderHandle";
import { moveId } from "@/lib/reorder";
import {
  checkAdminAuth,
  deleteWinner,
  listWinners,
  reorderItems,
  upsertWinner,
  type WinnerRow,
} from "@/api/admin";

export const Route = createFileRoute("/admin/sorteio")({
  beforeLoad: async () => {
    const { authenticated } = await checkAdminAuth();
    if (!authenticated) throw redirect({ to: "/admin/login" });
  },
  component: SorteioAdmin,
});

function SorteioAdmin() {
  const [rows, setRows] = useState<WinnerRow[] | null>(null);
  const [id, setId] = useState<string | undefined>(undefined);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [prize, setPrize] = useState("");
  const [saving, setSaving] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);

  const load = async () => setRows(await listWinners());

  useEffect(() => {
    load();
  }, []);

  const edit = (w: WinnerRow) => {
    setId(w.id);
    setName(w.name);
    setCity(w.city);
    setPrize(w.prize);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setId(undefined);
    setName("");
    setCity("");
    setPrize("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !city.trim() || !prize.trim()) return;
    setSaving(true);
    try {
      const maxOrder = rows && rows.length > 0 ? Math.max(...rows.map((r) => r.sort_order)) : -1;
      const existing = id ? rows?.find((r) => r.id === id) : undefined;
      await upsertWinner({
        data: {
          ...(id ? { id } : {}),
          name: name.trim(),
          city: city.trim(),
          prize: prize.trim(),
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
    if (!confirm("Excluir essa ganhadora?")) return;
    await deleteWinner({ data: { id: rid } });
    await load();
  };

  const reorder = async (from: number, to: number) => {
    if (!rows || to < 0 || to >= rows.length || from === to) return;
    const ids = moveId(
      rows.map((r) => r.id),
      from,
      to,
    );
    const byId = new Map(rows.map((r) => [r.id, r]));
    setRows(ids.map((id) => byId.get(id)!));
    await reorderItems({ data: { table: "sorteio_winners", ids } });
    await load();
  };

  return (
    <AdminShell title="Sorteio">
      <p className="text-sm text-muted-foreground">
        A cada 7 dias o site mostra a próxima ganhadora dessa lista, em ordem, e volta pro início
        quando chega no fim.
      </p>

      <form
        onSubmit={submit}
        className="mt-4 rounded-3xl border border-line bg-card p-5 shadow-soft"
      >
        <p className="font-display text-base font-extrabold text-navy">
          {id ? "Editar ganhadora" : "Nova ganhadora"}
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-bold text-navy">Nome</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-line bg-surface-alt px-4 py-2.5 outline-none focus:border-pink"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-navy">Cidade / UF</label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Feira de Santana / BA"
              className="mt-1 w-full rounded-2xl border border-line bg-surface-alt px-4 py-2.5 outline-none focus:border-pink"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-navy">O que ganhou</label>
            <input
              value={prize}
              onChange={(e) => setPrize(e.target.value)}
              placeholder="a máquina, os aviamentos e os R$ 500"
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
            {saving ? "Salvando…" : id ? "Salvar alterações" : "Adicionar"}
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
          rows.map((w, i) => (
            <div
              key={w.id}
              draggable
              onDragStart={() => setDragId(w.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragId) {
                  const from = rows.findIndex((r) => r.id === dragId);
                  if (from !== -1) reorder(from, i);
                }
                setDragId(null);
              }}
              className="flex items-center gap-2 rounded-2xl border border-line bg-card p-3 shadow-soft"
            >
              <ReorderHandle
                onUp={() => reorder(i, i - 1)}
                onDown={() => reorder(i, i + 1)}
                canUp={i > 0}
                canDown={i < rows.length - 1}
                dragProps={{}}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-sm font-extrabold text-navy">
                  {w.name} · {w.city}
                </p>
                <p className="truncate text-xs text-muted-foreground">Ganhou {w.prize}</p>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <button
                  type="button"
                  onClick={() => edit(w)}
                  className="rounded-xl border border-line bg-surface-alt px-3 py-1.5 text-xs font-bold text-navy"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => remove(w.id)}
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
