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

Proposed, not yet decided. Decided so far: layout ([ADR 0013](adr/0013-three-column-layout.md)),
analysis charts ([ADR 0020](adr/0020-radar-and-timeline.md)), character list
([ADR 0022](adr/0022-characters-appear-as-met.md)).

- **Evidence in the text.** Mark the paragraphs that gave evidence for the selected character;
  hovering a trait on the radar highlights its evidence.
- **Reputation.** A second profile built from paragraphs where a character is only mentioned
  ([ADR 0032](adr/0032-on-stage-profiles-and-two-first-appearances.md)): what others say before the
  reader meets them, against who they turn out to be. Fits *Run, Melos!*, a story about trust.
  How to draw it alongside the profile is the open part.
- **Compare two characters** on the same radar (Melos and the king).
- **Detect highlights from the data.** The parts where the charts move most
  ([ADR 0018](adr/0018-highlights-and-autoplay.md)).

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

- **Random draws.** Whether near-synonyms and opposites should be kept out of the same random draw
  of axes ([ADR 0016](adr/0016-precomputed-trait-dictionary.md)).
- **Speakers absorbing what they describe.** In the screening run, the old man, who only reports the
  king's cruelty, came out *suspicious*, *cruel* and *domineering* himself. The reverse of
  *characters seen through others*: describing a trait is read as having it.
- **Accumulation.** Where evidence is strong, many traits score near the maximum at once in a single
  paragraph. Over the whole of *Run, Melos!*, weighted accumulation kept most values between 2 and 3
  out of 4 ([ADR 0035](adr/0035-trait-dictionary-from-screening.md)), so no normalisation for now;
  revisit when the charts are on screen.
- **Characters seen through others.** In paragraph 20 the king privately calls Melos a liar while
  Melos is on stage; Jev gave Melos *deceitful* evidence 0.53 with a score of 0.8. Paragraph-level
  annotation cannot separate such opinions from direct evidence (see [ADR 0032](adr/0032-on-stage-profiles-and-two-first-appearances.md)).
- **Speakers within a paragraph.** The annotation lists a paragraph's speakers but not which line
  is whose. Fine for *Run, Melos!*, where lines of dialogue are separate paragraphs; a work where
  two characters speak different lines in one paragraph would need speakers per quoted span.
- **Which works to ship.** *Run, Melos!* is short and has a clear change of heart.
  *Botchan* is long (about a thousand paragraphs, so about a thousand requests).
