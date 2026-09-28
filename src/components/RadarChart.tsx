import { scaleLinear } from "d3-scale";
import { curveLinearClosed, lineRadial } from "d3-shape";
import type { TraitValue } from "@/core/profile";
import { AXIS_COLORS } from "./colors";

const SIZE = 340;
const R = 110;
const MAX = 4;

export default function RadarChart({
  axes,
  label,
  current,
  accumulated,
  hovered,
  onHover,
}: {
  axes: string[];
  label: (id: string) => string;
  current: Record<string, TraitValue>;
  accumulated: Record<string, TraitValue>;
  hovered: string | null;
  onHover: (id: string | null) => void;
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
    <svg viewBox={`${-SIZE / 2} ${-SIZE / 2} ${SIZE} ${SIZE}`} className="mx-auto block h-[340px] w-[340px]">
      {[1, 2, 3, 4].map((v) => (
        <circle key={v} r={r(v)} fill="none" stroke="var(--line)" strokeWidth={v === MAX ? 1.5 : 1} />
      ))}
      {axes.map((a, i) => {
        const [x, y] = point(i, R);
        const [lx, ly] = point(i, R + 26);
        const known = accumulated[a]?.value !== null;
        const dim = hovered && hovered !== a;
        return (
          <g key={a} opacity={dim ? 0.25 : 1} onMouseEnter={() => onHover(a)} onMouseLeave={() => onHover(null)} className="cursor-default">
            <line x1={0} y1={0} x2={x} y2={y} stroke={AXIS_COLORS[i]} strokeOpacity={0.35} />
            <text
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={12}
              fontWeight={600}
              fill={known ? AXIS_COLORS[i] : "var(--muted)"}
            >
              {label(a)}
              {known ? "" : " ？"}
            </text>
            <circle cx={x} cy={y} r={14} fill="transparent" />
          </g>
        );
      })}
      <path d={shape(values(accumulated)) ?? ""} fill="#2b2722" fillOpacity={0.08} stroke="#2b2722" strokeWidth={2.5} />
      <path d={shape(values(current)) ?? ""} fill="none" stroke="#2b2722" strokeWidth={1} strokeDasharray="3 3" />
      {axes.map((a, i) => {
        const v = accumulated[a]?.value;
        if (v === null || v === undefined) return null;
        const [x, y] = point(i, r(v));
        return <circle key={a} cx={x} cy={y} r={hovered === a ? 5 : 3.5} fill={AXIS_COLORS[i]} />;
      })}
    </svg>
  );
}
