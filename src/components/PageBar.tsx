import { type PointerEvent, useRef } from "react";

/**
 * The page count in the bottom margin of the text column. Hovering the margin turns it into a
 * progress bar across the whole width, filled from the right up to the current page; clicking or
 * dragging on it jumps to that page. Right is the first page and left the last, as in vertical text.
 * Arrow keys already turn pages globally, so the bar needs no key handling of its own.
 */
export default function PageBar({
  index,
  total,
  face,
  onJump,
}: {
  index: number;
  total: number;
  /** Typeface class of the text, so the page count matches it. */
  face: string;
  onJump: (part: number) => void;
}) {
  const bar = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const jumpTo = (clientX: number) => {
    const rect = bar.current!.getBoundingClientRect();
    const fromRight = Math.min(1, Math.max(0, (rect.right - clientX) / rect.width));
    onJump(Math.min(total - 1, Math.floor(fromRight * total)));
  };
  const down = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    jumpTo(e.clientX);
  };
  const move = (e: PointerEvent<HTMLDivElement>) => dragging.current && jumpTo(e.clientX);
  const up = () => (dragging.current = false);

  const filled = ((index + 1) / total) * 100;

  return (
    <div
      ref={bar}
      role="slider"
      aria-label="ページ"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={index + 1}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      className="group absolute inset-x-12 bottom-0 h-8 cursor-pointer select-none"
    >
      <div className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <div className="absolute inset-0 bg-line/50" />
        {/* Filled from the right edge up to the current page. */}
        <div className="absolute inset-y-0 right-0 bg-foreground/15" style={{ width: `${filled}%` }} />
        {Array.from({ length: total - 1 }, (_, i) => (
          <div
            key={i}
            className="absolute inset-y-2 w-px bg-foreground/15"
            style={{ right: `${((i + 1) / total) * 100}%` }}
          />
        ))}
      </div>
      <div className={`pointer-events-none relative flex h-full items-center justify-center text-sm tracking-widest text-muted ${face}`}>
        {index + 1} / {total}
      </div>
    </div>
  );
}
