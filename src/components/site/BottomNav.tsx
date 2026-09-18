const ITEMS = [
  { id: "inicio", label: "Início", icon: "🏠" },
  { id: "aulas", label: "Vídeos", icon: "▶" },
  { id: "moldes", label: "Moldes", icon: "🧶" },
  { id: "preco", label: "Preço", icon: "💰" },
  { id: "custo", label: "Custo", icon: "🧾" },
  { id: "bonus", label: "Bônus", icon: "🎁" },
];

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-[720px]">
        {ITEMS.map((it) => (
          <a
            key={it.id}
            href={`#${it.id}`}
            className="flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-bold text-navy"
          >
            <span className="text-lg leading-none">{it.icon}</span>
            {it.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
