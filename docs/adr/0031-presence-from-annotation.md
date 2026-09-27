# 31. Decide presence from the annotation, not from Jev

- Status: Accepted
- Date: 2026-09-28
- Supersedes: [0017](0017-presence-gate.md)

## Context

[ADR 0017](0017-presence-gate.md) combined name matching with a Jev yes/no question, *is this
character present or referred to here?* In the experiment behind
[ADR 0030](0030-annotated-cast-instead-of-previous-paragraphs.md), Jev answered 0.26 for the king
in paragraph 68 of *Run, Melos!* — the king's own speech and the climax of the story — because the
paragraph never names him. The gate would have discarded the most important judgment in the work.

Per-paragraph annotation now records who is present, including speakers identified from the
surrounding text.

## Decision

A character's judgments for a paragraph count only if the annotation lists the character as present
or mentioned in it. Jev is not asked about presence, and names are not matched at run time.
Characters that are only groups or walk-on parts are marked as not judged in the annotation.

## Consequences

One question fewer per character per paragraph. Presence is only as good as the annotation, which is
why it is reviewed by a person.
