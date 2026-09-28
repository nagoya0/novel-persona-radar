import { scaleLinear } from "d3-scale";
import type { MouseEvent } from "react";
import type { PartProfile } from "@/core/profile";
import { AXIS_COLORS } from "./colors";

const W = 420;
const H = 190;
const M = { top: 34, right: 10, bottom: 18, left: 22 };
const MAX = 4;
/** Below this much accumulated evidence a line is drawn dotted (ADR 0020). */
const DOTTED_BELOW = 1.6;

export default function TimelineChart({
  axes,
  label,
  profile,
  part,
  highlights,
  hovered,
  onHover,
  onJumpPart,
}: {
  axes: string[];
  label: (id: string) => string;
  profile: PartProfile[];
  part: number;
  highlights: { part: number; title: string }[];
  hovered: string | null;
  onHover: (id: string | null) => void;
  onJumpPart: (part: number) => void;
}) {
  const n = profile.length;
  const x = scaleLinear().domain([0, n - 1]).range([M.left, W - M.right]);
  const y = scaleLinear().domain([0, MAX]).range([H - M.bottom, M.top]);

  const onClick = (e: MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const local = pt.matrixTransform(svg.getScreenCTM()!.inverse());
    onJumpPart(Math.round(x.invert(local.x)));
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full cursor-pointer" onClick={onClick}>
      {[0, 1, 2, 3, 4].map((v) => (
        <g key={v}>
          <line x1={M.left} x2={W - M.right} y1={y(v)} y2={y(v)} stroke="var(--line)" />
          <text x={M.left - 6} y={y(v)} fontSize={9} textAnchor="end" dominantBaseline="middle" fill="var(--muted)">
            {v}
          </text>
        </g>
      ))}
      {highlights.map((h) => (
        <g key={h.title}>
          <line x1={x(h.part)} x2={x(h.part)} y1={M.top - 4} y2={H - M.bottom} stroke="var(--line)" strokeDasharray="2 3" />
          <text x={x(h.part)} y={M.top - 8} fontSize={9} textAnchor="middle" fill="var(--muted)">
            {h.title.length > 5 ? h.title.slice(0, 5) + "…" : h.title}
            <title>{h.title}</title>
          </text>
        </g>
      ))}
      {axes.map((a, i) => {
        const dim = hovered && hovered !== a;
        const segs = [];
        // Only up to where the reader is: later parts would give the story away.
        for (let k = 1; k <= part; k++) {
          const p0 = profile[k - 1].accumulated[a];
          const p1 = profile[k].accumulated[a];
          if (p0?.value == null || p1?.value == null) continue;
          segs.push(
            <line
              key={k}
              x1={x(k - 1)}
              y1={y(p0.value)}
              x2={x(k)}
              y2={y(p1.value)}
              stroke={AXIS_COLORS[i]}
              strokeWidth={hovered === a ? 3 : 2}
              strokeDasharray={p1.evidence < DOTTED_BELOW ? "2 3" : undefined}
              strokeLinecap="round"
            />,
          );
        }
        // A dot at the current position, so a trait shows even before it has a segment to draw.
        const now = profile[part].accumulated[a]?.value;
        return (
          <g key={a} opacity={dim ? 0.15 : 1} onMouseEnter={() => onHover(a)} onMouseLeave={() => onHover(null)}>
            {segs}
            {now != null && <circle cx={x(part)} cy={y(now)} r={hovered === a ? 4 : 3} fill={AXIS_COLORS[i]} />}
            <title>{label(a)}</title>
          </g>
        );
      })}
      <line x1={x(part)} x2={x(part)} y1={M.top - 2} y2={H - M.bottom} stroke="#2b2722" strokeWidth={1.5} />
      <text x={x(part)} y={H - 4} fontSize={9} textAnchor="middle" fill="#2b2722">
        ▲
      </text>
    </svg>
  );
}
