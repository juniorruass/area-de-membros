import { createServerFn } from "@tanstack/react-start";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { isAdminAuthenticated, useAdminSession } from "@/lib/admin-session";
import { normalizePhone } from "@/lib/phone";

function requireAdmin(ok: boolean) {
  if (!ok) throw new Error("unauthorized");
}

// ---------- Auth ----------

export const checkAdminAuth = createServerFn({ method: "GET" }).handler(async () => {
  return { authenticated: await isAdminAuthenticated() };
});

export const loginAdmin = createServerFn({ method: "POST" })
  .validator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    const expected = process.env["ADMIN_PASSWORD"];
    if (!expected || data.password !== expected) {
      throw new Error("Senha incorreta");
    }
    const session = await useAdminSession();
    await session.update({ isAdmin: true });
    return { ok: true };
  });

export const logoutAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useAdminSession();
  await session.clear();
  return { ok: true };
});

// ---------- Moldes ----------

export type MoldeRow = {
  id: string;
  cat: string;
  title: string;
  pages: number | null;
  file_path: string | null;
  cover_path: string | null;
  kind: string;
  sort_order: number;
  exclusive: boolean;
};

export const listMoldes = createServerFn({ method: "GET" }).handler(async () => {
  requireAdmin(await isAdminAuthenticated());
  const { data, error } = await getSupabaseAdmin()
    .from("moldes")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data as MoldeRow[];
});

export const upsertMolde = createServerFn({ method: "POST" })
  .validator(
    (data: {
      id?: string;
      cat: string;
      title: string;
      pages: number | null;
      file_path: string | null;
      cover_path: string | null;
      kind: string;
      sort_order: number;
      exclusive: boolean;
    }) => data,
  )
  .handler(async ({ data }) => {
    requireAdmin(await isAdminAuthenticated());
    const { id, ...rest } = data;
    const supabase = getSupabaseAdmin();
    if (id) {
      const { error } = await supabase.from("moldes").update(rest).eq("id", id);
      if (error) throw new Error(error.message);
      return { id };
    }
    const { data: inserted, error } = await supabase
      .from("moldes")
      .insert(rest)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: inserted.id as string };
  });

export const deleteMolde = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    requireAdmin(await isAdminAuthenticated());
    const { error } = await getSupabaseAdmin().from("moldes").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Videos ----------

export type VideoRow = {
  id: string;
  yt: string;
  title: string;
  cat: string;
  sort_order: number;
  exclusive: boolean;
};

export const listVideos = createServerFn({ method: "GET" }).handler(async () => {
  requireAdmin(await isAdminAuthenticated());
  const { data, error } = await getSupabaseAdmin()
    .from("videos")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data as VideoRow[];
});

export const upsertVideo = createServerFn({ method: "POST" })
  .validator(
    (data: {
      id?: string;
      yt: string;
      title: string;
      cat: string;
      sort_order: number;
      exclusive: boolean;
    }) => data,
  )
  .handler(async ({ data }) => {
    requireAdmin(await isAdminAuthenticated());
    const { id, ...rest } = data;
    const supabase = getSupabaseAdmin();
    if (id) {
      const { error } = await supabase.from("videos").update(rest).eq("id", id);
      if (error) throw new Error(error.message);
      return { id };
    }
    const { data: inserted, error } = await supabase
      .from("videos")
      .insert(rest)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: inserted.id as string };
  });

export const deleteVideo = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    requireAdmin(await isAdminAuthenticated());
    const { error } = await getSupabaseAdmin().from("videos").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Sorteio winners ----------

export type WinnerRow = {
  id: string;
  name: string;
  city: string;
  prize: string;
  sort_order: number;
};

export const listWinners = createServerFn({ method: "GET" }).handler(async () => {
  requireAdmin(await isAdminAuthenticated());
  const { data, error } = await getSupabaseAdmin()
    .from("sorteio_winners")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data as WinnerRow[];
});

export const upsertWinner = createServerFn({ method: "POST" })
  .validator(
    (data: { id?: string; name: string; city: string; prize: string; sort_order: number }) =>
      data,
  )
  .handler(async ({ data }) => {
    requireAdmin(await isAdminAuthenticated());
    const { id, ...rest } = data;
    const supabase = getSupabaseAdmin();
    if (id) {
      const { error } = await supabase.from("sorteio_winners").update(rest).eq("id", id);
      if (error) throw new Error(error.message);
      return { id };
    }
    const { data: inserted, error } = await supabase
      .from("sorteio_winners")
      .insert(rest)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: inserted.id as string };
  });

export const deleteWinner = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    requireAdmin(await isAdminAuthenticated());
    const { error } = await getSupabaseAdmin().from("sorteio_winners").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Telefones liberados (conteudo exclusivo) ----------

export type ExclusivePhoneRow = {
  id: string;
  phone: string;
  note: string | null;
  created_at: string;
};

export const listExclusivePhones = createServerFn({ method: "GET" }).handler(async () => {
  requireAdmin(await isAdminAuthenticated());
  const { data, error } = await getSupabaseAdmin()
    .from("exclusive_phones")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data as ExclusivePhoneRow[];
});

export const addExclusivePhone = createServerFn({ method: "POST" })
  .validator((data: { phone: string; note: string | null }) => data)
  .handler(async ({ data }) => {
    requireAdmin(await isAdminAuthenticated());
    const phone = normalizePhone(data.phone);
    if (!phone) throw new Error("Telefone invalido");
    const { error } = await getSupabaseAdmin()
      .from("exclusive_phones")
      .insert({ phone, note: data.note });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteExclusivePhone = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    requireAdmin(await isAdminAuthenticated());
    const { error } = await getSupabaseAdmin()
      .from("exclusive_phones")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Settings ----------

export const listSettings = createServerFn({ method: "GET" }).handler(async () => {
  requireAdmin(await isAdminAuthenticated());
  const { data, error } = await getSupabaseAdmin().from("settings").select("*");
  if (error) throw new Error(error.message);
  const map: Record<string, string> = {};
  for (const row of data as { key: string; value: string }[]) map[row.key] = row.value;
  return map;
});

export const updateSettings = createServerFn({ method: "POST" })
  .validator((data: Record<string, string>) => data)
  .handler(async ({ data }) => {
    requireAdmin(await isAdminAuthenticated());
    const rows = Object.entries(data).map(([key, value]) => ({ key, value }));
    const { error } = await getSupabaseAdmin().from("settings").upsert(rows);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Reordering ----------

const REORDERABLE_TABLES = ["moldes", "videos", "sorteio_winners"] as const;
type ReorderTable = (typeof REORDERABLE_TABLES)[number];

// Re-assigns sort_order among exactly the given ids, reusing the set of
// sort_order values those ids already hold. This reorders them relative to
// each other without disturbing their position relative to any other rows
// (e.g. other categories) that share the same sort_order sequence.
export const reorderItems = createServerFn({ method: "POST" })
  .validator((data: { table: ReorderTable; ids: string[] }) => data)
  .handler(async ({ data }) => {
    requireAdmin(await isAdminAuthenticated());
    if (!REORDERABLE_TABLES.includes(data.table)) throw new Error("Tabela invalida");
    const supabase = getSupabaseAdmin();

    const { data: rows, error: selErr } = await supabase
      .from(data.table)
      .select("id, sort_order")
      .in("id", data.ids);
    if (selErr) throw new Error(selErr.message);

    const orders = (rows as { id: string; sort_order: number }[])
      .map((r) => r.sort_order)
      .sort((a, b) => a - b);

    const results = await Promise.all(
      data.ids.map((id, i) => supabase.from(data.table).update({ sort_order: orders[i] }).eq("id", id)),
    );
    const failed = results.find((r) => r.error);
    if (failed?.error) throw new Error(failed.error.message);
    return { ok: true };
  });

// ---------- Storage upload ----------

export const uploadFile = createServerFn({ method: "POST" })
  .validator((data: FormData) => data)
  .handler(async ({ data }) => {
    requireAdmin(await isAdminAuthenticated());
    const file = data.get("file");
    const bucket = String(data.get("bucket") ?? "materiais");
    const path = String(data.get("path") ?? "");
    if (!(file instanceof File) || !path) throw new Error("arquivo ou caminho invalido");

    const bytes = new Uint8Array(await file.arrayBuffer());
    const { error } = await getSupabaseAdmin()
      .storage.from(bucket)
      .upload(path, bytes, { contentType: file.type, upsert: true });
    if (error) throw new Error(error.message);
    return { path };
  });
