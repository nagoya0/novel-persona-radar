# 36. Fit the text size to the screen; design for 1920 × 1080

- Status: Accepted
- Date: 2026-09-28
- Amends: [0012](0012-desktop-browser-first.md), [0015](0015-judge-paragraphs-show-parts.md)

## Context

In the first prototype the vertical text was set at a fixed 17 px, which looked small. Enlarging it
made full parts overflow the column: a part of about 400 characters and up to seven paragraphs only
fits a laptop-sized column at around 19 px.

Screen resolution is not the browser's width. A 1920 × 1080 laptop at 125 % or 150 % scaling gives
the page 1536 × 864 or 1280 × 720 CSS pixels; a MacBook Air gives about 1470 × 956. On laptops,
the page may well be around 1500 px wide.

Letting the reader change the font size was considered and rejected: text size and part size are
tied, so a larger font would need re-packed parts, changing their number and how the charts move.

## Decision

- Design for 1920 × 1080 at 100 % as the best case; keep everything working down to 1280 px wide.
- Keep the part budget at about 400 characters. Compute one font size per screen: the largest,
  up to 30 px, at which the fullest part of the work fits the text column without scrolling.
  It is recomputed when the window is resized, and is the same for every part.
- Let the side columns scale with the viewport within limits, so wide screens give the extra room
  to the text.

## Consequences

At 1920 × 1080 the text is set large; at 1440 × 900 it is about the size of the first prototype.
No per-reader settings to design or explain. Browser zoom still works, and past a point triggers the
narrow-screen fallback ([ADR 0012](0012-desktop-browser-first.md)).
