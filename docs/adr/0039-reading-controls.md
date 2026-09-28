# 39. Reading controls: side buttons, a page bar, a typeface switch and deep links

- Status: Accepted
- Date: 2026-09-28

## Context

The text column needs ways to move through a work and a little control over how it reads, without
competing with the text. Settings that change how much text fits a part are ruled out
([ADR 0036](0036-fit-text-size-to-the-screen.md)).

## Decision

- **Side buttons.** A full-height button on each side of the text, labelled 次 (left) and 前
  (right) under an arrow, in the text's typeface.
- **Page count and page bar.** The page count sits over the bottom margin, so the top and bottom
  margins stay equal. Hovering the margin turns it into a solid bar across the text width, filled
  from the right up to the current page, with a tick per page; clicking or dragging on it jumps to
  that page. Right is the first page, as in vertical text.
- **Keyboard.** Arrow keys turn pages ([ADR 0021](0021-keyboard-and-reduced-motion.md)), except
  while a form control (the axis dropdowns, the scene picker) has focus.
- **Typeface.** A header switch between Mincho and Gothic. Both are full-width, so the fitted size
  still holds.
- **Trait labels.** Always the casual labels. A casual/formal switch was built and removed; the
  formal labels stay in the dictionary.
- **Deep links.** `?part=<n>&character=<id>` opens a work at a page (1-based) with a character
  selected, for sharing and for screenshots.

## Consequences

The page bar is invisible until hovered, so it does not add clutter, but it must be discovered;
the README should mention it. A deep link renders page 1 first and then jumps, so animations play
on load.
