# 13. Three columns: work, text, analysis

- Status: Accepted
- Date: 2026-09-28

## Context

The page has three jobs: choose a work, read it, and watch the characters' profiles change.
Readers in left-to-right layouts scan from left to right, and the page is used in that order:
choose a work, then read it, then look at how the characters' profiles changed as the reader went
through the text.

## Decision

Lay the page out as three columns, left to right:

1. **Work** — choose one of a few Aozora Bunko works; an introduction and credits for the chosen work.
2. **Text** — the novel, one part at a time, with controls to move to the previous or next part.
   Moving between parts fades the text out and in.
3. **Analysis** — choose a character; their chart for the current part and for the story so far,
   animated when the part changes.

## Consequences

The work column is little used after a work is chosen. Making it collapsible was considered and
left out for now; revisit if the text or analysis columns turn out to be too narrow in practice.
