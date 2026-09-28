# 21. Arrow-key navigation and reduced motion

- Status: Accepted
- Date: 2026-09-28

## Context

The page moves a lot: text fades between parts, charts morph, and autoplay keeps this going. Some people get dizzy or nauseous from on-screen motion and turn on their operating
system's reduce-motion setting, which browsers expose as `prefers-reduced-motion`.

## Decision

- The arrow keys move between parts, in the direction of vertical text
  ([ADR 0014](0014-vertical-text.md)): ← next, → previous.
- When `prefers-reduced-motion: reduce` is set, text changes without fading and charts jump to
  their new shape instead of morphing.

## Consequences

Every animation needs a reduced-motion path; the cost is small if it is built in from the start.
