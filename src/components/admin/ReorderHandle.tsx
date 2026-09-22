export function ReorderHandle({
  onUp,
  onDown,
  canUp,
  canDown,
  dragProps,
  vertical = true,
}: {
  onUp: () => void;
  onDown: () => void;
  canUp: boolean;
  canDown: boolean;
  dragProps: React.HTMLAttributes<HTMLSpanElement>;
  vertical?: boolean;
}) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center gap-1 text-muted-foreground ${
        vertical ? "flex-col" : "flex-row"
      }`}
    >
      <button
        type="button"
        aria-label="Mover para cima"
        onClick={onUp}
        disabled={!canUp}
        className="flex size-6 items-center justify-center rounded disabled:opacity-25"
      >
        ▲
      </button>
      <span
        {...dragProps}
        title="Arraste para reordenar"
        className="cursor-grab select-none px-1 text-base leading-none active:cursor-grabbing"
      >
        ⠿
      </span>
      <button
        type="button"
        aria-label="Mover para baixo"
        onClick={onDown}
        disabled={!canDown}
        className="flex size-6 items-center justify-center rounded disabled:opacity-25"
      >
        ▼
      </button>
    </div>
  );
}
