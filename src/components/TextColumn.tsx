import { type ReactNode, useEffect, useRef, useState } from "react";
import type { Part } from "@/core/parts";
import type { Segment } from "@/core/types";
import type { Typeface } from "./WorkView";

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

const LINE_HEIGHT = 1.85;
const MAX_FONT = 30;
const MIN_FONT = 14;
const PADDING_Y = 64; // py-8
const PADDING_X = 24;

/**
 * The largest font size at which a full part fits the column without scrolling (ADR 0012, 0015).
 * A part of `chars` characters in `paragraphs` paragraphs needs about chars·fs/height lines plus
 * one partial line per paragraph, each fs·LINE_HEIGHT wide:
 *   (chars·fs/height + paragraphs) · fs · LINE_HEIGHT ≤ width
 * Characters are inflated for letter spacing and line-breaking rules.
 */
export function fitFontSize(width: number, height: number, chars: number, paragraphs: number): number {
  const c = chars * 1.05 * 1.1;
  const a = (c * LINE_HEIGHT) / height;
  const b = paragraphs * LINE_HEIGHT;
  const fs = (-b + Math.sqrt(b * b + 4 * a * width)) / (2 * a);
  return Math.max(MIN_FONT, Math.min(MAX_FONT, Math.floor(fs)));
}

export default function TextColumn({
  part,
  index,
  total,
  budget,
  maxParagraphs,
  onNext,
  onPrev,
  typeface,
}: {
  part: Part;
  index: number;
  total: number;
  /** Largest number of characters in any part. */
  budget: number;
  /** Largest number of paragraphs in any part. */
  maxParagraphs: number;
  onNext: () => void;
  onPrev: () => void;
  /** Mincho or Gothic; both are full-width, so the fitted size still holds. */
  typeface: Typeface;
}) {
  // One font size for the whole work, sized so that the fullest part fits this screen.
  const box = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(18);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () =>
      setFontSize(fitFontSize(el.clientWidth - PADDING_X, el.clientHeight - PADDING_Y, budget, maxParagraphs));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [budget, maxParagraphs]);

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
        <div ref={box} className="flex min-w-0 flex-1 justify-center overflow-hidden py-8">
          <div className={`tategaki h-full ${typeface === "sans" ? "font-sans" : "font-serif"}`} style={{ fontSize }}>
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
