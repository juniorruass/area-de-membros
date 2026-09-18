// Isomorfico (server + browser) — so usa a URL publica, sem segredo nenhum.
const BASE = import.meta.env["VITE_SUPABASE_URL"] as string;

export function materiaisUrl(path: string) {
  return `${BASE}/storage/v1/object/public/materiais/${path}`;
}

export function siteUrl(path: string) {
  return `${BASE}/storage/v1/object/public/site/${path}`;
}
