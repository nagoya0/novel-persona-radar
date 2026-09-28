# 37. Six axes, chosen on the radar itself

- Status: Accepted
- Date: 2026-09-28
- Amends: [0016](0016-precomputed-trait-dictionary.md), [0020](0020-radar-and-timeline.md)

## Context

The first prototype picked axes from a separate panel of 30 trait chips below the charts, allowing
three to eight axes. The panel took a lot of room, and choosing an axis happened away from where
its effect showed.

## Decision

- The radar always has six axes: enough for a readable shape, few enough lines for the timeline.
- Each axis label is a dropdown over the trait dictionary. Choosing a trait that is already on
  another axis swaps the two, so no trait appears twice.
- A button at the top right of the radar redraws all six axes at random, without repeats.
- The radar stays visible, with its axes selectable, before the selected character has appeared;
  the shapes are replaced by a short note.

## Consequences

No separate axis panel. The number of axes is no longer adjustable.
