# 20. The analysis column: a radar for now, a timeline for how it got there

- Status: Accepted
- Date: 2026-09-28

## Context

A radar chart shows the shape of a character at one moment but not how that shape came about.
The most telling moments of a story, such as the king's change of heart at the end of
*Run, Melos!*, are changes over time.

## Decision

The analysis column shows two charts for the selected character and axes:

- **Radar.** Two lines, as in [ADR 0005](0005-two-layer-chart.md): a thin line for the current
  part alone, and a thick line for the profile accumulated up to the current part.
- **Timeline.** A single line chart below it, with story progress across and trait strength up.
  Each line is one axis's accumulated value over the story — the thick radar line, traced through
  time.

In the timeline:

- A line is not drawn until its trait has enough accumulated evidence, and is drawn dotted while
  the evidence is thin. A trait the story never addresses never appears.
- Line colours match the radar's axes, so the radar serves as the legend.
- Hovering a line, or an axis on the radar, emphasises that trait in both charts and dims the rest.
- A marker shows the current position; highlight scenes ([ADR 0018](0018-highlights-and-autoplay.md))
  are labelled along the top; clicking a sharp change jumps to that part.

Separate small charts per trait were considered and rejected: stacked, they were harder to read
than one chart with a handful of coloured lines.

## Consequences

Two chart types to draw and animate together, which bears on the choice of charting approach.
"Not enough evidence" is shown by absence and dotted lines rather than shading.
