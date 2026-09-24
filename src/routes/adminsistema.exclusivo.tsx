import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  addExclusivePhone,
  checkAdminAuth,
  deleteExclusivePhone,
  listExclusivePhones,
  type ExclusivePhoneRow,
} from "@/api/admin";

export const Route = createFileRoute("/adminsistema/exclusivo")({
  beforeLoad: async () => {
    const { authenticated } = await checkAdminAuth();
    if (!authenticated) throw redirect({ to: "/adminsistema/login" });
  },
  component: ExclusivoAdmin,
});

function ExclusivoAdmin() {
  const [rows, setRows] = useState<ExclusivePhoneRow[] | null>(null);
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => setRows(await listExclusivePhones());

  useEffect(() => {
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await addExclusivePhone({ data: { phone, note: note.trim() || null } });
      setPhone("");
      setNote("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao liberar telefone");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Remover a liberação deste telefone?")) return;
    await deleteExclusivePhone({ data: { id } });
    await load();
  };

  return (
    <AdminShell title="Conteúdo Exclusivo">
      <div className="rounded-3xl border border-line bg-card p-5 shadow-soft">
        <p className="text-sm text-muted-foreground">
          Marque vídeos e moldes como "exclusivo" nas respectivas telas. Aqui você libera o
          telefone de quem pode acessar esse conteúdo em{" "}
          <span className="font-bold text-navy">/exclusivo</span>.
        </p>
      </div>

      <form
        onSubmit={submit}
        className="mt-5 rounded-3xl border border-line bg-card p-5 shadow-soft"
      >
        <p className="font-display text-base font-extrabold text-navy">Liberar telefone</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-bold text-navy">Telefone (com DDD)</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="73 99999-9999"
              className="mt-1 w-full rounded-2xl border border-line bg-surface-alt px-4 py-2.5 outline-none focus:border-pink"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-navy">Observação (opcional)</label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ex: nome da cliente"
              className="mt-1 w-full rounded-2xl border border-line bg-surface-alt px-4 py-2.5 outline-none focus:border-pink"
            />
          </div>
        </div>

        {error ? <p className="mt-3 text-sm font-semibold text-destructive">{error}</p> : null}

        <button
          type="submit"
          disabled={saving}
          className="mt-4 rounded-2xl bg-pink px-5 py-2.5 font-display font-extrabold text-navy disabled:opacity-60"
        >
          {saving ? "Liberando…" : "Liberar acesso"}
        </button>
      </form>

      <div className="mt-5 space-y-2">
        {rows === null ? (
          <p className="text-sm text-muted-foreground">Carregando…</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum telefone liberado ainda.</p>
        ) : (
          rows.map((r) => (
            <div
              key={r.id}
              className="flex items-center gap-2 rounded-2xl border border-line bg-card p-3 shadow-soft"
            >
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-extrabold text-navy">{r.phone}</p>
                {r.note ? (
                  <p className="truncate text-xs text-muted-foreground">{r.note}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => remove(r.id)}
                className="shrink-0 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-1.5 text-xs font-bold text-destructive"
              >
                Remover
              </button>
            </div>
          ))
        )}
      </div>
    </AdminShell>
  );
}
