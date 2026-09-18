import { createServerFn } from "@tanstack/react-start";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export type PublicMolde = {
  id: string;
  cat: string;
  title: string;
  pages: number | null;
  file_path: string | null;
  cover_path: string | null;
  kind: string;
};

export type PublicVideo = { id: string; yt: string; title: string; cat: string };

export type PublicWinner = { name: string; city: string; prize: string };

export type PublicSettings = {
  pix_key: string;
  pix_name: string;
  suporte_whatsapp: string;
  suporte_whatsapp_label: string;
  banner_url: string;
};

export const getPublicData = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getSupabaseAdmin();

  const [moldesRes, videosRes, winnersRes, settingsRes] = await Promise.all([
    supabase
      .from("moldes")
      .select("id, cat, title, pages, file_path, cover_path, kind")
      .order("sort_order", { ascending: true }),
    supabase.from("videos").select("id, yt, title, cat").order("sort_order", { ascending: true }),
    supabase
      .from("sorteio_winners")
      .select("name, city, prize")
      .order("sort_order", { ascending: true }),
    supabase.from("settings").select("key, value"),
  ]);

  if (moldesRes.error) throw new Error(moldesRes.error.message);
  if (videosRes.error) throw new Error(videosRes.error.message);
  if (winnersRes.error) throw new Error(winnersRes.error.message);
  if (settingsRes.error) throw new Error(settingsRes.error.message);

  const settingsMap: Record<string, string> = {};
  for (const row of settingsRes.data as { key: string; value: string }[]) {
    settingsMap[row.key] = row.value;
  }

  const winners = winnersRes.data as PublicWinner[];
  const winner = pickCurrentWinner(winners);

  return {
    moldes: moldesRes.data as PublicMolde[],
    videos: videosRes.data as PublicVideo[],
    settings: {
      pix_key: settingsMap["pix_key"] ?? "",
      pix_name: settingsMap["pix_name"] ?? "",
      suporte_whatsapp: settingsMap["suporte_whatsapp"] ?? "",
      suporte_whatsapp_label: settingsMap["suporte_whatsapp_label"] ?? "",
      banner_url: settingsMap["banner_url"] ?? "",
    } satisfies PublicSettings,
    winner,
  };
});

const REFERENCE_DATE = new Date("2025-01-06T00:00:00").getTime();
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function pickCurrentWinner(winners: PublicWinner[]): PublicWinner | null {
  if (winners.length === 0) return null;
  const weeksPassed = Math.floor((Date.now() - REFERENCE_DATE) / WEEK_MS);
  const index = ((weeksPassed % winners.length) + winners.length) % winners.length;
  return winners[index]!;
}
