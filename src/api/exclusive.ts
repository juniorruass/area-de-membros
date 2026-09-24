import { createServerFn } from "@tanstack/react-start";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { readExclusiveSession, useExclusiveSession } from "@/lib/exclusive-session";
import { normalizePhone } from "@/lib/phone";
import type { PublicMolde, PublicVideo } from "@/api/public-data";

export const unlockExclusive = createServerFn({ method: "POST" })
  .validator((data: { phone: string }) => data)
  .handler(async ({ data }) => {
    const phone = normalizePhone(data.phone);
    if (!phone) throw new Error("Telefone invalido");

    const { data: row, error } = await getSupabaseAdmin()
      .from("exclusive_phones")
      .select("id")
      .eq("phone", phone)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) return { ok: false as const };

    const session = await useExclusiveSession();
    await session.update({ phone });
    return { ok: true as const };
  });

export const getExclusiveContent = createServerFn({ method: "GET" }).handler(async () => {
  const session = await readExclusiveSession();
  if (!session.data.phone) {
    return { authenticated: false as const, moldes: [] as PublicMolde[], videos: [] as PublicVideo[] };
  }

  const supabase = getSupabaseAdmin();
  const [moldesRes, videosRes] = await Promise.all([
    supabase
      .from("moldes")
      .select("id, cat, title, pages, file_path, cover_path, kind")
      .eq("exclusive", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("videos")
      .select("id, yt, title, cat")
      .eq("exclusive", true)
      .order("sort_order", { ascending: true }),
  ]);
  if (moldesRes.error) throw new Error(moldesRes.error.message);
  if (videosRes.error) throw new Error(videosRes.error.message);

  return {
    authenticated: true as const,
    moldes: moldesRes.data as PublicMolde[],
    videos: videosRes.data as PublicVideo[],
  };
});
