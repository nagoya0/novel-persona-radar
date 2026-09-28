import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { TraitValue } from "@/core/profile";
import type { Trait } from "@/core/types";
import { ACCUMULATED_COLOR } from "./colors";

const MAX = 4;
const TRANSITION = { duration: 0.5, ease: [0.22, 1, 0.36, 1] } as const;
const INSTANT = { duration: 0 } as const;

function rankOf(values: Record<string, TraitValue>): Map<string, number> {
  const known = Object.entries(values)
    .filter(([, v]) => v.value !== null)
    .sort((a, b) => (b[1].value ?? 0) - (a[1].value ?? 0));
  return new Map(known.map(([id], i) => [id, i + 1]));
}

/**
 * The accumulated profile as a ranking of every trait in the dictionary. When the reader turns a
 * page, bars grow or shrink and rows slide to their new places; traits entering or leaving the top
 * of the list fade. With reduced motion everything changes at once (ADR 0021): the MotionConfig
 * around the page stops the sliding, but not the fading or the bar widths.
 */
export default function TraitRanking({
  traits,
  label,
  accumulated,
  limit = 10,
}: {
  traits: Trait[];
  label: (id: string) => string;
  accumulated: Record<string, TraitValue>;
  limit?: number;
}) {
  const transition = useReducedMotion() ? INSTANT : TRANSITION;
  const now = rankOf(accumulated);
  const ranked = traits
    .filter((t) => now.has(t.id))
    .sort((a, b) => now.get(a.id)! - now.get(b.id)!)
    .slice(0, limit);

  if (!ranked.length) {
    return <p className="py-6 text-center text-sm text-muted">まだ判断できる性格がありません</p>;
  }

  return (
    <ol className="relative space-y-1.5">
      <AnimatePresence initial={false} mode="popLayout">
        {ranked.map((t) => {
          const value = accumulated[t.id].value!;
          return (
            <motion.li
              key={t.id}
              layout="position"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transition}
              className="grid grid-cols-[1.5rem_7.5rem_1fr] items-center gap-2 text-sm"
            >
              <span className="font-latin text-right text-xs text-muted">{now.get(t.id)}</span>
              <span className="truncate font-medium">{label(t.id)}</span>
              <span className="h-2.5 overflow-hidden rounded-full bg-line">
                <motion.span
                  className="block h-full rounded-full"
                  style={{ background: ACCUMULATED_COLOR, opacity: 0.7 }}
                  initial={false}
                  animate={{ width: `${(value / MAX) * 100}%` }}
                  transition={transition}
                />
              </span>
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ol>
  );
}
