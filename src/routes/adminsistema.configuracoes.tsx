import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { siteUrl } from "@/lib/storage-url";
import { checkAdminAuth, listSettings, updateSettings, uploadFile } from "@/api/admin";

export const Route = createFileRoute("/adminsistema/configuracoes")({
  beforeLoad: async () => {
    const { authenticated } = await checkAdminAuth();
    if (!authenticated) throw redirect({ to: "/adminsistema/login" });
  },
  component: ConfiguracoesAdmin,
});

function ConfiguracoesAdmin() {
  const [loaded, setLoaded] = useState(false);
  const [pixKey, setPixKey] = useState("");
  const [pixName, setPixName] = useState("");
  const [whats, setWhats] = useState("");
  const [whatsLabel, setWhatsLabel] = useState("");
  const [groupUrl, setGroupUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    listSettings().then((s) => {
      setPixKey(s["pix_key"] ?? "");
      setPixName(s["pix_name"] ?? "");
      setWhats(s["suporte_whatsapp"] ?? "");
      setWhatsLabel(s["suporte_whatsapp_label"] ?? "");
      setGroupUrl(s["whatsapp_group_url"] ?? "");
      setBannerUrl(s["banner_url"] ?? "");
      setLoaded(true);
    });
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      let banner = bannerUrl;
      if (bannerFile) {
        const ext = bannerFile.name.split(".").pop() || "jpg";
        const path = `banner-topo.${ext}`;
        const fd = new FormData();
        fd.set("file", bannerFile);
        fd.set("bucket", "site");
        fd.set("path", path);
        await uploadFile({ data: fd });
        banner = path;
      }
      await updateSettings({
        data: {
          pix_key: pixKey.trim(),
          pix_name: pixName.trim(),
          suporte_whatsapp: whats.trim(),
          suporte_whatsapp_label: whatsLabel.trim(),
          whatsapp_group_url: groupUrl.trim(),
          banner_url: banner,
        },
      });
      setBannerUrl(banner);
      setBannerFile(null);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  if (!loaded) {
    return (
      <AdminShell title="Configurações">
        <p className="text-sm text-muted-foreground">Carregando…</p>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Configurações">
      <form onSubmit={submit} className="space-y-5">
        <div className="rounded-3xl border border-line bg-card p-5 shadow-soft">
          <p className="font-display text-base font-extrabold text-navy">Pagamento PIX</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-bold text-navy">Chave PIX</label>
              <input
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-line bg-surface-alt px-4 py-2.5 outline-none focus:border-pink"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-navy">Nome do recebedor</label>
              <input
                value={pixName}
                onChange={(e) => setPixName(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-line bg-surface-alt px-4 py-2.5 outline-none focus:border-pink"
              />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-line bg-card p-5 shadow-soft">
          <p className="font-display text-base font-extrabold text-navy">Suporte WhatsApp</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-bold text-navy">
                Número (só dígitos, com DDI+DDD)
              </label>
              <input
                value={whats}
                onChange={(e) => setWhats(e.target.value)}
                placeholder="5571988419659"
                className="mt-1 w-full rounded-2xl border border-line bg-surface-alt px-4 py-2.5 outline-none focus:border-pink"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-navy">Número exibido</label>
              <input
                value={whatsLabel}
                onChange={(e) => setWhatsLabel(e.target.value)}
                placeholder="(71) 98841-9659"
                className="mt-1 w-full rounded-2xl border border-line bg-surface-alt px-4 py-2.5 outline-none focus:border-pink"
              />
            </div>
          </div>
          <div className="mt-3">
            <label className="block text-sm font-bold text-navy">Link do grupo do WhatsApp</label>
            <input
              value={groupUrl}
              onChange={(e) => setGroupUrl(e.target.value)}
              placeholder="https://chat.whatsapp.com/..."
              className="mt-1 w-full rounded-2xl border border-line bg-surface-alt px-4 py-2.5 outline-none focus:border-pink"
            />
          </div>
        </div>

        <div className="rounded-3xl border border-line bg-card p-5 shadow-soft">
          <p className="font-display text-base font-extrabold text-navy">Banner do topo</p>
          {bannerUrl ? (
            <img
              src={siteUrl(bannerUrl)}
              alt="Banner atual"
              className="mt-3 max-h-40 rounded-xl border border-line object-contain"
            />
          ) : null}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setBannerFile(e.target.files?.[0] ?? null)}
            className="mt-3 w-full text-sm"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Só aparece em telas maiores (tablet/desktop) no site.
          </p>
        </div>

        {saved ? <p className="text-sm font-semibold text-green">Salvo!</p> : null}

        <button
          type="submit"
          disabled={saving}
          className="rounded-2xl bg-pink px-5 py-3 font-display font-extrabold text-navy disabled:opacity-60"
        >
          {saving ? "Salvando…" : "Salvar configurações"}
        </button>
      </form>
    </AdminShell>
  );
}
