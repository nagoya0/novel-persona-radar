# 35. Choose the trait dictionary by screening a whole work

- Status: Accepted
- Date: 2026-09-28

## Context

[ADR 0016](0016-precomputed-trait-dictionary.md) fixed a dictionary of about 30 traits. Picking
them by intuition risks traits that never move. A hundred candidates
([data/traits/candidates.json](../../data/traits/candidates.json)) were taken from Patrick
Gunkel's Ideonomy list of personality traits, leaving out traits the text cannot show (looks,
health) and near-duplicates.

All 100 were judged for every judged character in every paragraph where they are on stage in
*Run, Melos!*: 152 requests, about 2 million input tokens, about US$0.09, one minute. For each
trait, the evidence-weighted score per character, the spread of those scores across characters,
and the change over time with decay were compared.

Findings:

- Characters came out distinct. Melos: earnest, passionate, upright, determined, idealistic. The
  king: stern, authoritarian, suspicious, domineering, arrogant. Selinuntius: loyal, trusting,
  considerate. The sister: guileless, optimistic, dreamy. The bandits: hostile, domineering, selfish.
- Accumulated scores sat mostly between 2 and 3 out of 4; strong single paragraphs did not push
  every trait to the maximum.
- The king's change of heart shows. With a decay of 0.85 per on-stage paragraph, *suspicious* went
  from 3.2 (paragraph 20) to 1.4 (paragraph 70), *forgiving* from 0.1 to 2.0, *trusting* from 0.1
  to 1.6.
- Stinginess, scheming and trickery got almost no evidence in this story.

## Decision

The dictionary ([data/traits/dictionary.json](../../data/traits/dictionary.json)) holds 30 traits,
chosen for spread across characters, movement over the story, and variety, with one trait per
cluster of near-synonyms. A few traits that did not separate characters in *Run, Melos!* (*leaderly*,
*irritable*, *uninhibited*) were kept because they are likely to matter in other works and have
engaging labels.

## Consequences

The dictionary is tuned on one short story; screening another work may suggest swaps. Japanese
labels are display-only and can be changed at any time without judging again. Changing the English
word or gloss of a trait means judging it again.
