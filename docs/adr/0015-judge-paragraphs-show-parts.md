# 15. Judge paragraphs; show parts

- Status: Accepted
- Date: 2026-09-28

## Context

*Run, Melos!* has 75 paragraphs and about 9,800 characters. The median paragraph is 66
characters, because many are a single line of dialogue, but the longest is about 1,500.

One paragraph per screen would mean 75 steps through a short story, many of them a single line
that barely changes the chart. Large parts would combine scenes that give different impressions of
a character into a single impression, and would still need to fit a vertical column, which at a
laptop width holds roughly 500 characters.

Packing whole paragraphs up to a character budget gives, for *Run, Melos!*: 200 characters,
39 parts; 400, 23 parts; 600, 17 parts.

## Decision

Jev judges every paragraph separately, and the judgments are stored per paragraph. The screen
shows *parts*: consecutive paragraphs packed up to a character budget, starting at about 400.
A paragraph that exceeds the budget on its own is split at sentence ends. The chart for a part is
computed from the judgments of the paragraphs that start in it.

*Amended 2026-09-28:* judgments first took effect in the part that completes a paragraph. The first
paragraph of *Run, Melos!* (691 characters) spans two parts, so the opening part showed no chart
at all. A split paragraph's judgments now take effect where it starts. Splitting its weight across
its parts by length was considered; it pushes traits below the evidence threshold and shows them
as unknown, so it was rejected. The current-part impression, by contrast, uses every paragraph shown
in the part, so a part holding only the continuation of a split paragraph still has one; the
paragraph is still added to the accumulated profile only once.

## Consequences

Part size is a display setting. It can be tuned by looking at the running demo, without asking
Jev anything again.
