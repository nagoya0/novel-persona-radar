# 5. Show the current paragraph and the accumulated profile together

- Status: Superseded by [0038](0038-current-radar-and-trait-ranking.md)
- Date: 2026-09-27

## Context

Per-paragraph judgments jump around. That is expected, since each scene shows a different side of a character, and it is interesting to watch; on its own, though, it looks like noise.

## Decision

Draw two layers: a thin line for the impression from the current paragraph, and a thick line for the accumulated profile.

## Consequences

The viewer sees both how a scene reads and how it changes the overall picture.

*Amended 2026-09-28:* both layers are filled rather than drawn as a thick and a dotted line, which
were hard to tell apart. The accumulated profile is painted in a muted grey underneath and the
current part in a strong colour on top, since how a scene departs from the running profile is the
point. The current part needs less evidence before a trait is shown (0.4 instead of 0.8): a part
holds only a few paragraphs.
