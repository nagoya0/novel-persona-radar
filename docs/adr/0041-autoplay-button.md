# 41. Autoplay as a floating button, paced by lines

- Status: Accepted
- Date: 2026-09-29

## Context

Autoplay ([ADR 0018](0018-highlights-and-autoplay.md)) is a convenience, not a main feature:
reading page by page stays the primary way through a work. It should be at hand without taking
space from the text.

## Decision

- **A floating round button** in the bottom-left corner of the text column, over the next-page
  button and the end of the page bar. The corner keeps it clear of the text, and left is the
  direction of reading.
- **Play and pause.** It shows ▶, and ⏸ while playing. While playing, its border fills as a ring
  over the wait before the next page, and restarts on every page.
- **Paced by lines.** The wait is 3 seconds per vertical line on the page, so a page of dialogue
  turns sooner than a page of narration. Lines are estimated from the fitted font size and the text
  height; on *Run, Melos!* the estimate matched the rendered lines exactly.
- **Stopping.** Turning pages by hand (side buttons, arrow keys, page bar, scene picker) stops
  autoplay; it stops by itself after the last page. Pressing play on the last page starts over from
  the first.
- **Side buttons** are widened from 48 to 64 pixels.

## Consequences

Three seconds a line is a reading pace, about ten characters a second; a whole work takes several
minutes. The pace is one constant in `TextColumn.tsx` if it needs tuning.
