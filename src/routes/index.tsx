import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Hero } from "@/components/site/Hero";
import { Sorteio } from "@/components/site/Sorteio";
import { Pagamento } from "@/components/site/Pagamento";
import { Moldes } from "@/components/site/Moldes";
import { Aulas } from "@/components/site/Aulas";
import { Precificacao } from "@/components/site/Precificacao";
import { CustoProducao } from "@/components/site/CustoProducao";
import { Bonus } from "@/components/site/Bonus";
import { BottomNav } from "@/components/site/BottomNav";
import { BuyPopup } from "@/components/site/BuyPopup";
import { PagamentoNaoIdentificado } from "@/components/site/PagamentoNaoIdentificado";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Academia de Bolsas Graziele Sampaio — Curso Completo Bolsas & Necessaires em Jeans" },
      {
        name: "description",
        content:
          "200 moldes profissionais de bolsas e necessaires em jeans, com videoaulas, passo a passo, medidas e calculadoras de preço e custo.",
      },
      {
        property: "og:title",
        content: "Academia de Bolsas Graziele Sampaio — Curso Completo Bolsas & Necessaires em Jeans",
      },
      {
        property: "og:description",
        content:
          "+200 moldes com medidas, 55 videoaulas e ferramentas de precificação para lucrar com bolsas em jeans.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [custo, setCusto] = useState(0);

  return (
    <main className="pb-20">
      <img
        src="/banner-topo.jpg"
        alt="Curso Completo Bolsas & Necessaires — mais de 200 moldes completos e videoaulas"
        className="w-full"
      />
      <Hero />
      <Sorteio />
      <Pagamento />
      <Moldes />
      <Aulas />
      <Precificacao custo={custo} />
      <CustoProducao onUseCost={setCusto} />
      <Bonus />

      <footer className="bg-navy-deep px-5 py-10 text-center">
        <p className="font-display text-lg font-extrabold text-primary-foreground">
          Academia de Bolsas Graziele Sampaio
        </p>
        <p className="mt-1 text-sm text-primary-foreground/70">
          Curso Completo — Bolsas &amp; Necessaires
        </p>
        <p className="mt-2 text-sm text-primary-foreground/70">
          © {new Date().getFullYear()} — Todos os direitos reservados.
        </p>
      </footer>

      <BuyPopup />
      <PagamentoNaoIdentificado />
      <BottomNav />
    </main>
  );
}
