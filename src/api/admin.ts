import { createServerFn } from "@tanstack/react-start";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { isAdminAuthenticated, useAdminSession } from "@/lib/admin-session";

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

export type VideoRow = { id: string; yt: string; title: string; cat: string; sort_order: number };

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
    (data: { id?: string; yt: string; title: string; cat: string; sort_order: number }) => data,
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
