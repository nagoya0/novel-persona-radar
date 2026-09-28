# 34. Describe each paragraph by its voices: kind and subject

- Status: Accepted
- Date: 2026-09-28
- Amends: [0030](0030-annotated-cast-instead-of-previous-paragraphs.md)

## Context

[ADR 0030](0030-annotated-cast-instead-of-previous-paragraphs.md) gave Jev each paragraph's speakers.
Some paragraphs did not fit a list of speakers: paragraph 20 of *Run, Melos!* is narration of the
king's private thoughts, and paragraphs 37 and 46 mix narration, Melos's inner voice and a prayer
spoken aloud. Forcing these into "speaker" either misstates them or loses them.

Narration also has a subject. In a third-person work it is a narrator outside the story; in a
first-person work such as *Botchan* the narration is the protagonist's own voice, and much of the
evidence about them is in it.

## Decision

Each paragraph lists its **voices**, pairs of *kind* and *subject*:

- `narrative` — narration; subject `narrator`
- `speech` — spoken aloud; subject is a character
- `thoughts` — thoughts or feelings rendered, whether narrated or as inner monologue; subject is a character

A paragraph lists every voice it contains, without recording which sentence is which. The work
records who `narrator` is: an outside narrator (`{"person": "third", "character": null}`) or a
character, for first-person works.

Each paragraph may also carry:

- `context` — a short note sent to Jev to read the paragraph correctly: who "その男" refers to, that
  a line is spoken by two people at once. It must describe only this paragraph and nothing that
  happens later.
- `reviewNote` — for the person reviewing the annotation. Never sent to Jev.

## Consequences

Judging requests send the paragraph, its voices, the characters on stage and mentioned
([ADR 0032](0032-on-stage-profiles-and-two-first-appearances.md)) and its context. For a
first-person work, the narrator's character is judged from narration as well.
