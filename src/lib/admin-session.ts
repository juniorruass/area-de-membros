import { getSession, useSession } from "@tanstack/react-start/server";

type AdminSessionData = { isAdmin?: boolean };

function config() {
  const password = process.env["SESSION_SECRET"];
  if (!password) throw new Error("SESSION_SECRET nao configurado");
  return { name: "admin_session", password, maxAge: 60 * 60 * 24 * 7 };
}

// Somente leitura — nao inicia/persiste sessao nova.
export async function readAdminSession() {
  return getSession<AdminSessionData>(config());
}

// Leitura + escrita (update/clear) — usar no login/logout.
export async function useAdminSession() {
  return useSession<AdminSessionData>(config());
}

export async function isAdminAuthenticated() {
  const session = await readAdminSession();
  return session.data.isAdmin === true;
}
