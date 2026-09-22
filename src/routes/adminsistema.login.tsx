import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { loginAdmin } from "@/api/admin";

export const Route = createFileRoute("/adminsistema/login")({
  head: () => ({
    meta: [{ title: "Login — Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await loginAdmin({ data: { password } });
      await navigate({ to: "/adminsistema" });
    } catch {
      setError("Senha incorreta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-alt px-5">
      <form
        onSubmit={submit}
        className="w-full max-w-[360px] rounded-3xl border border-line bg-card p-6 shadow-pop"
      >
        <p className="font-display text-xl font-black uppercase text-navy">Admin</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Crochê da Rosenilda
        </p>

        <label className="mt-6 block text-sm font-bold text-navy">Senha</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          className="mt-2 w-full rounded-2xl border border-line bg-surface-alt px-4 py-3 outline-none focus:border-pink"
        />

        {error ? <p className="mt-3 text-sm font-semibold text-destructive">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-2xl bg-pink px-5 py-3 font-display font-extrabold text-navy disabled:opacity-60"
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}
