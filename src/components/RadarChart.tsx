import { scaleLinear } from "d3-scale";
import { curveLinearClosed, lineRadial } from "d3-shape";
import { animate, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { TraitValue } from "@/core/profile";
import type { Trait } from "@/core/types";
import { AXIS_COLORS, CURRENT_COLOR } from "./colors";

const SIZE = 360;
const R = 108;
const LABEL_R = R + 34;
const MAX = 4;

/**
 * Tween each axis from its drawn value to its new one, so the shape morphs when the page, the
 * character or an axis changes (ADR 0013). Jumps straight there when reduced motion is set.
 */
function useMorph(target: number[]): number[] {
  const reduce = useReducedMotion();
  const [drawn, setDrawn] = useState(target);
  const latest = useRef(drawn);
  const key = target.join(",");
  useEffect(() => {
    const from = latest.current;
    const to = key.split(",").map(Number);
    const set = (v: number[]) => {
      latest.current = v;
      setDrawn(v);
    };
    if (reduce || from.length !== to.length) {
      set(to);
      return;
    }
    const controls = animate(0, 1, {
      duration: 0.45,
      ease: [0.25, 0.1, 0.25, 1],
      onUpdate: (t) => set(to.map((v, i) => from[i] + (v - from[i]) * t)),
    });
    return () => controls.stop();
  }, [key, reduce]);
  return drawn;
}

/**
 * The impression of the current part as a radar. Each axis label is a dropdown over the trait
 * dictionary, and the random button redraws all six axes (ADR 0037).
 */
export default function RadarChart({
  axes,
  traits,
  label,
  current,
  onAxisChange,
  onRandom,
}: {
  axes: string[];
  traits: Trait[];
  label: (id: string) => string;
  current: Record<string, TraitValue>;
  onAxisChange: (index: number, trait: string) => void;
  onRandom: () => void;
}) {
  const r = scaleLinear().domain([0, MAX]).range([0, R]);
  const angle = (i: number) => (i / axes.length) * Math.PI * 2;
  const shape = lineRadial<number>()
    .angle((_, i) => angle(i))
    .radius((v) => r(v))
    .curve(curveLinearClosed);
  // Rounded so the server's and the browser's Math.sin agree to the last digit when hydrating.
  const round = (v: number) => Math.round(v * 100) / 100;
  const point = (i: number, radius: number) => [
    round(Math.sin(angle(i)) * radius),
    round(-Math.cos(angle(i)) * radius),
  ];
  const known = (a: string) => current[a]?.value != null;
  // Axes without evidence sit at the centre, so the shape shrinks into them rather than jumping.
  const drawn = useMorph(axes.map((a) => current[a]?.value ?? 0));

  return (
    <div className="relative mx-auto" style={{ width: SIZE, height: SIZE }}>
      <svg viewBox={`${-SIZE / 2} ${-SIZE / 2} ${SIZE} ${SIZE}`} width={SIZE} height={SIZE} className="block">
        {[1, 2, 3, 4].map((v) => (
          <circle key={v} r={r(v)} fill="none" stroke="var(--line)" strokeWidth={v === MAX ? 1.5 : 1} />
        ))}
        {axes.map((a, i) => {
          const [x, y] = point(i, R);
          const [tx, ty] = point(i, R * 0.62);
          return (
            <g key={a}>
              <line x1={0} y1={0} x2={x} y2={y} stroke={known(a) ? AXIS_COLORS[i] : "var(--muted)"} strokeOpacity={0.35} />
              {/* No evidence in this part: say so on the axis rather than plotting a value (ADR 0003). */}
              {!known(a) && (
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
                  印象なし
                </text>
              )}
            </g>
          );
        })}
        {drawn.some((v) => v > 0) && (
          <path
            d={shape(drawn) ?? ""}
            fill={CURRENT_COLOR}
            fillOpacity={0.3}
            stroke={CURRENT_COLOR}
            strokeWidth={2}
            strokeLinejoin="round"
          />
        )}
        {axes.map((a, i) => {
          if (!known(a)) return null;
          const [x, y] = point(i, r(drawn[i]));
          return <circle key={a} cx={x} cy={y} r={3.5} fill={AXIS_COLORS[i]} />;
        })}
      </svg>

      {axes.map((a, i) => {
        const [x, y] = point(i, LABEL_R);
        return (
          <select
            key={i}
            value={a}
            onChange={(e) => onAxisChange(i, e.target.value)}
            aria-label={`軸 ${i + 1}`}
            className="absolute max-w-[132px] -translate-x-1/2 -translate-y-1/2 cursor-pointer appearance-none truncate rounded bg-transparent px-1 text-center text-xs font-semibold hover:bg-line/60 focus:bg-line/60 focus:outline-none"
            style={{ left: SIZE / 2 + x, top: SIZE / 2 + y, color: known(a) ? AXIS_COLORS[i] : "var(--muted)" }}
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
