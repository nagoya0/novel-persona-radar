# 32. Profiles come from on-stage paragraphs; characters are listed from first mention

- Status: Accepted
- Date: 2026-09-28
- Supersedes: [0022](0022-characters-appear-as-met.md), [0031](0031-presence-from-annotation.md)

## Context

What counts as evidence of a character? A character's own words, actions and thoughts, and the
narrator's description of them, are direct evidence. What other characters say about them is weaker,
and an opinion often says more about the speaker: when the king in *Run, Melos!* calls Melos a liar,
that shows the king's suspicion, not Melos's dishonesty.

The king is talked about from the first paragraph — the old man says he kills people because he
cannot trust anyone — but does not appear until Melos is brought before him at the end of
paragraph 9. Counting the old man's account would
build the king's profile from hearsay before the reader has met him.

## Decision

The annotation records, per paragraph, which characters are **on stage** (present in the scene the
paragraph describes, whether or not they do anything in it) and which are only **mentioned**
(referred to while elsewhere). Per character, it records two first
appearances: `firstMention` and `firstOnStage`.

- **A character's profile** is built only from paragraphs where they are on stage. Mentions do not
  count.
- **The character list** shows a character from their first mention. Until their first appearance
  on stage, their introduction is shown as "？": the reader has heard of them but not met them.

Judging requests send both lists, on stage and mentioned, as context
([ADR 0030](0030-annotated-cast-instead-of-previous-paragraphs.md)). Only on-stage characters are
judged.

## Consequences

Hearsay never enters a profile. Opinions voiced by others in a scene where the character is also on
stage (the king calling Melos a liar to his face) are not separated out; evidence weighting has to
absorb them. A separate *reputation* profile built from mentions is a possible later feature.
