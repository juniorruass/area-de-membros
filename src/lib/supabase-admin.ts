import { createClient } from "@supabase/supabase-js";

// Server-only client. Usa a service_role key — nunca importar isso em
// codigo que roda no browser (componentes "use client" ou client hooks).
export function getSupabaseAdmin() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  if (!url || !key) {
    throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY nao configurados");
  }
  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
