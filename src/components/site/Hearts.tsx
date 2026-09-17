const GLYPHS = ["♥", "✦", "✧", "♡", "❤"];
const COLORS = ["text-pink", "text-pink-strong", "text-orange", "text-green", "text-denim"];

export function Hearts({ count = 22 }: { count?: number }) {
  const items = Array.from({ length: count }, (_, i) => {
    const seed = (i * 9301 + 49297) % 233280;
    const r = seed / 233280;
    return {
      ch: GLYPHS[i % GLYPHS.length],
      color: COLORS[(i * 3) % COLORS.length],
      left: Math.round(r * 96) + 2,
      size: 12 + Math.round(r * 16),
      dur: 11 + Math.round(r * 9),
      delay: (i * 0.7) % 12,
      dx: `${Math.round((r - 0.5) * 90)}px`,
    };
  });

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((it, i) => (
        <span
          key={i}
          className={`heart-rise ${it.color}`}
          style={{
            left: `${it.left}%`,
            fontSize: `${it.size}px`,
            animationDuration: `${it.dur}s`,
            animationDelay: `${it.delay}s`,
            ["--dx" as string]: it.dx,
          }}
        >
          {it.ch}
        </span>
      ))}
    </div>
  );
}
