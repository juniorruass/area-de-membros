// Gerado a partir dos arquivos presentes em public/materiais/.
// Mapeia o titulo exato do molde (src/data/moldes.ts) para o arquivo e a capa.
// 'cover' e sempre uma imagem (renderizada da 1a pagina, se o arquivo for PDF).
// Titulos sem entrada aqui ainda nao tem arquivo — o site mostra 'Em breve'.
export type Material = { file: string; cover: string; kind: "pdf" | "imagem" };

export const MATERIAIS: Record<string, Material> = {
  "Bolsa Backpack": { file: "bolsa-backpack.png", cover: "bolsa-backpack.png", kind: "imagem" },
  "Bolsa Bolsos": { file: "bolsa-bolsos.png", cover: "bolsa-bolsos.png", kind: "imagem" },
  "Bolsa Boro Simples": { file: "bolsa-boro-simples.png", cover: "bolsa-boro-simples.png", kind: "imagem" },
  "Bolsa Cilíndrica": { file: "bolsa-cilindrica.png", cover: "bolsa-cilindrica.png", kind: "imagem" },
  "Bolsa Cluth": { file: "bolsa-cluth.png", cover: "bolsa-cluth.png", kind: "imagem" },
  "Bolsa Denin": { file: "bolsa-denin.png", cover: "bolsa-denin.png", kind: "imagem" },
  "Bolsa Denon Bucket": { file: "bolsa-denon-bucket.png", cover: "bolsa-denon-bucket.png", kind: "imagem" },
  "Bolsa Estampa Libélula": { file: "bolsa-estampa-libelula.png", cover: "bolsa-estampa-libelula.png", kind: "imagem" },
  "Bolsa Estlilo Sacola": { file: "bolsa-estlilo-sacola.png", cover: "bolsa-estlilo-sacola.png", kind: "imagem" },
  "Bolsa Jeans com Laços": { file: "bolsa-jeans-com-lacos.png", cover: "bolsa-jeans-com-lacos.png", kind: "imagem" },
  "Bolsa Melinda": { file: "bolsa-melinda.pdf", cover: "capas/bolsa-melinda.png", kind: "pdf" },
  "Bolsa Melissa": { file: "bolsa-melissa.pdf", cover: "capas/bolsa-melissa.png", kind: "pdf" },
  "Bolsa Mode Cartera Small": { file: "bolsa-mode-cartera-small.png", cover: "bolsa-mode-cartera-small.png", kind: "imagem" },
  "Bolsa Modelo": { file: "bolsa-modelo.png", cover: "bolsa-modelo.png", kind: "imagem" },
  "Bolsa Molde Cartera": { file: "bolsa-molde-cartera.png", cover: "bolsa-molde-cartera.png", kind: "imagem" },
  "Bolsa Multibolsos": { file: "bolsa-multibolsos.png", cover: "bolsa-multibolsos.png", kind: "imagem" },
  "Bolsa Patch": { file: "bolsa-patch.png", cover: "bolsa-patch.png", kind: "imagem" },
  "Bolsa Patch Work": { file: "bolsa-patch-work.png", cover: "bolsa-patch-work.png", kind: "imagem" },
  "Bolsa Saco Moderno": { file: "bolsa-saco-moderno.png", cover: "bolsa-saco-moderno.png", kind: "imagem" },
  "Bolsa Tote Bag": { file: "bolsa-tote-bag.png", cover: "bolsa-tote-bag.png", kind: "imagem" },
  "Bolsa Tote Big": { file: "bolsa-tote-big.png", cover: "bolsa-tote-big.png", kind: "imagem" },
  "Bolsa tote Jeans": { file: "bolsa-tote-jeans.png", cover: "bolsa-tote-jeans.png", kind: "imagem" },
  "Bolsa Transversal (2)": { file: "bolsa-transversal-2.png", cover: "bolsa-transversal-2.png", kind: "imagem" },
  "Bolsa Transversal (3)": { file: "bolsa-transversal-3.png", cover: "bolsa-transversal-3.png", kind: "imagem" },
  "Bolsa Transversal Baú": { file: "bolsa-transversal-bau.png", cover: "bolsa-transversal-bau.png", kind: "imagem" },
  "Casual com Alças": { file: "casual-com-alcas.png", cover: "casual-com-alcas.png", kind: "imagem" },
  "Mochila Patchwork": { file: "mochila-patchwork.png", cover: "mochila-patchwork.png", kind: "imagem" },
  "Bolsinha Melissa": { file: "bolsinha-melissa.pdf", cover: "capas/bolsinha-melissa.png", kind: "pdf" },
  "Necessaire Cubo": { file: "necessaire-cubo.pdf", cover: "capas/necessaire-cubo.png", kind: "pdf" },
  "Bolsa 05 Vintage": { file: "bolsa-05-vintage.pdf", cover: "capas/bolsa-05-vintage.png", kind: "pdf" },
  "Bolsa Black": { file: "bolsa-black.pdf", cover: "capas/bolsa-black.png", kind: "pdf" },
  "Mochila Antifurto Casual": { file: "96_mochila_antifurto_molde_a4.pdf", cover: "capas/96_mochila_antifurto_molde_a4.png", kind: "pdf" },
  "Bolsa Premium Multiposições": { file: "97_bolsa_premium_multiposicoes_molde_a4.pdf", cover: "capas/97_bolsa_premium_multiposicoes_molde_a4.png", kind: "pdf" },
  "Bolsa Flap Mini": { file: "98_bolsa_flap_mini_molde_a4.pdf", cover: "capas/98_bolsa_flap_mini_molde_a4.png", kind: "pdf" },
  "Bolsa Crescent": { file: "99_bolsa_crescent_molde_a4.pdf", cover: "capas/99_bolsa_crescent_molde_a4.png", kind: "pdf" },
  "Bolsa Academia Casual": { file: "100_bolsa_academia_casual_molde_a4.pdf", cover: "capas/100_bolsa_academia_casual_molde_a4.png", kind: "pdf" },
};
