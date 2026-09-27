# 15. Judge paragraphs; show parts

- Status: Accepted
- Date: 2026-09-28

## Context

*Run, Melos!* has 75 paragraphs and about 9,800 characters. The median paragraph is 66
characters, because many are a single line of dialogue, but the longest is about 1,500.

One paragraph per screen would mean 75 steps through a short story, many of them a single line
that barely moves the chart. Large parts would blur several moods into one and still need to fit
a vertical column, which at a laptop width holds roughly 500 characters.

Packing whole paragraphs up to a character budget gives, for *Run, Melos!*: 200 characters,
39 parts; 400, 23 parts; 600, 17 parts.

## Decision

Jev judges every paragraph separately, and the judgments are stored per paragraph. The screen
shows *parts*: consecutive paragraphs packed up to a character budget, starting at about 400.
A paragraph that exceeds the budget on its own is split at sentence ends. The chart for a part is
computed from the judgments of the paragraphs it contains.

## Consequences

Part size is a display setting. It can be tuned by looking at the running demo, without asking
Jev anything again.
