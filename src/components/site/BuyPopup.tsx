import { useEffect, useState } from "react";

type Buyer = { name: string; city: string; state: string };

const BUYERS: Buyer[] = [
  { name: "Ana Paula Ferreira", city: "Santarém", state: "PA" },
  { name: "Maria José Castro", city: "Feira de Santana", state: "BA" },
  { name: "Cláudia Menezes", city: "Uberlândia", state: "MG" },
  { name: "Rosângela Dias", city: "Caruaru", state: "PE" },
  { name: "Fernanda Lopes", city: "Londrina", state: "PR" },
  { name: "Luciana Ramos", city: "Juazeiro do Norte", state: "CE" },
  { name: "Débora Nascimento", city: "Petrópolis", state: "RJ" },
  { name: "Simone Azevedo", city: "Sorocaba", state: "SP" },
  { name: "Patrícia Gomes", city: "Vitória da Conquista", state: "BA" },
  { name: "Vera Lúcia Santos", city: "Santa Maria", state: "RS" },
];

export function BuyPopup() {
  const [index, setIndex] = useState(-1);

  useEffect(() => {
    let i = 0;
    const show = () => {
      setIndex(i % BUYERS.length);
      i += 1;
      setTimeout(() => setIndex(-1), 5000);
    };
    const first = setTimeout(show, 6000);
    const loop = setInterval(show, 18000);
    return () => {
      clearTimeout(first);
      clearInterval(loop);
    };
  }, []);

  if (index < 0) return null;
  const buyer = BUYERS[index]!;

  return (
    <div className="fixed bottom-20 left-4 z-30 w-[260px] rounded-2xl border border-line bg-card p-3 shadow-pop">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-navy font-display text-base font-extrabold text-primary-foreground">
          {buyer.name[0]}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate font-display text-sm font-extrabold text-navy">{buyer.name}</p>
            <span className="text-green">✓</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {buyer.city} · {buyer.state}
          </p>
          <p className="mt-0.5 text-xs font-semibold text-pink-strong">
            Acabou de comprar · agora mesmo
          </p>
        </div>
      </div>
    </div>
  );
}
