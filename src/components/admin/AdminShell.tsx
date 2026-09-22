import { Link, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { logoutAdmin } from "@/api/admin";

const TABS = [
  { to: "/adminsistema/moldes", label: "Moldes" },
  { to: "/adminsistema/videos", label: "Vídeos" },
  { to: "/adminsistema/sorteio", label: "Sorteio" },
  { to: "/adminsistema/configuracoes", label: "Configurações" },
] as const;

export function AdminShell({ title, children }: { title: string; children: ReactNode }) {
  const navigate = useNavigate();

  const sair = async () => {
    await logoutAdmin();
    await navigate({ to: "/adminsistema/login" });
  };

  return (
    <main className="min-h-screen bg-surface-alt pb-16">
      <header className="border-b border-line bg-card px-5 py-4">
        <div className="mx-auto flex max-w-[960px] items-center justify-between">
          <p className="font-display text-lg font-black uppercase text-navy">Admin</p>
          <button
            type="button"
            onClick={sair}
            className="text-sm font-semibold text-muted-foreground underline"
          >
            Sair
          </button>
        </div>
        <nav className="mx-auto mt-4 flex max-w-[960px] flex-wrap gap-2">
          {TABS.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className="pill border border-line bg-surface-alt text-navy"
              activeProps={{ className: "pill border border-navy bg-navy text-primary-foreground" }}
            >
              {t.label}
            </Link>
          ))}
        </nav>
      </header>

      <div className="mx-auto max-w-[960px] px-5 py-6">
        <h1 className="font-display text-2xl font-black uppercase text-navy">{title}</h1>
        <div className="mt-5">{children}</div>
      </div>
    </main>
  );
}
