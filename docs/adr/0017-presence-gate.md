# 17. Discard judgments for characters who are not in the paragraph

- Status: Superseded by [0031](0031-presence-from-annotation.md)
- Date: 2026-09-28

## Context

The test behind [ADR 0016](0016-precomputed-trait-dictionary.md) used one paragraph of
*Run, Melos!* in which the king privately sneers that Melos will never come back. Only the king and
Melos are in that scene, but all five characters were judged. The old man, who appears only in the
opening scene and is not in this paragraph, still got evidence 0.39 and score 2.5 for *腹黒い*
(scheming): a trait of the king, the character the paragraph is about, was attributed to a character
who is absent. Weighting by evidence ([ADR 0003](0003-evidence-and-score.md)) shrinks this but does
not remove it.

This is a different error from the one recorded in [ideas](../ideas.md) as *speakers absorbing what
they describe*, where a character who is present and describes another's trait is judged to have
it. A check on presence cannot catch that one.

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
