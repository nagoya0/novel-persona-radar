# 17. Discard judgments for characters who are not in the paragraph

- Status: Accepted
- Date: 2026-09-28

## Context

In the test behind [ADR 0016](0016-precomputed-trait-dictionary.md), the old man from the
opening scene, who is absent from the paragraph, still got evidence 0.39 and score 2.5 for
*腹黒い* (scheming) — the king's mood leaking onto another character. Weighting by evidence
([ADR 0003](0003-evidence-and-score.md)) shrinks this but does not remove it.

## Decision

Before a character's trait judgments count, decide whether the character is present or
referred to in the paragraph:

1. **Code** checks the paragraph for any of the character's names from the work's annotation
   file ([ADR 0019](0019-work-annotation-files.md)).
2. **Jev** answers one yes/no question per character, *is this character present or referred to
   here?*, in the same request as the trait questions. This catches pronouns and descriptions
   the name list misses.

A character counts as present if either says so. Trait judgments for absent characters are stored
but not accumulated.

## Consequences

One extra question per character per paragraph. How much leakage the gate removes still has to be
measured.
