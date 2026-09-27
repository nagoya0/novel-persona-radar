# 24. Draw charts with D3 for maths, React for SVG, Motion for animation

- Status: Accepted
- Date: 2026-09-28

## Context

The analysis column ([ADR 0020](0020-radar-and-timeline.md)) needs a radar and a timeline that
share colours and highlight together, lines that are absent or dotted depending on evidence, a
radar that morphs between parts, and a reduced-motion path for all of it
([ADR 0021](0021-keyboard-and-reduced-motion.md)).

Considered: Recharts, which draws both chart types out of the box but makes per-segment styling
and cross-chart highlighting awkward; ECharts, which animates well but sits less naturally in React
and turns fine control into configuration.

## Decision

Use D3 only for scales and path geometry (`d3-scale`, `d3-shape`), render the SVG as React
components, and animate with Motion, whose reduced-motion support covers the fallback.

## Consequences

More code than a ready-made chart component, and full control over every detail the design
calls for.
