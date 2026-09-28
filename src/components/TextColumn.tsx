import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import type { Part } from "@/core/parts";
import type { Segment } from "@/core/types";
import AutoplayButton from "./AutoplayButton";
import PageBar from "./PageBar";
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

/** Seconds of autoplay per line of text on the page (ADR 0018). */
const SECONDS_PER_LINE = 3;

/**
 * About how many vertical lines a part takes: each paragraph starts a new line, and a line holds
 * as many characters as fit the text height (letter spacing is 0.05em, see globals.css).
 */
function countLines(part: Part, fontSize: number, height: number): number {
  const perLine = Math.max(1, Math.floor(height / (fontSize * 1.05)));
  return part.chunks.reduce((n, c) => n + Math.ceil((c.length + (c.indent ? 1 : 0)) / perLine), 0);
}

export default function TextColumn({
  part,
  index,
  total,
  budget,
  maxParagraphs,
  onNext,
  onPrev,
  onJump,
  typeface,
  playing,
  onTogglePlay,
  onAdvance,
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
  /** Jump to a part (0-based), from the page slider. */
  onJump: (part: number) => void;
  /** Mincho or Gothic; both are full-width, so the fitted size still holds. */
  typeface: Typeface;
  playing: boolean;
  onTogglePlay: () => void;
  /** Turn to the next page during autoplay (without stopping it). */
  onAdvance: () => void;
}) {
  // One font size for the whole work, sized so that the fullest part fits this screen.
  const box = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(18);
  const [textHeight, setTextHeight] = useState(600);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => {
      setFontSize(fitFontSize(el.clientWidth - PADDING_X, el.clientHeight - PADDING_Y, budget, maxParagraphs));
      setTextHeight(el.clientHeight - PADDING_Y);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [budget, maxParagraphs]);

  // Autoplay waits in proportion to how much text the page holds.
  const duration = countLines(part, fontSize, textHeight) * SECONDS_PER_LINE * 1000;
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(onAdvance, duration);
    return () => clearTimeout(t);
  }, [playing, index, duration, onAdvance]);

  const reduceMotion = useReducedMotion();
  const face = typeface === "sans" ? "font-sans" : "font-serif";
  const nav = `flex w-16 shrink-0 flex-col items-center justify-center gap-1 text-muted hover:bg-line disabled:opacity-20 ${face}`;
  return (
    <section className="relative flex min-h-0 min-w-0 flex-col border-r border-line">
      <div className="flex min-h-0 flex-1 items-stretch">
        {/* Next is on the left, as in a printed book. */}
        <button onClick={onNext} disabled={index === total - 1} className={nav} aria-label="次へ">
          <span className="text-2xl leading-none">‹</span>
          <span className="text-sm">次</span>
        </button>
        <div ref={box} className="flex min-w-0 flex-1 justify-center overflow-hidden py-8">
          {/* The old part fades out before the new one fades in (ADR 0013); with reduced motion the
              text changes at once (ADR 0021). */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={index}
              className={`tategaki h-full ${face}`}
              style={{ fontSize }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: reduceMotion ? 0 : 0.2, ease: "easeOut" } }}
              exit={{ opacity: 0, transition: { duration: reduceMotion ? 0 : 0.12, ease: "easeIn" } }}
            >
              {part.chunks.map((c, i) => (
                <p key={`${c.paragraph}-${i}`} className={c.indent ? "indent-[1em]" : ""} data-paragraph={c.paragraph}>
                  {renderSegments(c.segments, `${c.paragraph}-${i}`)}
                </p>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
        <button onClick={onPrev} disabled={index === 0} className={nav} aria-label="前へ">
          <span className="text-2xl leading-none">›</span>
          <span className="text-sm">前</span>
        </button>
      </div>
      {/* The column's bottom-left corner, over the side button and the page bar (ADR 0041). */}
      <div className="absolute bottom-3 left-3 z-10">
        <AutoplayButton playing={playing} page={index} duration={duration} onToggle={onTogglePlay} />
      </div>
      {/* Over the bottom margin, so top and bottom margins stay equal. */}
      <PageBar index={index} total={total} face={face} onJump={onJump} />
    </section>
  );
}
