import Link from "next/link";
import type { Reveal } from "@/core/reveal";
import type { WorkData } from "@/core/types";
import type { WorkSummary } from "@/lib/works";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import Avatar from "./Avatar";

export default function WorkColumn({
  work,
  works,
  part,
  reveal,
  onJump,
}: {
  work: WorkData;
  works: WorkSummary[];
  part: number;
  reveal: Record<string, Reveal>;
  onJump: (paragraph: number) => void;
}) {
  // The judged characters, as in the analysis column. They appear from their first mention; their
  // introduction stays hidden until they appear on stage (ADR 0032).
  const known = work.characters.filter((c) => c.judged && reveal[c.id].mention <= part);
  const [pointed, setPointed] = useState<string | null>(null);
  const shown = known.find((c) => c.id === pointed);
  const reduceMotion = useReducedMotion();
  return (
    <aside className="flex min-h-0 flex-col gap-5 overflow-y-auto border-r border-line bg-panel p-5">
      <section>
        <label className="text-xs text-muted">作品</label>
        <div className="mt-1 flex flex-col gap-1">
          {works.map((w) => (
            <Link
              key={w.id}
              href={`/works/${w.id}`}
              className={`rounded px-2 py-1 text-sm ${w.id === work.id ? "bg-foreground text-panel" : "hover:bg-line"}`}
            >
              {w.title}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h1 className="font-serif text-xl font-semibold">{work.title}</h1>
        <p className="text-sm text-muted">{work.author}</p>
        <p className="mt-3 text-sm leading-relaxed">{work.summary}</p>
      </section>

      <section>
        <label htmlFor="highlight" className="text-xs text-muted">
          場面
        </label>
        <select
          id="highlight"
          value=""
          onChange={(e) => e.target.value !== "" && onJump(Number(e.target.value))}
          className="font-latin mt-1 w-full rounded border border-line bg-panel px-2 py-1 text-sm"
        >
          <option value="">選んで移動…</option>
          {work.highlights.map((h, i) => (
            <option key={h.paragraph} value={h.paragraph}>
              §{i + 1} {h.title}
            </option>
          ))}
        </select>
      </section>

      <section>
        <h2 className="text-xs text-muted">主な登場人物</h2>
        <ul className="mt-2 grid grid-cols-2 gap-x-2 gap-y-3" onMouseLeave={() => setPointed(null)}>
          <AnimatePresence initial={false} mode="popLayout">
            {known.map((c) => {
              const met = reveal[c.id].onStage <= part;
              return (
                // A newly mentioned character pops in; the others slide to their new cells.
                <motion.li
                  key={c.id}
                  layout
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 22 }}
                  className="flex cursor-default flex-col items-center rounded text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-line"
                  tabIndex={0}
                  onMouseEnter={() => setPointed(c.id)}
                  onFocus={() => setPointed(c.id)}
                  onBlur={() => setPointed(null)}
                >
                  <Avatar id={c.id} unknown={!met} />
                  <span className={`mt-1 text-xs leading-tight transition-colors duration-700 ${met ? "" : "text-muted"}`}>
                    {c.name}
                  </span>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      </section>

      {/* The pointed character's introduction; hidden until they appear on stage (ADR 0040). */}
      {shown && (
        <section className="rounded border border-line p-3" aria-live="polite">
          <p className="text-xs leading-relaxed">
            {reveal[shown.id].onStage <= part ? shown.intro : <span className="text-muted">まだ登場していません。</span>}
          </p>
        </section>
      )}

      <section className="mt-auto border-t border-line pt-3 text-[10px] leading-relaxed text-muted">
        <p>
          本文：
          <a href={work.sourceUrl} className="underline" target="_blank" rel="noreferrer">
            青空文庫
          </a>
        </p>
        {work.credits.map((c) => (
          <p key={c}>{c}</p>
        ))}
      </section>
    </aside>
  );
}
