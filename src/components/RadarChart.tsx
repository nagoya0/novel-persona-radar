import { scaleLinear } from "d3-scale";
import { curveLinearClosed, lineRadial } from "d3-shape";
import type { TraitValue } from "@/core/profile";
import type { Trait } from "@/core/types";
import { ACCUMULATED_COLOR, AXIS_COLORS, CURRENT_COLOR } from "./colors";

const SIZE = 360;
const R = 108;
const LABEL_R = R + 34;
const MAX = 4;

/**
 * The radar (ADR 0020). Each axis label is a dropdown over the trait dictionary, so the axes are
 * chosen on the chart itself; the random button redraws all of them.
 */
export default function RadarChart({
  axes,
  traits,
  label,
  current,
  accumulated,
  emptyMessage,
  hovered,
  onHover,
  onAxisChange,
  onRandom,
}: {
  axes: string[];
  traits: Trait[];
  label: (id: string) => string;
  current: Record<string, TraitValue>;
  accumulated: Record<string, TraitValue>;
  /** Shown instead of the shapes, e.g. before the character appears. */
  emptyMessage: string | null;
  hovered: string | null;
  onHover: (id: string | null) => void;
  onAxisChange: (index: number, trait: string) => void;
  onRandom: () => void;
}) {
  const r = scaleLinear().domain([0, MAX]).range([0, R]);
  const angle = (i: number) => (i / axes.length) * Math.PI * 2;
  const shape = lineRadial<number>()
    .angle((_, i) => angle(i))
    .radius((v) => r(v))
    .curve(curveLinearClosed);
  const values = (src: Record<string, TraitValue>) => axes.map((a) => src[a]?.value ?? 0);
  const point = (i: number, radius: number) => [Math.sin(angle(i)) * radius, -Math.cos(angle(i)) * radius];

  return (
    <div className="relative mx-auto" style={{ width: SIZE, height: SIZE }}>
      <svg viewBox={`${-SIZE / 2} ${-SIZE / 2} ${SIZE} ${SIZE}`} width={SIZE} height={SIZE} className="block">
        {[1, 2, 3, 4].map((v) => (
          <circle key={v} r={r(v)} fill="none" stroke="var(--line)" strokeWidth={v === MAX ? 1.5 : 1} />
        ))}
        {axes.map((a, i) => {
          const [x, y] = point(i, R);
          // Too little evidence so far: the judgment is held back, and the axis says so (ADR 0003).
          const pending = !emptyMessage && accumulated[a]?.value === null;
          const [tx, ty] = point(i, R * 0.62);
          return (
            <g key={a}>
              <line
                x1={0}
                y1={0}
                x2={x}
                y2={y}
                stroke={pending ? "var(--muted)" : AXIS_COLORS[i]}
                strokeOpacity={hovered && hovered !== a ? 0.1 : 0.35}
              />
              {pending && (
                <text
                  x={tx}
                  y={ty}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={11}
                  fill="var(--muted)"
                  fillOpacity={0.7}
                  stroke="var(--panel)"
                  strokeWidth={3}
                  paintOrder="stroke"
                >
                  保留
                </text>
              )}
            </g>
          );
        })}
        {!emptyMessage && (
          <>
            {/* The accumulated profile underneath, this part painted over it (ADR 0005). */}
            <path d={shape(values(accumulated)) ?? ""} fill={ACCUMULATED_COLOR} fillOpacity={0.22} stroke={ACCUMULATED_COLOR} strokeWidth={1.5} />
            {axes.some((a) => current[a]?.value != null) && (
              <path d={shape(values(current)) ?? ""} fill={CURRENT_COLOR} fillOpacity={0.3} stroke={CURRENT_COLOR} strokeWidth={2} strokeLinejoin="round" />
            )}
            {axes.map((a, i) => {
              const v = accumulated[a]?.value;
              if (v === null || v === undefined) return null;
              const [x, y] = point(i, r(v));
              return <circle key={a} cx={x} cy={y} r={hovered === a ? 5 : 3.5} fill={AXIS_COLORS[i]} />;
            })}
          </>
        )}
      </svg>

      {emptyMessage && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-muted">
          {emptyMessage}
        </div>
      )}

      {axes.map((a, i) => {
        const [x, y] = point(i, LABEL_R);
        const known = !emptyMessage && accumulated[a]?.value !== null;
        const dim = hovered && hovered !== a;
        return (
          <select
            key={i}
            value={a}
            onChange={(e) => onAxisChange(i, e.target.value)}
            onMouseEnter={() => onHover(a)}
            onMouseLeave={() => onHover(null)}
            aria-label={`軸 ${i + 1}`}
            className="absolute max-w-[132px] -translate-x-1/2 -translate-y-1/2 cursor-pointer appearance-none truncate rounded bg-transparent px-1 text-center text-xs font-semibold hover:bg-line/60 focus:bg-line/60 focus:outline-none"
            style={{
              left: SIZE / 2 + x,
              top: SIZE / 2 + y,
              color: known ? AXIS_COLORS[i] : "var(--muted)",
              opacity: dim ? 0.3 : 1,
            }}
          >
            {traits.map((t) => (
              <option key={t.id} value={t.id} style={{ color: "var(--foreground)" }}>
                {label(t.id)}
              </option>
            ))}
          </select>
        );
      })}

      <button
        onClick={onRandom}
        className="absolute right-0 top-0 rounded border border-line bg-panel px-2 py-0.5 text-xs text-muted hover:border-foreground hover:text-foreground"
        title="6つの軸をまとめて引き直す"
      >
        ランダム
      </button>
    </div>
  );
}
