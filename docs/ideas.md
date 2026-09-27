# Ideas

Things not decided yet. When an idea is settled it becomes an [ADR](adr/) and is removed from here.

## Features

- **Jump to the evidence.** Clicking a spike in the chart jumps to the paragraph that caused it
  ("this line sent *sense of justice* up"). Jev does not explain its answers; the paragraph itself
  can serve as the explanation.
- **Spoiler-free character profiles.** The profile only ever uses the text up to the reader's
  current position, so it can be shown without giving the story away.
- **Decay slider.** Let the viewer change how fast older paragraphs fade
  ([ADR 0004](adr/0004-older-paragraphs-fade.md)). The king in *Run, Melos!* is the showcase:
  with a fast decay his suspicion visibly drops at the end.
- **Reader with preconceptions.** An optional mode that passes the profile so far as context,
  to compare against the fresh-eyes default ([ADR 0006](adr/0006-context-for-each-paragraph.md)).
- **Speaker confidence.** Show how sure the speaker attribution is for each line.
- **Export a persona.** Turn an accumulated profile into a starting point for a chat character
  based on the same person.

## Interface

Proposed, not yet decided. The layout itself is in [ADR 0013](adr/0013-three-column-layout.md).

- **Vertical text.** Set the novel in vertical writing (`writing-mode: vertical-rl`), as Japanese
  fiction is printed. Consequences: "next" points left, as in a book (← for next, → for previous);
  two-digit numbers need `text-combine-upright`; a part must fit the column without scrolling.
- **Part size.** One paragraph per part by default, merging runs of short paragraphs such as
  rapid dialogue, so each part fits and the chart still moves visibly.
- **One radar, two lines.** The current part as a thin line over the accumulated profile as a
  thick one ([ADR 0005](adr/0005-two-layer-chart.md)), rather than two separate charts.
- **Trait timeline.** Below the radar, a line per trait across the story so far: how the profile
  got here. Clicking a sharp change jumps to that part.
- **Evidence in the text.** Mark the paragraphs that gave evidence for the selected character;
  hovering a trait on the radar highlights its evidence.
- **Characters appear as they are met.** The character list grows as the reader reaches each
  character's first appearance, instead of listing everyone up front.
- **Spoiler-free introduction.** The work column's summary avoids the ending. Jev cannot write
  it, so it must be written by hand or taken from a source with a compatible licence.
- **Compare two characters** on the same radar (Melos and the king).
- **Re-draw the axes** with a button ([ADR 0007](adr/0007-random-axes.md)). With precomputed
  judgments this means judging every trait in the dictionary in advance: characters × traits × 2
  questions per paragraph (5 × 30 × 2 = 300). The per-request question limit is not documented
  and needs checking.
- **Keyboard and motion.** Arrow keys move between parts; animations are reduced when the
  operating system asks for reduced motion.

## Translation choices ([ADR 0011](adr/0011-translation-decisions.md))

- Demo text: *Little Women* (public domain). Four sisters, so *sister* is an older or younger
  sister depending on who is speaking, and the sisters' ages are known, which gives ground truth.
- Split the work: Jev resolves *who* "my sister" refers to (a choice among known characters);
  code derives older or younger from their ages. Jev only guesses the relation directly when
  ages are unknown.
- Other choices with the same shape: *you* (あなた / 君 / お前 / あんた), *they*, *uncle*
  (伯父 / 叔父 depends on age relative to the parent), *cousin*.
- Early results: clear context gave 0.90–1.00; a sentence with no clue gave 0.51 / 0.49.

## Related Japanese judgments

Tested and worked, but outside this project's scope for now:

- Reading disambiguation: 辛い (からい / つらい), 生物 (せいぶつ / なまもの), 上手 (じょうず / うわて / かみて).
- Homophone misconversion: 追求 / 追及, 以外 / 意外.
- Omitted subjects: who treated whom in 「コーヒーをおごってくれた」.

## Open questions

- **Finding characters.** Candidate names from heuristics (katakana words, the word before
  は / が), then a Jev yes/no filter: *is this a character?*
- **The trait dictionary.** Where it comes from, how many traits, whether near-synonyms and
  opposites should be avoided in the same draw.
- **Which works to ship.** *Run, Melos!* is short and has a clear change of heart.
  *Botchan* is long (about a thousand paragraphs, so about a thousand requests).
- **How much context.** Two or three preceding paragraphs is a guess to be tested.
