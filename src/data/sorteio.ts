export type Winner = {
  name: string;
  city: string;
  prize: string;
};

const WINNERS: Winner[] = [
  {
    name: "Jussara Santos",
    city: "Santanópolis / BA",
    prize: "a máquina, os aviamentos e os R$ 500",
  },
  {
    name: "Marlene Oliveira",
    city: "Feira de Santana / BA",
    prize: "a máquina, o kit de aviamentos e os R$ 500",
  },
  {
    name: "Rosana Ferreira",
    city: "Vitória da Conquista / BA",
    prize: "a máquina, os aviamentos e os R$ 500",
  },
  {
    name: "Ivanilde Costa",
    city: "Juazeiro / BA",
    prize: "a máquina, o kit completo e os R$ 500",
  },
];

const REFERENCE_DATE = new Date("2025-01-06T00:00:00").getTime();
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export function getCurrentWinner(): Winner {
  const weeksPassed = Math.floor((Date.now() - REFERENCE_DATE) / WEEK_MS);
  const index = ((weeksPassed % WINNERS.length) + WINNERS.length) % WINNERS.length;
  return WINNERS[index]!;
}
