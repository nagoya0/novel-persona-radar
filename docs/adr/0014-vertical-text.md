# 14. Set the novel in vertical text

- Status: Accepted
- Date: 2026-09-28

## Context

Japanese fiction is printed in vertical writing, and the works shown here were written for it.
The demo targets desktop browsers ([ADR 0012](0012-desktop-browser-first.md)), so the usual
objection to vertical text on the web, narrow phone screens, does not apply.

## Decision

Set the text column in vertical writing (`writing-mode: vertical-rl`), read right to left.

- "Next" points left, as in a printed book: ← moves to the next part, → to the previous one.
- Two-digit numbers are set upright with `text-combine-upright`.
- A part must fit the column without scrolling ([ADR 0015](0015-judge-paragraphs-show-parts.md)).

## Consequences

The text column reads right to left inside a page laid out left to right; the navigation
controls have to make the direction obvious. Ruby from Aozora Bunko works in vertical text.
