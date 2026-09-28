import type { ReactNode } from "react";
import type { Part } from "@/core/parts";
import type { Segment } from "@/core/types";

/** Set runs of one or two digits upright in vertical text (ADR 0014). */
function withUprightDigits(text: string, key: string): ReactNode[] {
  return text.split(/(\d{1,2})/).map((t, i) =>
    /^\d{1,2}$/.test(t) ? (
      <span key={`${key}-${i}`} className="tcy">
        {t}
      </span>
    ) : (
      t
    ),
  );
}

function renderSegments(segments: Segment[], key: string): ReactNode[] {
  return segments.flatMap((s, i): ReactNode[] =>
    typeof s === "string"
      ? withUprightDigits(s, `${key}-${i}`)
      : [
          <ruby key={`${key}-${i}`}>
            {s.rb}
            <rt>{s.rt}</rt>
          </ruby>,
        ],
  );
}

export default function TextColumn({
  part,
  index,
  total,
  onNext,
  onPrev,
}: {
  part: Part;
  index: number;
  total: number;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <section className="flex min-h-0 min-w-0 flex-col border-r border-line">
      <div className="flex min-h-0 flex-1 items-stretch">
        {/* Next is on the left, as in a printed book. */}
        <button
          onClick={onNext}
          disabled={index === total - 1}
          className="w-12 shrink-0 text-2xl text-muted hover:bg-line disabled:opacity-20"
          aria-label="次へ"
        >
          ‹
        </button>
        <div className="flex min-w-0 flex-1 justify-center overflow-x-auto py-8">
          <div className="tategaki h-full text-[17px]">
            {part.chunks.map((c, i) => (
              <p key={`${c.paragraph}-${i}`} className={c.indent ? "indent-[1em]" : ""} data-paragraph={c.paragraph}>
                {renderSegments(c.segments, `${c.paragraph}-${i}`)}
              </p>
            ))}
          </div>
        </div>
        <button
          onClick={onPrev}
          disabled={index === 0}
          className="w-12 shrink-0 text-2xl text-muted hover:bg-line disabled:opacity-20"
          aria-label="前へ"
        >
          ›
        </button>
      </div>
      <div className="flex h-10 shrink-0 items-center justify-center border-t border-line text-sm text-muted">
        {index + 1} / {total}
        <span className="ml-3 text-xs">← 次へ　前へ →</span>
      </div>
    </section>
  );
}
