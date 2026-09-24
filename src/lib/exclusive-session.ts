import { getSession, useSession } from "@tanstack/react-start/server";

type ExclusiveSessionData = { phone?: string };

function config() {
  const password = process.env["SESSION_SECRET"];
  if (!password) throw new Error("SESSION_SECRET nao configurado");
  return { name: "exclusive_session", password, maxAge: 60 * 60 * 24 * 90 };
}

// Somente leitura — nao inicia/persiste sessao nova.
export async function readExclusiveSession() {
  return getSession<ExclusiveSessionData>(config());
}

// Leitura + escrita (unlock/logout) — usar so no unlockExclusive.
export async function useExclusiveSession() {
  return useSession<ExclusiveSessionData>(config());
}

export async function isExclusiveAuthenticated() {
  const session = await readExclusiveSession();
  return Boolean(session.data.phone);
}
