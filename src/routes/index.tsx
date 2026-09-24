import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Hero } from "@/components/site/Hero";
import { Sorteio } from "@/components/site/Sorteio";
import { Pagamento } from "@/components/site/Pagamento";
import { Moldes } from "@/components/site/Moldes";
import { Aulas } from "@/components/site/Aulas";
import { ConteudoExclusivo } from "@/components/site/ConteudoExclusivo";
import { Precificacao } from "@/components/site/Precificacao";
import { CustoProducao } from "@/components/site/CustoProducao";
import { Bonus } from "@/components/site/Bonus";
import { BottomNav } from "@/components/site/BottomNav";
import { BuyPopup } from "@/components/site/BuyPopup";
import { PagamentoNaoIdentificado } from "@/components/site/PagamentoNaoIdentificado";
import { getPublicData } from "@/api/public-data";
import { siteUrl } from "@/lib/storage-url";

export const Route = createFileRoute("/")({
  loader: () => getPublicData(),
  head: () => ({
    meta: [
      { title: "Crochê da Rosenilda — Curso Completo de Crochê" },
      {
        name: "description",
        content:
          "Receitas e gráficos profissionais de crochê, com videoaulas, passo a passo e calculadoras de preço e custo.",
      },
      {
        property: "og:title",
        content: "Crochê da Rosenilda — Curso Completo de Crochê",
      },
      {
        property: "og:description",
        content:
          "Receitas e gráficos completos, videoaulas e ferramentas de precificação para lucrar com crochê.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { moldes, videos, settings, winner, exclusivePreview } = Route.useLoaderData();
  const [custo, setCusto] = useState(0);

  return (
    <main className="pb-20">
      {settings.banner_url ? (
        <img
          src={siteUrl(settings.banner_url)}
          alt="Curso Completo de Crochê — receitas, gráficos completos e videoaulas"
          className="mx-auto hidden w-full max-w-[720px] sm:block"
        />
      ) : null}
      <Hero />
      <Sorteio winner={winner} />
      <Pagamento pixKey={settings.pix_key} pixName={settings.pix_name} />
      <ConteudoExclusivo preview={exclusivePreview} />
      <Aulas videos={videos} />
      <Moldes moldes={moldes} />
      <Precificacao custo={custo} />
      <CustoProducao onUseCost={setCusto} />
      <Bonus />

      <footer className="bg-navy-deep px-5 py-10 text-center">
        <p className="font-display text-lg font-extrabold text-primary-foreground">
          Crochê da Rosenilda
        </p>
        <p className="mt-1 text-sm text-primary-foreground/70">
          Curso Completo de Crochê
        </p>
        <p className="mt-2 text-sm text-primary-foreground/70">
          © {new Date().getFullYear()} — Todos os direitos reservados.
        </p>
      </footer>

      <BuyPopup />
      <PagamentoNaoIdentificado
        pixKey={settings.pix_key}
        whatsapp={settings.suporte_whatsapp}
        whatsappLabel={settings.suporte_whatsapp_label}
        groupUrl={settings.whatsapp_group_url}
      />
      <BottomNav />
    </main>
  );
}
