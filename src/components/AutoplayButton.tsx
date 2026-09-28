import { motion } from "motion/react";

const SIZE = 44;
const STROKE = 3;
const RING_R = (SIZE - STROKE) / 2;

/**
 * A floating play/pause button for autoplay (ADR 0018). While playing, its border fills as a ring
 * over the wait before the next page; the ring restarts on every page.
 */
export default function AutoplayButton({
  playing,
  page,
  duration,
  onToggle,
}: {
  playing: boolean;
  /** Current page; the ring restarts when it changes. */
  page: number;
  /** Wait on this page in milliseconds. */
  duration: number;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      aria-label={playing ? "自動再生を止める" : "自動再生"}
      title={playing ? "自動再生を止める" : "自動再生"}
      className="relative flex items-center justify-center rounded-full bg-panel text-muted shadow-sm hover:text-foreground"
      style={{ width: SIZE, height: SIZE }}
    >
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE} className="absolute inset-0 -rotate-90">
        <circle cx={SIZE / 2} cy={SIZE / 2} r={RING_R} fill="none" stroke="var(--line)" strokeWidth={STROKE} />
        {playing && (
          <motion.circle
            key={`${page}-${duration}`}
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RING_R}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: duration / 1000, ease: "linear" }}
          />
        )}
      </svg>
      {playing ? (
        <svg viewBox="0 0 16 16" width={16} height={16} className="relative" aria-hidden>
          <rect x="3" y="2" width="3.5" height="12" rx="1" fill="currentColor" />
          <rect x="9.5" y="2" width="3.5" height="12" rx="1" fill="currentColor" />
        </svg>
      ) : (
        <svg viewBox="0 0 16 16" width={16} height={16} className="relative translate-x-px" aria-hidden>
          <path d="M4 2.5v11a1 1 0 0 0 1.5.87l9-5.5a1 1 0 0 0 0-1.74l-9-5.5A1 1 0 0 0 4 2.5z" fill="currentColor" />
        </svg>
      )}
    </button>
  );
}
